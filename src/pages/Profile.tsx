import { useState, useEffect } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from "lucide-react";

const Profile = () => {
  const { language, t } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    experience: "",
    availability: ""
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Load user profile data from metadata or set defaults
        setProfileData({
          displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || "",
          phone: user.user_metadata?.phone || "",
          location: user.user_metadata?.location || "",
          bio: user.user_metadata?.bio || "",
          skills: user.user_metadata?.skills || [],
          experience: user.user_metadata?.experience || "",
          availability: user.user_metadata?.availability || ""
        });
      }
    });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    
    const { error } = await supabase.auth.updateUser({
      data: profileData
    });
    
    if (!error) {
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'en' ? 'My Profile' : 'मेरी प्रोफ़ाइल'}
          </h1>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                {language === 'en' ? 'Save' : 'सेव करें'}
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                {language === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें'}
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Picture and Basic Info */}
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {profileData.displayName.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{profileData.displayName || user.email}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{language === 'en' ? 'Joined' : 'शामिल हुए'} {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              {profileData.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.phone}</span>
                </div>
              )}
              {profileData.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.location}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {language === 'en' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName">
                      {language === 'en' ? 'Display Name' : 'प्रदर्शन नाम'}
                    </Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      {language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'}
                    </Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">
                    {language === 'en' ? 'Location' : 'स्थान'}
                  </Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">
                    {language === 'en' ? 'Bio' : 'बायो'}
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    placeholder={language === 'en' ? 'Tell us about yourself...' : 'अपने बारे में बताएं...'}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? 'Professional Information' : 'व्यावसायिक जानकारी'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="experience">
                    {language === 'en' ? 'Experience Level' : 'अनुभव स्तर'}
                  </Label>
                  <Input
                    id="experience"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                    disabled={!isEditing}
                    placeholder={language === 'en' ? 'e.g., Beginner, Intermediate, Expert' : 'जैसे: शुरुआती, मध्यम, विशेषज्ञ'}
                  />
                </div>
                <div>
                  <Label htmlFor="availability">
                    {language === 'en' ? 'Availability' : 'उपलब्धता'}
                  </Label>
                  <Input
                    id="availability"
                    value={profileData.availability}
                    onChange={(e) => setProfileData({ ...profileData, availability: e.target.value })}
                    disabled={!isEditing}
                    placeholder={language === 'en' ? 'e.g., Full-time, Part-time, Weekends' : 'जैसे: पूर्णकालिक, अंशकालिक, सप्ताहांत'}
                  />
                </div>
                <div>
                  <Label>
                    {language === 'en' ? 'Skills' : 'कौशल'}
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.skills.length > 0 ? (
                      profileData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        {language === 'en' ? 'No skills added yet' : 'अभी तक कोई कौशल नहीं जोड़ा गया'}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;