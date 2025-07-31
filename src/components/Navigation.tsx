import { Button } from "@/components/ui/button";
import { Users, Briefcase, UserPlus, Info, Mail } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SB</span>
          </div>
          <span className="text-xl font-bold text-gray-900">ShiftBuddy</span>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Browse Students
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            View Jobs
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Post a Job
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Join as Student
          </Button>
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Contact</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;