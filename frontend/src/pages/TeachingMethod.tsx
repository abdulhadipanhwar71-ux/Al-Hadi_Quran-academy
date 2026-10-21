import { Link } from 'react-router-dom';
import {
  Video, UserCheck, Clock, Calendar, CheckCircle, ArrowRight,
  Monitor, Shield, HeartHandshake
} from 'lucide-react';

export const TeachingMethod = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Our Pedagogy & Process
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Online Quran Classes Work
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Step-by-step guidance designed to make Quran learning simple, effective, and spiritually fulfilling from the comfort of your home.
        </p>
      </div>

      {/* 4-Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-3 text-left">
          <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm">
            1
          </div>
          <h3 className="font-bold text-base text-slate-900">Application</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Submit your admission or free trial form specifying student age, course, and preferred weekly schedule.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-3 text-left">
          <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm">
            2
          </div>
          <h3 className="font-bold text-base text-slate-900">Coordination</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Administrator Abdul Hadi Panhwar contacts you manually to verify timetable and assess the student's level.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-3 text-left">
          <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm">
            3
          </div>
          <h3 className="font-bold text-base text-slate-900">Trial Class</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Join a live 1-on-1 trial lesson via Google Meet or Zoom to experience the teaching method firsthand.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-3 text-left">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm">
            4
          </div>
          <h3 className="font-bold text-base text-slate-900">Regular Classes</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Begin weekly structured lessons on agreed recurring days with consistent progress review.
          </p>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">One-to-One Focus</h3>
              <p className="text-xs text-slate-500">Individualized instruction tailored to each student</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike large physical classrooms where shy students can get left behind, our one-to-one format allows the teacher to listen intently to every vowel and letter, correcting pronunciation (Makharij) immediately with patience.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Google Meet & Zoom</h3>
              <p className="text-xs text-slate-500">Accessible high-quality video and screen sharing</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            We use reliable, standard conferencing tools. Digital Quran pages and color-coded Tajweed Qaida slides are shared live on screen, enabling the student to follow the pointer word by word with clarity.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Flexible Scheduling</h3>
              <p className="text-xs text-slate-500">Coordinated around school and work schedules</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Students in the UK, USA, Canada, and Gulf countries have varying school hours. We coordinate lessons across timezones so that learning happens when the student is alert and comfortable.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Safe Environment for Kids</h3>
              <p className="text-xs text-slate-500">Parental oversight and encouragement</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Parents are welcome to sit beside their children during lessons. We maintain strict ethical standards and ensure an encouraging environment where students feel confident to recite.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-3xl bg-emerald-950 text-white text-center space-y-4">
        <h2 className="text-2xl font-bold text-amber-300">
          Book an Introductory Lesson
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl mx-auto leading-relaxed">
          Request an evaluation class to discuss goals and test your online connection with teacher Abdul Hadi Panhwar.
        </p>
        <div className="pt-2">
          <Link
            to="/admission"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-3 rounded-xl font-bold text-sm shadow transition-colors"
          >
            <span>Request a Trial Class</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
