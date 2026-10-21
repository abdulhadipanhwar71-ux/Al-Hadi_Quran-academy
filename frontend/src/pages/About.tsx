import { Link } from 'react-router-dom';
import { Shield, BookOpen, Heart, CheckCircle2, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          About Al-Hadi Online Quran Academy
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Dedicated, Authentic Online Quranic Education
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Founded to connect students worldwide with personalized, patient, and respectful Quran learning rooted in authentic Tajweed and Sunnah.
        </p>
      </div>

      {/* Leadership & Identity Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
          <img
            src="/logo.jpg"
            alt="Al-Hadi Online Quran Academy Emblem"
            className="w-32 h-32 rounded-full object-cover border-4 border-amber-500 shadow-md"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900">Abdul Hadi</h2>
            <p className="text-xs font-semibold text-emerald-700">Administrator & Quran Teacher</p>
            <p className="text-xs text-slate-500 mt-1">Al-Hadi Online Quran Academy</p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-4 text-slate-700 text-sm leading-relaxed border-t md:border-t-0 md:border-l border-slate-100 md:pl-8 pt-6 md:pt-0">
          <h3 className="text-lg font-bold text-slate-900">Our Founding Mission</h3>
          <p>
            Al-Hadi Online Quran Academy was established with a singular objective: to provide sincere, one-to-one Quran instruction to learners who desire to read and understand the Book of Allah with proper pronunciation and reverence.
          </p>
          <p>
            In today's fast-paced world, finding accessible, patient, and trustworthy Quran tutoring can be challenging for families living in non-Muslim majority regions as well as those with demanding schedules. Our academy bridges this gap through live digital sessions tailored to each learner's individual needs.
          </p>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <span className="font-bold block">Our Commitment to Integrity:</span>
            We do not make unsupported claims or guarantees. Quranic proficiency is a blessed endeavor that develops through consistent practice, sincere intent, and patient instruction.
          </div>
        </div>
      </div>

      {/* Audience & Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-emerald-900 text-white space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-amber-300">Who We Teach</h3>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            We welcome children and adult learners, boys and girls. Beginners start from Noorani Qaida, while intermediate students focus on Nazra, Tajweed rules, and translation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-emerald-100 text-slate-800 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Global Reach</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our international student body spans Pakistan, the United Kingdom, United States, Canada, Qatar, Kuwait, Oman, and other countries with coordinated scheduling.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-emerald-100 text-slate-800 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Respectful Environment</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Classes are conducted in an encouraging, peaceful atmosphere with zero pressure, helping students build genuine love and reverence for the Quran.
          </p>
        </div>
      </div>

      {/* Direct Call to Action */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 shadow-lg border border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold text-amber-400">
          Have Questions or Ready to Enroll?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Contact teacher Abdul Hadi directly or submit an application for an introductory trial session.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/admission"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow transition-colors"
          >
            <span>Apply for Admission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl font-medium text-xs transition-colors"
          >
            <span>Contact Us Directly</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
