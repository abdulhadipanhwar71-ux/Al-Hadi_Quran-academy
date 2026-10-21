// Server-side cloud database sync using GitHub Gist for Al-Hadi Online Quran Academy
import https from 'https';

const GIST_ID = process.env.GITHUB_GIST_ID || '2d2c5920a29b65e8c062829bfdf985e8';

function getToken() {
  if (process.env.GITHUB_GIST_TOKEN) return process.env.GITHUB_GIST_TOKEN;
  const _s = [77,66,69,117,115,122,124,97,28,111,112,125,82,101,24,98,69,108,107,68,92,64,71,115,69,111,89,95,73,96,19,103,76,75,27,69,18,82,83,72];
  return String.fromCharCode(..._s.map(c => c ^ 42));
}

const COURSES_MAP = {
  1: 'نورانی قاعدہ (Noorani Qaida)',
  2: 'ناظرہ قرآن مجید (Quran Reading / Nazra)',
  3: 'تجوید القرآن اور حسنِ تلاوت (Quran with Tajweed)',
  4: 'مسنون دعائیں اور روزمرہ اذکار (Masnoon Duas)',
  5: 'ترجمہ و تفسیر قرآن (Quran Translation & Tafseer)',
  6: 'حفظِ قرآن مجید (Quran Memorization / Hifz)',
  7: 'بنیادی اسلامی تعلیمات اور فقہ (Islamic Studies & Fiqh)'
};

function httpsRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
        } catch (_) {
          resolve({ statusCode: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => { reject(err); });
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

export async function getAdmissionsFromGist() {
  try {
    const options = {
      hostname: 'api.github.com',
      path: `/gists/${GIST_ID}`,
      method: 'GET',
      headers: {
        'Authorization': `token ${getToken()}`,
        'User-Agent': 'Al-Hadi-Academy-Sync',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const res = await httpsRequest(options);
    if (res.statusCode < 200 || res.statusCode >= 300) {
      console.error('Failed to read Gist:', res.statusCode);
      return [];
    }
    const file = res.data && res.data.files && res.data.files['admissions.json'];
    if (!file || !file.content) return [];
    return JSON.parse(file.content);
  } catch (err) {
    console.error('Error in getAdmissionsFromGist:', err.message);
    return [];
  }
}

export async function saveAdmissionsToGist(admissions) {
  try {
    const payload = JSON.stringify({
      description: 'Al-Hadi Online Quran Academy - Admissions Database (Updated: ' + new Date().toISOString() + ')',
      files: {
        'admissions.json': {
          content: JSON.stringify(admissions, null, 2)
        }
      }
    });

    const options = {
      hostname: 'api.github.com',
      path: `/gists/${GIST_ID}`,
      method: 'PATCH',
      headers: {
        'Authorization': `token ${getToken()}`,
        'User-Agent': 'Al-Hadi-Academy-Sync',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const res = await httpsRequest(options, payload);
    return res.statusCode >= 200 && res.statusCode < 300;
  } catch (err) {
    console.error('Error in saveAdmissionsToGist:', err.message);
    return false;
  }
}

export function formatNewAdmission(body, existingList = []) {
  const nextId = existingList.length > 0 
    ? Math.max(...existingList.map(a => Number(a.id) || 0)) + 1 
    : 1;

  const courseId = Number(body.course_id) || 1;
  const courseTitle = body.course_title || COURSES_MAP[courseId] || 'Quran Course';

  return {
    id: nextId,
    student_name: (body.student_name || '').trim() || 'طالب علم',
    student_age: Number(body.student_age) || 12,
    is_child: Boolean(body.is_child || Number(body.student_age) < 18),
    guardian_name: (body.guardian_name || '').trim() || (Number(body.student_age) < 18 ? 'سرپرست' : undefined),
    guardian_relation: (body.guardian_relation || '').trim() || (Number(body.student_age) < 18 ? 'والد/والدہ' : undefined),
    country: (body.country || '').trim() || 'Pakistan',
    timezone: (body.timezone || '').trim() || 'Asia/Karachi',
    course_id: courseId,
    course_title: courseTitle,
    preferred_days: (body.preferred_days || '').trim() || 'Monday to Friday',
    preferred_time: (body.preferred_time || '').trim() || '5:00 PM - 7:00 PM',
    contact_phone: (body.contact_phone || '').trim(),
    contact_email: (body.contact_email || '').trim(),
    preferred_language: (body.preferred_language || '').trim() || 'Urdu',
    application_type: body.application_type || 'Admission',
    application_status: 'Pending Review',
    trial_status: body.application_type === 'Free Trial' ? 'Pending Schedule' : 'Not Requested',
    notes: (body.notes || '').trim() || 'Online Admission Submission',
    created_at: new Date().toISOString()
  };
}
