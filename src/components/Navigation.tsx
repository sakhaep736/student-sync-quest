import { Button } from "@/components/ui/button";
import { Users, Briefcase, UserPlus, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Navigation = () => {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SB</span>
          </div>
          <span className="text-xl font-bold text-gray-900">ShiftBuddy</span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/browse-students">
            <Button variant="ghost" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('nav.browseStudents')}
            </Button>
          </Link>
          <Link to="/view-jobs">
            <Button variant="ghost" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {t('nav.viewJobs')}
            </Button>
          </Link>
          <Link to="/post-job">
            <Button variant="ghost" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {t('nav.postJob')}
            </Button>
          </Link>
          <Link to="/join-as-student">
            <Button variant="ghost" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              {t('nav.joinAsStudent')}
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">{t('nav.about')}</Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost">{t('nav.contact')}</Button>
          </Link>
          
          {/* Language Toggle */}
          <Button
            onClick={toggleLanguage}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <Languages size={20} />
            <span className="text-sm font-medium">
              {language === 'en' ? 'हिं' : 'EN'}
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;