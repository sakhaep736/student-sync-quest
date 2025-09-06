import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase } from "lucide-react";
import Navigation from "@/components/Navigation";
import JobDetailModal from "@/components/JobDetailModal";
import { User } from "@supabase/supabase-js";

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  job_type: string;
  location: string;
  skills_required: string[];
  employer_name: string;
  employer_contact?: any;
  status: string;
  created_at: string;
}

const ViewJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "digital", name: "Digital / Online Services" },
    { id: "tech", name: "Tech / IT Jobs" },
    { id: "offline", name: "Offline / On-Ground Jobs" },
    { id: "content", name: "Content & Creator Economy" },
    { id: "business", name: "Business / Entrepreneurial" },
    { id: "campus", name: "Campus-Based Jobs" }
  ];

  useEffect(() => {
    fetchJobs();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchJobs = async () => {
    try {
      // Use secure function to get jobs without sensitive data
      const { data } = await supabase.rpc('get_public_jobs');
      if (data) setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills_required.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    
    // Filter by job type (online/offline)
    let matchesJobType = true;
    if (jobTypeFilter === "online") {
      matchesJobType = job.location?.toLowerCase().includes("remote") || 
                      job.location?.toLowerCase().includes("online") ||
                      job.location?.toLowerCase().includes("anywhere") ||
                      job.job_type?.toLowerCase().includes("remote");
    } else if (jobTypeFilter === "offline") {
      matchesJobType = !(job.location?.toLowerCase().includes("remote") || 
                        job.location?.toLowerCase().includes("online") ||
                        job.location?.toLowerCase().includes("anywhere") ||
                        job.job_type?.toLowerCase().includes("remote"));
    }
    
    return matchesSearch && matchesCategory && matchesJobType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Briefcase className="h-6 w-6 text-green-600" />
            <h1 className="text-3xl font-bold">Active Job Listings ({filteredJobs.length})</h1>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search jobs or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                className="hover:shadow-lg transition-shadow bg-white cursor-pointer"
                onClick={() => handleJobClick(job)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location} • {job.employer_name}
                      </CardDescription>
                    </div>
                    <Badge>{job.job_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.skills_required.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills_required.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.skills_required.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-600">
                      ₹{job.budget_min.toLocaleString()} - ₹{job.budget_max.toLocaleString()}
                    </span>
                    <Button size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleJobClick(job);
                    }}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <JobDetailModal 
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default ViewJobs;