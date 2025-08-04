import { Button } from "@/components/ui/button";
import { Users, Briefcase, UserPlus, Languages, User, Settings, Clock, Bookmark, HelpCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Navigation = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Profile Icon and Logo */}
        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <User className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Job History</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>Saved Jobs</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="p-2">
                <User className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ShiftBuddy</span>
          </Link>
        </div>

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
        </div>

        {/* Language Toggle - Always Visible */}
        <div className="flex flex-col items-center gap-1">
          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
          >
            <Languages size={18} />
            <span className="text-sm font-medium">
              {language === 'en' ? 'हिं' : 'EN'}
            </span>
          </Button>
          <span className="text-xs text-gray-500">
            {language === 'en' ? 'If you want to change the language click above' : 'यदि आप भाषा बदलना चाहते हैं तो ऊपर क्लिक करें'}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;