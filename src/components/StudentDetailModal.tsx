import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, User, Clock, Star, ExternalLink } from "lucide-react";

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

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const StudentDetailModal = ({ student, isOpen, onClose }: StudentDetailModalProps) => {
  if (!student) return null;

  const joinedDate = new Date(student.created_at).toLocaleDateString();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{student.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Student Overview */}
          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {student.location}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <Badge variant="secondary">{student.experience_level}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {joinedDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {student.availability}
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Hourly Rate</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹{student.hourly_rate}/hour
            </p>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-2 text-lg">About</h3>
            <p className="text-muted-foreground leading-relaxed">{student.description}</p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="font-semibold mb-2 text-lg">Category</h3>
            <Badge>{student.category}</Badge>
          </div>

          {/* Portfolio Links */}
          {student.portfolio_links && student.portfolio_links.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-lg">Portfolio & Work Samples</h3>
              <div className="space-y-2">
                {student.portfolio_links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-2 text-lg">Contact Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-1">
              {student.email || student.contact_info ? (
                <>
                  {student.email && (
                    <p className="text-sm">
                      <span className="font-medium">Email:</span> {student.email}
                    </p>
                  )}
                  {student.contact_info?.phone && (
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> {student.contact_info.phone}
                    </p>
                  )}
                  {student.contact_info?.linkedin && (
                    <p className="text-sm">
                      <span className="font-medium">LinkedIn:</span> 
                      <a 
                        href={student.contact_info.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        {student.contact_info.linkedin}
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Contact information is protected for student privacy.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use the "Send Message" button to connect with this student.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              Hire {student.name}
            </Button>
            <Button variant="outline">
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailModal;