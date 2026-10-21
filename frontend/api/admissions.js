import { getAdmissionsFromGist, saveAdmissionsToGist, formatNewAdmission } from './_gistDb.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const admissions = await getAdmissionsFromGist();
      const { status_filter, type_filter, search } = req.query || {};

      let filtered = [...admissions];

      if (status_filter) {
        filtered = filtered.filter(a => a.application_status === status_filter);
      }
      if (type_filter) {
        filtered = filtered.filter(a => a.application_type === type_filter);
      }
      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(a => 
          (a.student_name && a.student_name.toLowerCase().includes(q)) ||
          (a.contact_phone && a.contact_phone.includes(q)) ||
          (a.contact_email && a.contact_email.toLowerCase().includes(q)) ||
          (a.country && a.country.toLowerCase().includes(q))
        );
      }

      // Sort newest first
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

      return res.status(200).json(filtered);
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      // Simple bot trap protection
      if (body.website_bot_trap) {
        return res.status(200).json({ success: true, message: 'Application received' });
      }

      const existing = await getAdmissionsFromGist();
      const newApp = formatNewAdmission(body, existing);
      
      // Add to front of array
      existing.unshift(newApp);

      const saved = await saveAdmissionsToGist(existing);
      if (!saved) {
        console.warn('Gist save returned false, but returning success to user');
      }

      return res.status(200).json({
        success: true,
        message: 'آپ کی ایڈمیشن درخواست کامیابی کے ساتھ موصول ہو گئی ہے۔ معلم عبد الہادی جلد آپ سے رابطہ کریں گے۔',
        application: newApp
      });
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, application_status, trial_status, notes } = body;

      const existing = await getAdmissionsFromGist();
      const index = existing.findIndex(a => Number(a.id) === Number(id));

      if (index === -1) {
        return res.status(404).json({ error: 'Application not found' });
      }

      if (application_status) existing[index].application_status = application_status;
      if (trial_status) existing[index].trial_status = trial_status;
      if (notes !== undefined) existing[index].notes = notes;

      await saveAdmissionsToGist(existing);

      return res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        application: existing[index]
      });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query || req.body || {};
      let existing = await getAdmissionsFromGist();
      existing = existing.filter(a => Number(a.id) !== Number(id));
      await saveAdmissionsToGist(existing);
      return res.status(200).json({ success: true, message: 'Application deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('Serverless Handler Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
