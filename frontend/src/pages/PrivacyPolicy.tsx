import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-left">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Legal & Privacy
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy & Student Data Protection
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 2026 • Al-Hadi Online Quran Academy
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>1. Our Privacy Commitment</span>
          </h2>
          <p>
            Al-Hadi Online Quran Academy ("we", "us", or "the academy") respects the privacy of our applicants, students, and their families. This privacy policy explains what personal information we collect, why we collect it, how it is stored, and how your privacy is protected.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span>2. Information We Collect</span>
          </h2>
          <p>We collect only the information strictly necessary to process admissions and organize teaching schedules:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-2">
            <li><strong>Student details:</strong> Full name, age, country of residence, and preferred timezone.</li>
            <li><strong>Guardian information:</strong> Name and relationship for any applicant under 18 years of age.</li>
            <li><strong>Contact details:</strong> Email address and phone/WhatsApp number for scheduling coordination.</li>
            <li><strong>Educational preferences:</strong> Course selected, preferred instruction language, and suitable timetable windows.</li>
          </ul>
          <p className="text-xs text-slate-500 italic">
            We do not collect government identity numbers, financial credit card data on this website, or sensitive health records.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-700" />
            <span>3. How We Use and Protect Your Data</span>
          </h2>
          <p>
            Your information is used solely by administrator Abdul Hadi Panhwar to evaluate schedule compatibility, arrange trial lessons, and communicate with enrolled students.
          </p>
          <p>
            We enforce strict administrative security controls, including encrypted authentication tokens, password hashing, and protected database storage. We will <strong>never</strong> sell, rent, or trade student personal information to marketing advertisers or third-party brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-700" />
            <span>4. Children's Privacy & Parental Consent</span>
          </h2>
          <p>
            Because we instruct minor students, parental or legal guardian consent is strictly mandatory for any applicant under 18. All communications regarding schedules and class coordination for minors are conducted directly with the parent or designated guardian.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            5. Your Data Rights & Contact Information
          </h2>
          <p>
            You may request to review, update, or permanently delete your application or student record from our database at any time by contacting us directly at <a href="mailto:info@alhadi-quran.com" className="text-emerald-800 underline font-semibold">info@alhadi-quran.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
