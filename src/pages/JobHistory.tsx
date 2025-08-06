import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin, DollarSign, Calendar, Search, Filter, Briefcase } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  salary: string;
  status: 'completed' | 'ongoing' | 'cancelled';
  startDate: string;
  endDate?: string;
  description: string;
  skills: string[];
}

const JobHistory = () => {
  const { language } = useLanguage();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Mock data for demonstration - in real app, fetch from backend
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "React Developer",
        company: "Tech Solutions Ltd",
        location: "Mumbai",
        duration: "3 months",
        salary: "₹45,000/month",
        status: "completed",
        startDate: "2024-01-15",
        endDate: "2024-04-15",
        description: "Developed responsive web applications using React and TypeScript",
        skills: ["React", "TypeScript", "Tailwind CSS"]
      },
      {
        id: "2",
        title: "UI/UX Designer",
        company: "Creative Agency",
        location: "Delhi",
        duration: "2 months",
        salary: "₹35,000/month",
        status: "completed",
        startDate: "2024-02-01",
        endDate: "2024-04-01",
        description: "Designed user interfaces for mobile and web applications",
        skills: ["Figma", "Adobe XD", "Prototyping"]
      },
      {
        id: "3",
        title: "Content Writer",
        company: "Digital Marketing Co",
        location: "Bangalore",
        duration: "Ongoing",
        salary: "₹25,000/month",
        status: "ongoing",
        startDate: "2024-05-01",
        description: "Creating engaging content for social media and blogs",
        skills: ["Content Writing", "SEO", "Social Media"]
      },
      {
        id: "4",
        title: "Data Entry Specialist",
        company: "DataCorp",
        location: "Pune",
        duration: "1 month",
        salary: "₹20,000/month",
        status: "cancelled",
        startDate: "2024-03-01",
        endDate: "2024-03-15",
        description: "Data entry and validation for customer database",
        skills: ["Excel", "Data Entry", "Attention to Detail"]
      }
    ];
    
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
  }, []);

  useEffect(() => {
    let filtered = jobs;
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    
    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, jobs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return language === 'en' ? 'Completed' : 'पूर्ण';
      case 'ongoing':
        return language === 'en' ? 'Ongoing' : 'चालू';
      case 'cancelled':
        return language === 'en' ? 'Cancelled' : 'रद्द';
      default:
        return status;
    }
  };

  const totalEarnings = jobs
    .filter(job => job.status === 'completed')
    .reduce((total, job) => {
      const amount = parseInt(job.salary.replace(/[^0-9]/g, ''));
      const months = job.duration.includes('month') ? parseInt(job.duration) : 1;
      return total + (amount * months);
    }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            {language === 'en' ? 'Job History' : 'नौकरी का इतिहास'}
          </h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' ? 'Total Jobs' : 'कुल नौकरियां'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'completed').length}</p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' ? 'Completed' : 'पूर्ण'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.filter(j => j.status === 'ongoing').length}</p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' ? 'Ongoing' : 'चालू'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{totalEarnings.toLocaleString()}</p>
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' ? 'Total Earned' : 'कुल कमाई'}
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
                    placeholder={language === 'en' ? 'Search jobs by title or company...' : 'शीर्षक या कंपनी द्वारा नौकरी खोजें...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {language === 'en' ? 'All Status' : 'सभी स्थिति'}
                    </SelectItem>
                    <SelectItem value="completed">
                      {language === 'en' ? 'Completed' : 'पूर्ण'}
                    </SelectItem>
                    <SelectItem value="ongoing">
                      {language === 'en' ? 'Ongoing' : 'चालू'}
                    </SelectItem>
                    <SelectItem value="cancelled">
                      {language === 'en' ? 'Cancelled' : 'रद्द'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job List */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'en' ? 'No jobs found matching your criteria' : 'आपके मानदंडों से मेल खाने वाली कोई नौकरी नहीं मिली'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <p className="text-lg font-medium text-muted-foreground mb-2">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(job.startDate).toLocaleDateString()}
                          {job.endDate && ` - ${new Date(job.endDate).toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusText(job.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
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

export default JobHistory;