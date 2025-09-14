import React, { useState, useEffect } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OTPInputProps {
  email: string;
  type: 'signup' | 'password_reset';
  onVerified: () => void;
  onBack: () => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ email, type, onVerified, onBack }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  // Start 60-second cooldown on mount to prevent rate limiting
  useEffect(() => {
    setResendCooldown(60);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, otp, type }
      });

      if (error) {
        console.error('Supabase OTP verification error:', error);
        throw new Error(`Verification failed: ${error.message || 'Unknown error'}`);
      }

      if (data?.verified) {
        toast({
          title: "Success",
          description: data.message || "OTP verified successfully",
        });
        onVerified();
      } else {
        const errorMsg = data?.error || "Invalid or expired OTP";
        console.error('OTP verification failed:', data);
        toast({
          title: "Verification Failed",
          description: errorMsg,
          variant: "destructive",
        });
        setOtp(''); // Clear invalid OTP
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      let errorDescription = error.message || "Failed to verify OTP";
      
      if (error.message?.includes('expired')) {
        errorDescription = "OTP has expired. Please request a new code.";
      } else if (error.message?.includes('attempts')) {
        errorDescription = "Too many verification attempts. Please request a new code.";
      }
      
      toast({
        title: "Verification Error",
        description: errorDescription,
        variant: "destructive",
      });
      setOtp(''); // Clear on error
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email, type }
      });

      if (error) {
        console.error('Supabase resend error:', error);
        throw new Error(`Resend failed: ${error.message || 'Unknown error'}`);
      }

      if (!data?.success) {
        const errorMsg = data?.error || 'Failed to resend OTP';
        console.error('OTP resend failed:', data);
        throw new Error(errorMsg);
      }

      toast({
        title: "New Code Sent",
        description: `A new verification code has been sent to ${email}`,
      });
      setResendCooldown(60); // 60-second cooldown to prevent rate limiting
      setOtp(''); // Clear current OTP
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      
      let errorDescription = error.message || "Failed to resend OTP";
      
      if (error.message?.includes('API key is invalid')) {
        errorDescription = "Email service configuration error. Please contact support.";
      } else if (error.message?.includes('rate limit')) {
        errorDescription = "Too many requests. Please wait before trying again.";
      }
      
      toast({
        title: "Resend Error",
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="text-muted-foreground mt-2">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Code expires in 2 minutes
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          disabled={loading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          variant="ghost"
          onClick={handleResendOTP}
          disabled={resendCooldown > 0 || loading}
          className="w-full"
        >
          {resendCooldown > 0
            ? `Resend OTP in ${resendCooldown}s`
            : "Resend OTP"
          }
        </Button>

        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="w-full"
        >
          Back
        </Button>
      </div>

      {loading && (
        <div className="text-center text-sm text-muted-foreground">
          Verifying...
        </div>
      )}
    </div>
  );
};

export default OTPInput;