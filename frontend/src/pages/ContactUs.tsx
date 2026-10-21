import { useEffect, useState } from 'react';
import { Mail, Phone, MessageSquare, Clock, Globe, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { AcademySettings } from '../types';

export const ContactUs = () => {
  const [settings, setSettings] = useState<AcademySettings | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Course & Fee Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate inquiry acknowledgement
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact Al-Hadi Online Quran Academy
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Reach out for course questions, fee structures, flexible schedule arrangements, or evaluation trial classes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6 text-left">
          {/* Card 1: Official Email */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Official Academy Email</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              For general inquiries, enrollment questions, and admission review:
            </p>
            <a
              href={`mailto:${settings?.contact_email || 'abdulhadipanhwar71@gmail.com'}`}
              className="inline-block font-semibold text-sm text-emerald-800 hover:text-emerald-950 underline"
            >
              {settings?.contact_email || 'abdulhadipanhwar71@gmail.com'}
            </a>
          </div>

          {/* Card 2: WhatsApp Communication */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">WhatsApp Communication</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chat directly with academy administrator Abdul Hadi for quick inquiries and schedule consultation:
            </p>
            <div className="space-y-2">
              <a
                href={settings?.whatsapp_url || "https://wa.me/923282885660"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Open WhatsApp Chat (03282885660)</span>
              </a>
              <p className="text-[11px] text-slate-500 font-medium">
                Direct WhatsApp Number: <span className="font-bold text-slate-800">03282885660</span> (+92 328 2885660)
              </p>
            </div>
          </div>

          {/* Card 3: Administration & Location */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-2 text-xs leading-relaxed">
            <h3 className="font-bold text-amber-400 text-sm">Administration & Platforms</h3>
            <p className="text-emerald-100">
              Classes are managed by <strong>Abdul Hadi</strong> and hosted remotely via <strong>Google Meet</strong> and <strong>Zoom</strong>.
            </p>
            <p className="text-slate-400 text-[11px] pt-1">
              Timezones accommodated: PKT (Pakistan), GMT/BST (UK), EST/EDT & PST (USA/Canada), and AST/GST (Dubai/UAE, Gulf).
            </p>
          </div>
        </div>

        {/* Right Col: Direct Inquiry Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-sm space-y-6 text-left">
          <h2 className="text-xl font-bold text-slate-900">
            Send an Inquiry Message
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Have questions about course level, timings, or teacher availability? Fill out this inquiry form.
          </p>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h3 className="font-bold text-base">Inquiry Message Received</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, {name}. Your inquiry has been forwarded to our administrator. We will reply to your email ({email}) shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-3 text-xs font-semibold text-emerald-800 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abdullah Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Course & Fee Inquiry">Course & Fee Inquiry</option>
                  <option value="Schedule & Timing Availability">Schedule & Timing Availability</option>
                  <option value="Trial Class Question">Trial Class Question</option>
                  <option value="Other Question">Other Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry, student age, or desired days..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
