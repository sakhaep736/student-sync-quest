import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";

const JoinAsStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    location: "",
    description: "",
    hourly_rate: "",
    experience_level: "",
    availability: "",
    phone: "",
    linkedin: "",
    portfolio: ""
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentLink, setCurrentLink] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: "digital", name: "Digital / Online Services" },
    { id: "tech", name: "Tech / IT Jobs" },
    { id: "offline", name: "Offline / On-Ground Jobs" },
    { id: "content", name: "Content & Creator Economy" },
    { id: "business", name: "Business / Entrepreneurial" },
    { id: "campus", name: "Campus-Based Jobs" }
  ];

  const experienceLevels = [
    { id: "beginner", name: "Beginner (0-1 years)" },
    { id: "intermediate", name: "Intermediate (1-3 years)" },
    { id: "advanced", name: "Advanced (3+ years)" },
    { id: "expert", name: "Expert (5+ years)" }
  ];

  const availabilityOptions = [
    { id: "full-time", name: "Full Time (40+ hrs/week)" },
    { id: "part-time", name: "Part Time (20-40 hrs/week)" },
    { id: "flexible", name: "Flexible Hours" },
    { id: "weekends", name: "Weekends Only" },
    { id: "evenings", name: "Evenings Only" }
  ];

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addPortfolioLink = () => {
    if (currentLink.trim() && !portfolioLinks.includes(currentLink.trim())) {
      setPortfolioLinks([...portfolioLinks, currentLink.trim()]);
      setCurrentLink("");
    }
  };

  const removePortfolioLink = (linkToRemove: string) => {
    setPortfolioLinks(portfolioLinks.filter(link => link !== linkToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create a student profile');
      }

      const { error } = await supabase.from('students').insert({
        name: formData.name,
        email: formData.email,
        category: formData.category,
        skills: skills,
        location: formData.location,
        description: formData.description,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        experience_level: formData.experience_level,
        availability: formData.availability,
        portfolio_links: portfolioLinks,
        profile_photo_url: profilePhotoUrl,
        user_id: user.id, // Link to authenticated user
        contact_info: {
          email: formData.email,
          phone: formData.phone,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio
        }
      });

      if (error) throw error;

      toast({
        title: "Profile Created Successfully!",
        description: "Your student profile is now live and visible to employers.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        category: "",
        location: "",
        description: "",
        hourly_rate: "",
        experience_level: "",
        availability: "",
        phone: "",
        linkedin: "",
        portfolio: ""
      });
      setSkills([]);
      setPortfolioLinks([]);
      setProfilePhotoUrl("");
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Join as Student</h1>
          </div>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Create Your Student Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Photo Upload */}
                <div className="flex justify-center mb-6">
                  <ProfilePhotoUpload
                    currentPhotoUrl={profilePhotoUrl}
                    onPhotoUploaded={setProfilePhotoUrl}
                    onPhotoRemoved={() => setProfilePhotoUrl("")}
                    size="lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@gmail.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Mumbai, India"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={formData.hourly_rate}
                      onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                      placeholder="500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Experience Level *</Label>
                    <Select value={formData.experience_level} onValueChange={(value) => setFormData({...formData, experience_level: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map(level => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="availability">Availability *</Label>
                    <Select value={formData.availability} onValueChange={(value) => setFormData({...formData, availability: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        {availabilityOptions.map(option => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">About Yourself *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tell employers about your background, experience, and what makes you unique..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Portfolio Links</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentLink}
                      onChange={(e) => setCurrentLink(e.target.value)}
                      placeholder="Add a portfolio link"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolioLink())}
                    />
                    <Button type="button" onClick={addPortfolioLink} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {portfolioLinks.map((link, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {link.length > 30 ? `${link.substring(0, 30)}...` : link}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removePortfolioLink(link)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        placeholder="linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio Website</Label>
                      <Input
                        id="portfolio"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                        placeholder="yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Creating Profile..." : "Create Profile"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JoinAsStudent;