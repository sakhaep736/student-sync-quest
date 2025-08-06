import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MapPin, DollarSign, Calendar, Search, Filter, Bookmark, Eye, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  savedDate: string;
  description: string;
  skills: string[];
  category: string;
  status: 'active' | 'expired' | 'filled';
}

const SavedJobs = () => {
  const { language } = useLanguage();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<SavedJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Mock data for demonstration - in real app, fetch user's saved jobs
    const mockSavedJobs: SavedJob[] = [
      {
        id: "1",
        title: "Senior React Developer",
        company: "TechCorp India",
        location: "Mumbai",
        type: "Full-time",
        salary: "₹8-12 LPA",
        postedDate: "2024-01-10",
        savedDate: "2024-01-12",
        description: "We are looking for an experienced React developer to join our team and work on cutting-edge web applications.",
        skills: ["React", "TypeScript", "Node.js", "MongoDB"],
        category: "Technology",
        status: "active"
      },
      {
        id: "2",
        title: "Graphic Designer",
        company: "Creative Solutions",
        location: "Delhi",
        type: "Part-time",
        salary: "₹30,000-50,000/month",
        postedDate: "2024-01-15",
        savedDate: "2024-01-16",
        description: "Create stunning visual designs for digital and print media. Experience with Adobe Creative Suite required.",
        skills: ["Photoshop", "Illustrator", "InDesign", "Figma"],
        category: "Design",
        status: "active"
      },
      {
        id: "3",
        title: "Content Marketing Specialist",
        company: "Digital Nest",
        location: "Bangalore",
        type: "Contract",
        salary: "₹40,000-60,000/month",
        postedDate: "2024-01-05",
        savedDate: "2024-01-08",
        description: "Develop and execute content marketing strategies to drive brand awareness and engagement.",
        skills: ["Content Writing", "SEO", "Social Media", "Analytics"],
        category: "Marketing",
        status: "filled"
      },
      {
        id: "4",
        title: "Data Analyst",
        company: "Analytics Pro",
        location: "Pune",
        type: "Full-time",
        salary: "₹6-9 LPA",
        postedDate: "2023-12-20",
        savedDate: "2023-12-22",
        description: "Analyze large datasets to provide actionable insights for business decision making.",
        skills: ["Python", "SQL", "Tableau", "Excel"],
        category: "Analytics",
        status: "expired"
      },
      {
        id: "5",
        title: "Mobile App Developer",
        company: "AppTech Solutions",
        location: "Hyderabad",
        type: "Full-time",
        salary: "₹7-10 LPA",
        postedDate: "2024-01-18",
        savedDate: "2024-01-20",
        description: "Develop native and cross-platform mobile applications for iOS and Android.",
        skills: ["React Native", "Flutter", "iOS", "Android"],
        category: "Technology",
        status: "active"
      }
    ];
    
    setSavedJobs(mockSavedJobs);
    setFilteredJobs(mockSavedJobs);
  }, []);

  useEffect(() => {
    let filtered = savedJobs;
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(job => job.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    
    setFilteredJobs(filtered);
  }, [searchTerm, categoryFilter, statusFilter, savedJobs]);

  const handleUnsaveJob = (jobId: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'filled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return language === 'en' ? 'Active' : 'सक्रिय';
      case 'filled':
        return language === 'en' ? 'Position Filled' : 'पद भरा गया';
      case 'expired':
        return language === 'en' ? 'Expired' : 'समाप्त';
      default:
        return status;
    }
  };

  const categories = [...new Set(savedJobs.map(job => job.category))];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-primary" />
            {language === 'en' ? 'Saved Jobs' : 'सेव की गई नौकरियां'}
          </h1>
          <p className="text-muted-foreground">
            {filteredJobs.length} {language === 'en' ? 'saved jobs' : 'सेव की गई नौकरियां'}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Bookmark className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{savedJobs.length}</p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' ? 'Total Saved' : 'कुल सेव'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{savedJobs.filter(j => j.status === 'active').length}</p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' ? 'Active Jobs' : 'सक्रिय नौकरियां'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ExternalLink className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{savedJobs.filter(j => j.status === 'filled').length}</p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' ? 'Position Filled' : 'पद भरे गए'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{savedJobs.filter(j => j.status === 'expired').length}</p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' ? 'Expired' : 'समाप्त'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'en' ? 'Search saved jobs...' : 'सेव की गई नौकरियां खोजें...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'en' ? 'All Categories' : 'सभी श्रेणियां'}
                    </SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'en' ? 'All Status' : 'सभी स्थिति'}
                    </SelectItem>
                    <SelectItem value="active">
                      {language === 'en' ? 'Active' : 'सक्रिय'}
                    </SelectItem>
                    <SelectItem value="filled">
                      {language === 'en' ? 'Position Filled' : 'पद भरा गया'}
                    </SelectItem>
                    <SelectItem value="expired">
                      {language === 'en' ? 'Expired' : 'समाप्त'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Jobs List */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {language === 'en' ? 'No saved jobs found' : 'कोई सेव की गई नौकरी नहीं मिली'}
                </p>
                <Link to="/view-jobs">
                  <Button>
                    {language === 'en' ? 'Browse Jobs' : 'नौकरियां देखें'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge className={getStatusColor(job.status)}>
                          {getStatusText(job.status)}
                        </Badge>
                      </div>
                      <p className="text-lg font-medium text-muted-foreground mb-2">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {language === 'en' ? 'Posted' : 'पोस्ट किया गया'} {new Date(job.postedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bookmark className="h-4 w-4" />
                          {language === 'en' ? 'Saved' : 'सेव किया गया'} {new Date(job.savedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/job/${job.id}`}>
                      <Button size="sm" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        {language === 'en' ? 'View Details' : 'विवरण देखें'}
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnsaveJob(job.id)}
                      className="flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      {language === 'en' ? 'Remove' : 'हटाएं'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;