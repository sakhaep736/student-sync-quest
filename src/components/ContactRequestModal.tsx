import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface ContactRequestModalProps {
  job: {
    id: string;
    title: string;
    employer_name: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ContactRequestModal = ({ job, isOpen, onClose, user }: ContactRequestModalProps) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!job || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message for the employer.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Create contact request
      const { error } = await supabase
        .from('contact_requests')
        .insert({
          student_id: user.id,
          job_id: job.id,
          message: message.trim(),
          employer_contact: {} // Placeholder for now
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Request already sent",
            description: "You have already requested contact information for this job.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Contact request sent!",
          description: "The employer will review your request and respond soon.",
        });
        setMessage("");
        onClose();
      }
    } catch (error) {
      console.error('Error creating contact request:', error);
      toast({
        title: "Error",
        description: "Failed to send contact request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Contact Information</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Job: {job.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Send a message to {job.employer_name} requesting their contact information.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Your message to the employer:
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm interested in this position and would like to discuss the opportunity further..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !message.trim()} className="flex-1">
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactRequestModal;