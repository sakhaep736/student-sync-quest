import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import StudentDetailModal from "@/components/StudentDetailModal";

interface Student {
  id: string;
  name: string;
  category: string;
  skills: string[];
  location: string;
  description: string;
  hourly_rate: number;
  experience_level: string;
  availability: string;
  email?: string;
  contact_info?: any;
  portfolio_links?: string[];
  created_at: string;
}

const BrowseStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await supabase.from('students').select('*');
      if (data) setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || student.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold">Browse Students ({filteredStudents.length})</h1>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card 
                key={student.id} 
                className="hover:shadow-lg transition-shadow bg-white cursor-pointer"
                onClick={() => handleStudentClick(student)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {student.location}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{student.experience_level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{student.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {student.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {student.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{student.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-600">₹{student.hourly_rate}/hr</span>
                    <span className="text-sm text-gray-500">{student.availability}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <StudentDetailModal 
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BrowseStudents;