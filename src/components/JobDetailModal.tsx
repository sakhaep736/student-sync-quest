import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, User, Clock, Briefcase } from "lucide-react";

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

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailModal = ({ job, isOpen, onClose }: JobDetailModalProps) => {
  if (!job) return null;

  const createdDate = new Date(job.created_at).toLocaleDateString();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Job Overview */}
          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {job.employer_name}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Posted {createdDate}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <Badge variant="secondary">{job.job_type}</Badge>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Budget Range</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹{job.budget_min.toLocaleString()} - ₹{job.budget_max.toLocaleString()}
            </p>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2 text-lg">Job Description</h3>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Skills Required */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills_required.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="font-semibold mb-2 text-lg">Category</h3>
            <Badge>{job.category}</Badge>
          </div>

          {/* Contact Information */}
          {job.employer_contact && (
            <div>
              <h3 className="font-semibold mb-2 text-lg">Contact Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {job.employer_contact.email && (
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {job.employer_contact.email}
                  </p>
                )}
                {job.employer_contact.phone && (
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {job.employer_contact.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">
              Apply for this Job
            </Button>
            <Button variant="outline">
              Save Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailModal;