import { useState, useEffect } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  Shield, 
  Mail, 
  Eye, 
  EyeOff, 
  Save, 
  Trash2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AccountSettings = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Email settings
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobAlerts: true,
    messageAlerts: true,
    weeklyDigest: false,
    marketingEmails: false
  });
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    showEmail: false,
    showPhone: false,
    searchableProfile: true
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        setNewEmail(user.email || "");
        // Load user preferences from metadata
        setNotifications(user.user_metadata?.notifications || notifications);
        setPrivacy(user.user_metadata?.privacy || privacy);
      }
    });
  }, []);

  const handleEmailUpdate = async () => {
    if (!newEmail || !currentPassword) {
      toast({
        title: language === 'en' ? "Error" : "त्रुटि",
        description: language === 'en' ? "Please fill in all fields" : "कृपया सभी फ़ील्ड भरें",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      toast({
        title: language === 'en' ? "Email Updated" : "ईमेल अपडेट किया गया",
        description: language === 'en' 
          ? "Please check your new email for confirmation" 
          : "कृपया पुष्टि के लिए अपना नया ईमेल जांचें"
      });
    } catch (error: any) {
      toast({
        title: language === 'en' ? "Error" : "त्रुटि",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: language === 'en' ? "Error" : "त्रुटि",
        description: language === 'en' ? "Please fill in all fields" : "कृपया सभी फ़ील्ड भरें",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: language === 'en' ? "Error" : "त्रुटि",
        description: language === 'en' ? "Passwords do not match" : "पासवर्ड मेल नहीं खाते",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: language === 'en' ? "Error" : "त्रुटि",
        description: language === 'en' 
          ? "Password must be at least 6 characters" 
          : "पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: language === 'en' ? "Password Updated" : "पासवर्ड अपडेट किया गया",
        description: language === 'en' 
          ? "Your password has been successfully updated" 
          : "आपका पासवर्ड सफलतापूर्वक अपडेट कर दिया गया है"
      });
      
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: language === 'en' ? "Error" : "त्रुटि",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          ...user?.user_metadata,
          notifications 
        }
      });

      if (error) throw error;

      toast({
        title: language === 'en' ? "Settings Updated" : "सेटिंग्स अपडेट की गईं",
        description: language === 'en' 
          ? "Notification preferences saved" 
          : "सूचना प्राथमिकताएं सहेजी गईं"
      });
    } catch (error: any) {
      toast({
        title: language === 'en' ? "Error" : "त्रुटि",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          ...user?.user_metadata,
          privacy 
        }
      });

      if (error) throw error;

      toast({
        title: language === 'en' ? "Settings Updated" : "सेटिंग्स अपडेट की गईं",
        description: language === 'en' 
          ? "Privacy settings saved" 
          : "गोपनीयता सेटिंग्स सहेजी गईं"
      });
    } catch (error: any) {
      toast({
        title: language === 'en' ? "Error" : "त्रुटि",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm(language === 'en' 
      ? "Are you sure you want to delete your account? This action cannot be undone." 
      : "क्या आप वाकई अपना खाता हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।"
    )) {
      // In a real app, this would call a backend endpoint to handle account deletion
      toast({
        title: language === 'en' ? "Account Deletion" : "खाता हटाना",
        description: language === 'en' 
          ? "Please contact support to delete your account" 
          : "अपना खाता हटाने के लिए कृपया सहायता से संपर्क करें",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'en' ? 'Account Settings' : 'खाता सेटिंग्स'}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {language === 'en' ? 'Account Information' : 'खाता जानकारी'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentEmail">
                    {language === 'en' ? 'Current Email' : 'वर्तमान ईमेल'}
                  </Label>
                  <Input
                    id="currentEmail"
                    value={user.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="accountCreated">
                    {language === 'en' ? 'Account Created' : 'खाता बनाया गया'}
                  </Label>
                  <Input
                    id="accountCreated"
                    value={new Date(user.created_at).toLocaleDateString()}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'en' ? 'Change Email Address' : 'ईमेल पता बदलें'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newEmail">
                      {language === 'en' ? 'New Email' : 'नया ईमेल'}
                    </Label>
                    <Input
                      id="newEmail"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder={language === 'en' ? 'Enter new email' : 'नया ईमेल दर्ज करें'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentPassword">
                      {language === 'en' ? 'Current Password' : 'वर्तमान पासवर्ड'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={language === 'en' ? 'Enter current password' : 'वर्तमान पासवर्ड दर्ज करें'}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleEmailUpdate} 
                  disabled={loading}
                  className="mt-4"
                >
                  {language === 'en' ? 'Update Email' : 'ईमेल अपडेट करें'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {language === 'en' ? 'Security' : 'सुरक्षा'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Change Password' : 'पासवर्ड बदलें'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">
                    {language === 'en' ? 'New Password' : 'नया पासवर्ड'}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={language === 'en' ? 'Enter new password' : 'नया पासवर्ड दर्ज करें'}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">
                    {language === 'en' ? 'Confirm Password' : 'पासवर्ड की पुष्टि करें'}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={language === 'en' ? 'Confirm new password' : 'नए पासवर्ड की पुष्टि करें'}
                  />
                </div>
              </div>
              <Button 
                onClick={handlePasswordUpdate} 
                disabled={loading}
              >
                {language === 'en' ? 'Update Password' : 'पासवर्ड अपडेट करें'}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {language === 'en' ? 'Notification Preferences' : 'सूचना प्राथमिकताएं'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={key} className="text-base">
                      {key === 'emailNotifications' && (language === 'en' ? 'Email Notifications' : 'ईमेल सूचनाएं')}
                      {key === 'jobAlerts' && (language === 'en' ? 'Job Alerts' : 'नौकरी अलर्ट')}
                      {key === 'messageAlerts' && (language === 'en' ? 'Message Alerts' : 'संदेश अलर्ट')}
                      {key === 'weeklyDigest' && (language === 'en' ? 'Weekly Digest' : 'साप्ताहिक सारांश')}
                      {key === 'marketingEmails' && (language === 'en' ? 'Marketing Emails' : 'मार्केटिंग ईमेल')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {key === 'emailNotifications' && (language === 'en' ? 'Receive email notifications' : 'ईमेल सूचनाएं प्राप्त करें')}
                      {key === 'jobAlerts' && (language === 'en' ? 'Get notified about new job opportunities' : 'नए नौकरी के अवसरों के बारे में सूचित हों')}
                      {key === 'messageAlerts' && (language === 'en' ? 'Notifications for new messages' : 'नए संदेशों के लिए सूचनाएं')}
                      {key === 'weeklyDigest' && (language === 'en' ? 'Weekly summary of activity' : 'गतिविधि का साप्ताहिक सारांश')}
                      {key === 'marketingEmails' && (language === 'en' ? 'Promotional and marketing content' : 'प्रचारात्मक और मार्केटिंग सामग्री')}
                    </p>
                  </div>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
              <Button onClick={handleNotificationUpdate} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Save Preferences' : 'प्राथमिकताएं सहेजें'}
              </Button>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {language === 'en' ? 'Privacy Settings' : 'गोपनीयता सेटिंग्स'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={key} className="text-base">
                      {key === 'profileVisibility' && (language === 'en' ? 'Profile Visibility' : 'प्रोफ़ाइल दृश्यता')}
                      {key === 'showEmail' && (language === 'en' ? 'Show Email' : 'ईमेल दिखाएं')}
                      {key === 'showPhone' && (language === 'en' ? 'Show Phone' : 'फ़ोन दिखाएं')}
                      {key === 'searchableProfile' && (language === 'en' ? 'Searchable Profile' : 'खोजने योग्य प्रोफ़ाइल')}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {key === 'profileVisibility' && (language === 'en' ? 'Make your profile visible to others' : 'अपनी प्रोफ़ाइल को दूसरों के लिए दृश्यमान बनाएं')}
                      {key === 'showEmail' && (language === 'en' ? 'Display email on profile' : 'प्रोफ़ाइल पर ईमेल प्रदर्शित करें')}
                      {key === 'showPhone' && (language === 'en' ? 'Display phone number on profile' : 'प्रोफ़ाइल पर फ़ोन नंबर प्रदर्शित करें')}
                      {key === 'searchableProfile' && (language === 'en' ? 'Allow others to find your profile in search' : 'दूसरों को खोज में आपकी प्रोफ़ाइल खोजने की अनुमति दें')}
                    </p>
                  </div>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
              <Button onClick={handlePrivacyUpdate} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Save Privacy Settings' : 'गोपनीयता सेटिंग्स सहेजें'}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                {language === 'en' ? 'Danger Zone' : 'खतरनाक क्षेत्र'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-red-700">
                    {language === 'en' ? 'Delete Account' : 'खाता हटाएं'}
                  </h3>
                  <p className="text-sm text-red-600">
                    {language === 'en' 
                      ? 'Permanently delete your account and all associated data'
                      : 'अपना खाता और सभी संबंधित डेटा स्थायी रूप से हटाएं'
                    }
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {language === 'en' ? 'Delete Account' : 'खाता हटाएं'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;