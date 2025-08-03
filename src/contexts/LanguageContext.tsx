import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  en: {
    // Navigation
    'nav.browseStudents': 'Browse Students',
    'nav.viewJobs': 'View Jobs',
    'nav.postJob': 'Post Job',
    'nav.joinAsStudent': 'Join as Student',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title1': 'Hire India\'s Most Talented',
    'hero.title2': 'Students',
    'hero.title3': 'for Freelance & Part-Time Work',
    'hero.subtitle': 'From design to tutoring to delivery – support student talent while getting work done affordably. Connect with 18+ students across India for your next project.',
    'hero.browseStudents': 'Browse Students',
    'hero.postJob': 'Post a Job',
    'hero.joinAsStudent': 'Join as a Student',
    
    // Stats
    'stats.activeStudents': 'Active Students',
    'stats.jobsCompleted': 'Jobs Completed',
    'stats.citiesCovered': 'Cities Covered',
    
    // Categories
    'categories.title': 'Explore Job Categories',
    'categories.subtitle': 'Find students skilled in various fields, from digital services to offline work',
    'categories.search': 'Search students or skills...',
    'categories.allCategories': 'All Categories',
    
    // Students Section
    'students.title': 'Available Students',
    'students.hourly': '/hr',
    
    // Jobs Section
    'jobs.title': 'Active Job Listings',
    'jobs.applyNow': 'Apply Now',
    
    // Auth
    'auth.welcome': 'Welcome',
    'auth.subtitle': 'Sign in to your account or create a new one',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.emailPlaceholder': 'Enter your email',
    'auth.passwordPlaceholder': 'Enter your password',
    'auth.createPasswordPlaceholder': 'Create a password',
    'auth.signingIn': 'Signing In...',
    'auth.creatingAccount': 'Creating Account...',
  },
  hi: {
    // Navigation
    'nav.browseStudents': 'छात्र ब्राउज़ करें',
    'nav.viewJobs': 'नौकरियां देखें',
    'nav.postJob': 'नौकरी पोस्ट करें',
    'nav.joinAsStudent': 'छात्र के रूप में जुड़ें',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    
    // Hero Section
    'hero.title1': 'भारत के सबसे प्रतिभाशाली',
    'hero.title2': 'छात्रों',
    'hero.title3': 'को फ्रीलांस और पार्ट-टाइम काम के लिए हायर करें',
    'hero.subtitle': 'डिज़ाइन से लेकर ट्यूटरिंग तक डिलीवरी तक - छात्र प्रतिभा का समर्थन करते हुए किफायती दाम पर काम पूरा करवाएं। अपनी अगली परियोजना के लिए भारत भर के 18+ छात्रों से जुड़ें।',
    'hero.browseStudents': 'छात्र ब्राउज़ करें',
    'hero.postJob': 'नौकरी पोस्ट करें',
    'hero.joinAsStudent': 'छात्र के रूप में जुड़ें',
    
    // Stats
    'stats.activeStudents': 'सक्रिय छात्र',
    'stats.jobsCompleted': 'पूर्ण नौकरियां',
    'stats.citiesCovered': 'कवर किए गए शहर',
    
    // Categories
    'categories.title': 'नौकरी की श्रेणियां देखें',
    'categories.subtitle': 'डिजिटल सेवाओं से लेकर ऑफलाइन काम तक विभिन्न क्षेत्रों में कुशल छात्र खोजें',
    'categories.search': 'छात्र या कौशल खोजें...',
    'categories.allCategories': 'सभी श्रेणियां',
    
    // Students Section
    'students.title': 'उपलब्ध छात्र',
    'students.hourly': '/घंटा',
    
    // Jobs Section
    'jobs.title': 'सक्रिय नौकरी सूची',
    'jobs.applyNow': 'अभी आवेदन करें',
    
    // Auth
    'auth.welcome': 'स्वागत',
    'auth.subtitle': 'अपने खाते में साइन इन करें या नया खाता बनाएं',
    'auth.signIn': 'साइन इन',
    'auth.signUp': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.emailPlaceholder': 'अपना ईमेल दर्ज करें',
    'auth.passwordPlaceholder': 'अपना पासवर्ड दर्ज करें',
    'auth.createPasswordPlaceholder': 'पासवर्ड बनाएं',
    'auth.signingIn': 'साइन इन हो रहे हैं...',
    'auth.creatingAccount': 'खाता बनाया जा रहा है...',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};