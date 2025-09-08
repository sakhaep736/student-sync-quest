import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateFileType, validateFileSize } from "@/utils/security";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUploaded: (url: string) => void;
  onPhotoRemoved?: () => void;
  size?: "sm" | "md" | "lg";
}

const ProfilePhotoUpload = ({ 
  currentPhotoUrl, 
  onPhotoUploaded, 
  onPhotoRemoved,
  size = "md" 
}: ProfilePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24", 
    lg: "h-32 w-32"
  };

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type using security utility
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validateFileType(file, allowedTypes)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, GIF, or WebP image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB limit) using security utility
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validateFileSize(file, maxSize)) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to upload photos",
          variant: "destructive",
        });
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;
      const filePath = `${fileName}`;

      // Remove existing photo if any
      if (currentPhotoUrl) {
        const oldPath = currentPhotoUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profile-photos')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new photo
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      onPhotoUploaded(data.publicUrl);

      toast({
        title: "Photo uploaded successfully!",
        description: "Your profile photo has been updated.",
      });

    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    if (!currentPhotoUrl || !onPhotoRemoved) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileName = currentPhotoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('profile-photos')
          .remove([`${user.id}/${fileName}`]);
      }

      onPhotoRemoved();

      toast({
        title: "Photo removed",
        description: "Your profile photo has been removed.",
      });

    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Failed to remove photo",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentPhotoUrl} alt="Profile photo" />
          <AvatarFallback className="bg-gray-200">
            <Camera className="h-6 w-6 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        
        {currentPhotoUrl && onPhotoRemoved && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={removePhoto}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Label htmlFor="photo-upload" className="cursor-pointer">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="flex items-center gap-2"
            asChild
          >
            <span>
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : currentPhotoUrl ? "Change Photo" : "Upload Photo"}
            </span>
          </Button>
        </Label>
        
        <Input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={uploadPhoto}
          disabled={uploading}
          className="hidden"
        />
        
        <p className="text-xs text-muted-foreground text-center">
          Upload a profile photo (PNG, JPG up to 5MB)
        </p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;