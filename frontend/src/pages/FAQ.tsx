import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What courses does Al-Hadi Online Quran Academy offer?",
    answer: "We offer six confirmed courses: (1) Noorani Qaida for absolute beginners, (2) Quran Reading / Nazra Quran, (3) Tajweed Rules & Recitation, (4) Masnoon Duas & Daily Adhkar, (5) Basic Islamic Education, and (6) Quran Translation & Understanding."
  },
  {
    question: "Who can enroll? Are classes for children and adults?",
    answer: "Yes, our academy welcomes both children (boys and girls from 4 years up) as well as adult male and female learners. Lessons are tailored to the specific pace and maturity of each student."
  },
  {
    question: "How are classes conducted?",
    answer: "Classes are held live one-to-one via Google Meet or Zoom. The teacher shares digital Quran pages on screen and provides direct verbal guidance and pronunciation correction in real-time."
  },
  {
    question: "How does the Free Trial class work?",
    answer: "You can apply for a free trial through our Admission page. The administrator will review your preferred schedule and coordinate an introductory session so you and your child can experience the teacher's methodology."
  },
  {
    question: "Does submitting an application guarantee admission?",
    answer: "No. Because lessons are conducted one-to-one by teacher Abdul Hadi Panhwar, each application is reviewed based on timetable availability. We will confirm whether a matching weekly time slot is open."
  },
  {
    question: "What are the tuition fees and payment options?",
    answer: "Tuition depends on the number of weekly sessions (e.g. 3, 4, or 5 days per week) and student country. We do not invent public discounts or arbitrary rates. Please contact the academy directly via our Contact page or submit an application for exact fee packages."
  },
  {
    question: "What equipment or software do I need?",
    answer: "A stable internet connection and a laptop, tablet, or smartphone with working audio and microphone, along with either Google Meet (which runs inside any browser) or Zoom installed."
  },
  {
    question: "Can parents monitor their children's lessons?",
    answer: "Yes, absolutely. Parents are encouraged to be present during their child's sessions to observe progress and support practice at home."
  }
];

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 text-left">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Clear, honest answers about our online Quran classes, tools, scheduling, and admission policies.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-800 focus:outline-none"
              >
                <span className="pr-4">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-50 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
