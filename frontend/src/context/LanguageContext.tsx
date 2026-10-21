import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ur';

interface Translations {
  [key: string]: {
    en: string;
    ur: string;
  };
}

export const translations: Translations = {
  // Navigation
  navHome: { en: 'Home', ur: 'صفحۂ اول' },
  navAbout: { en: 'About Us', ur: 'ہمارے متعلق' },
  navCourses: { en: 'Courses', ur: 'کورسز' },
  navQuran: { en: 'Holy Quran', ur: 'قرآن مجید' },
  navTranslation: { en: 'Translation', ur: 'ترجمۃ القرآن' },
  navKalimas: { en: 'Six Kalimas', ur: 'شش کلمے' },
  navDuas: { en: 'Masnoon Duas', ur: 'مسنون دعائیں' },
  navMethod: { en: 'Teaching Method', ur: 'طریقۂ تدریس' },
  navAdmission: { en: 'Admission & Trial', ur: 'داخلہ و ٹرائل' },
  navContact: { en: 'Contact Us', ur: 'رابطہ کریں' },
  navFAQ: { en: 'FAQ', ur: 'عمومی سوالات' },
  navAdmin: { en: 'Admin Portal', ur: 'ایڈمن پورٹل' },

  // Hero & CTAs
  heroTitle: { en: 'Al-Hadi Online Quran Academy', ur: 'الھادی آن لائن قرآن اکیڈمی' },
  heroSubtitle: {
    en: 'Dedicated one-to-one Quranic education with authentic Tajweed, Nazra, Duas, Hadith, and Islamic values for children and adults worldwide.',
    ur: 'بچوں اور بڑوں کے لیے مستند تجوید، ناظرہ، مسنون دعاؤں، احادیث اور اسلامی تعلیمات کے ساتھ انفرادی آن لائن قرآن کلاسز۔'
  },
  btnExploreCourses: { en: 'Explore Courses', ur: 'کورسز دیکھیں' },
  btnApplyAdmission: { en: 'Apply for Admission', ur: 'داخلہ فارم پُر کریں' },
  btnFreeTrial: { en: 'Book Free Trial', ur: 'مفت ٹرائل حاصل کریں' },
  btnContactWhatsApp: { en: 'Contact Us on WhatsApp', ur: 'واٹس ایپ پر رابطہ کریں' },
  whatsappUs: { en: 'Contact Us on WhatsApp', ur: 'واٹس ایپ پر رابطہ کریں' },

  // Sections
  featuredCourses: { en: 'Featured Quran & Islamic Courses (7 Courses)', ur: 'منتخب قرآنی و اسلامی کورسز (کل 7 کورسز)' },
  coursesSubtitle: { en: 'Curriculum structured for beginners, children, and adult learners.', ur: 'بچوں، نوآموز اور بالغ طلبہ کے لیے معیاری و مستند نصاب۔' },
  quranExplorerTitle: { en: 'Read & Study The Holy Quran', ur: 'تلاوت و مطالعۂ قرآن مجید' },
  sixKalimasTitle: { en: 'The Six Essential Kalimas', ur: 'اسلام کے چھ بنیادی کلمے' },
  masnoonDuasTitle: { en: 'Daily Masnoon Duas', ur: 'روزمرہ کی مسنون دعائیں' },

  // Seven Courses
  course1Title: { en: 'Noorani Qaida', ur: 'نورانی قاعدہ' },
  course2Title: { en: 'Quran Reading / Nazra', ur: 'ناظرہ قرآن مجید' },
  course3Title: { en: 'Quran with Tajweed', ur: 'تجوید القرآن اور حسنِ تلاوت' },
  course4Title: { en: 'Masnoon Duas & Daily Adhkar', ur: 'مسنون دعائیں اور روزمرہ اذکار' },
  course5Title: { en: 'Basic Islamic Education', ur: 'بنیادی اسلامی تعلیمات' },
  course6Title: { en: 'Quran Translation & Understanding', ur: 'ترجمۃ القرآن و فہمِ قرآن' },
  course7Title: { en: 'Hadith Studies, Translation, and Memorization', ur: 'مطالعۂ حدیث، ترجمہ اور حفظِ احادیث' },

  // Teacher & About
  instructorName: { en: 'Abdul Hadi', ur: 'استاذ عبد الھادی' },
  instructorRole: { en: 'Founder & Certified Quran Instructor', ur: 'بانی و معلم قرآن مجید' },

  // Form labels
  studentName: { en: 'Student Full Name', ur: 'طالب علم کا مکمل نام' },
  studentAge: { en: 'Student Age (Years)', ur: 'عمر (سالوں میں)' },
  isChildApplicant: { en: 'Applicant is under 18 or applying as child', ur: 'طالب علم کی عمر 18 سال سے کم ہے' },
  guardianName: { en: 'Parent / Guardian Name', ur: 'والد یا سرپرست کا نام' },
  guardianRelation: { en: 'Relation to Student', ur: 'طالب علم سے رشتہ' },
  country: { en: 'Country of Residence', ur: 'رہائشی ملک' },
  timezone: { en: 'Preferred Timezone', ur: 'ٹائم زون' },
  selectCourse: { en: 'Select Desired Course', ur: 'مطلوبہ کورس منتخب کریں' },
  preferredDays: { en: 'Preferred Days', ur: 'مناسب دن' },
  preferredTime: { en: 'Preferred Time Window', ur: 'مناسب وقت' },
  phone: { en: 'WhatsApp / Phone Number', ur: 'فون یا واٹس ایپ نمبر' },
  email: { en: 'Email Address', ur: 'ای میل ایڈریس' },
  preferredLanguage: { en: 'Preferred Instruction Language', ur: 'تدریسی زبان' },
  appType: { en: 'Application Type', ur: 'درخواست کی قسم' },
  btnSubmit: { en: 'Submit Application', ur: 'درخواست ارسال کریں' },

  // Application & Trial Statuses
  statusPending: { en: 'Pending Review', ur: 'زیرِ غور / انتظار میں' },
  statusApproved: { en: 'Approved', ur: 'منظور شدہ' },
  statusRejected: { en: 'Rejected', ur: 'مسترد شدہ' },
  statusMoreInfo: { en: 'More Information Required', ur: 'مزید معلومات درکار' },
  statusTrialRequested: { en: 'Trial Requested', ur: 'ٹرائل کلاس کی درخواست' },
  statusTrialScheduled: { en: 'Trial Scheduled', ur: 'ٹرائل طے شدہ' },
  statusTrialCompleted: { en: 'Trial Completed', ur: 'ٹرائل مکمل' },
  statusTrialCancelled: { en: 'Trial Cancelled', ur: 'ٹرائل منسوخ' },

  // Admin Dashboard Interface
  adminDashboard: { en: 'Administrator Dashboard', ur: 'ایڈمن ڈیش بورڈ' },
  adminOverview: { en: 'Dashboard Overview', ur: 'اعداد و شمار کا جائزہ' },
  adminApps: { en: 'Applications', ur: 'درخواستیں' },
  adminStudents: { en: 'Enrolled Students', ur: 'داخل شدہ طلبہ' },
  adminSchedules: { en: 'Class Schedules', ur: 'کلاس کا شیڈول' },
  adminCourses: { en: 'Course Catalog', ur: 'کورسز کی فہرست' },
  adminLogout: { en: 'Log Out', ur: 'لاگ آؤٹ' },
  btnApprove: { en: 'Approve & Enroll', ur: 'منظور کریں اور داخلہ دیں' },
  btnReject: { en: 'Reject', ur: 'مسترد کریں' },
  btnRequestInfo: { en: 'Request More Info', ur: 'مزید معلومات طلب کریں' },
  scheduleNewClass: { en: 'Schedule New Class', ur: 'نئی کلاس طے کریں' },
  privateMeetingLink: { en: 'Private Meeting Link (Google Meet / Zoom)', ur: 'پرائیویٹ میٹنگ لنک (گوگل میٹ / زوم)' },

  // Verified Owner Contact Constants
  officialWhatsAppNumber: { en: '03282885660', ur: '03282885660' },
  officialEmailAddress: { en: 'abdulhadipanhwar71@gmail.com', ur: 'abdulhadipanhwar71@gmail.com' },

  // Footer & Disclaimer
  footerNotice: {
    en: 'Al-Hadi Online Quran Academy is dedicated to authentic, peaceful Islamic education. Online classes are conducted one-to-one via Google Meet or Zoom.',
    ur: 'الھادی آن لائن قرآن اکیڈمی مستند اور پُرامن اسلامی تعلیم کے فروغ کے لیے کوشاں ہے۔ کلاسز گوگل میٹ یا زوم پر انفرادی طور پر منعقد کی جاتی ہیں۔'
  },
  copyright: {
    en: '© 2026 Al-Hadi Online Quran Academy. All rights reserved.',
    ur: '© 2026ء الھادی آن لائن قرآن اکیڈمی۔ جملہ حقوق محفوظ ہیں۔'
  }
};

interface LanguageContextType {
  language: Language;
  direction: 'ltr' | 'rtl';
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('alhadi_lang') as Language) || 'en';
  });

  const direction = language === 'ur' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    localStorage.setItem('alhadi_lang', language);
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, t, setLanguage, toggleLanguage }}>
      <div dir={direction} className={language === 'ur' ? 'font-urdu' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
