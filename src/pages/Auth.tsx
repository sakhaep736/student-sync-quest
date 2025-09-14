import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { validatePassword } from '@/utils/security';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import OTPInput from '@/components/OTPInput';
import PasswordResetForm from '@/components/PasswordResetForm';

const Auth = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  // OTP flow states
  const [currentFlow, setCurrentFlow] = useState<'auth' | 'signup-otp' | 'reset-email' | 'reset-otp' | 'reset-password'>('auth');
  const [otpEmail, setOtpEmail] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordErrors(passwordValidation.errors);
      toast({
        title: "Password requirements not met",
        description: "Please fix the password requirements listed below.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setPasswordErrors([]);

    try {
      // Send OTP for signup verification
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email, type: 'signup' }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Edge function error: ${error.message || 'Unknown error'}`);
      }

      if (!data?.success) {
        const errorMsg = data?.error || 'Failed to send OTP';
        console.error('OTP send failed:', data);
        throw new Error(errorMsg);
      }

      setOtpEmail(email);
      setCurrentFlow('signup-otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${email}. Check your inbox and spam folder.`,
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      
      // Enhanced error handling with specific provider errors
      let errorDescription = error.message || "Failed to send verification code";
      
      if (error.message?.includes('API key is invalid')) {
        errorDescription = "Email service configuration error. Please contact support.";
      } else if (error.message?.includes('authentication failed')) {
        errorDescription = "Email authentication failed. Please contact support.";
      } else if (error.message?.includes('rate limit')) {
        errorDescription = "Too many requests. Please wait before trying again.";
      }
      
      toast({
        title: "Sign Up Error",
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      // Send OTP for password reset
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: resetEmail, type: 'password_reset' }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Edge function error: ${error.message || 'Unknown error'}`);
      }

      if (!data?.success) {
        const errorMsg = data?.error || 'Failed to send reset code';
        console.error('Password reset OTP failed:', data);
        throw new Error(errorMsg);
      }

      setOtpEmail(resetEmail);
      setCurrentFlow('reset-otp');
      setIsResetDialogOpen(false);
      setResetEmail('');
      toast({
        title: "Reset Code Sent",
        description: `Password reset code sent to ${resetEmail}. Check your inbox and spam folder.`,
      });
    } catch (error: any) {
      console.error('Error sending reset OTP:', error);
      
      // Enhanced error handling
      let errorDescription = error.message || "Failed to send verification code";
      
      if (error.message?.includes('API key is invalid')) {
        errorDescription = "Email service configuration error. Please contact support.";
      } else if (error.message?.includes('authentication failed')) {
        errorDescription = "Email authentication failed. Please contact support.";
      } else if (error.message?.includes('rate limit')) {
        errorDescription = "Too many requests. Please wait before trying again.";
      }
      
      toast({
        title: "Reset Password Error",
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleSignupOTPVerified = async () => {
    try {
      // Create user account after OTP verification
      const { error } = await supabase.auth.signUp({
        email: otpEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      // Sign in the user immediately after successful signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: otpEmail,
        password
      });

      if (signInError) throw signInError;

      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      setCurrentFlow('auth');
    }
  };

  const handleResetOTPVerified = () => {
    setCurrentFlow('reset-password');
  };

  const handlePasswordResetSuccess = () => {
    setCurrentFlow('auth');
    setOtpEmail('');
    setPassword('');
    toast({
      title: "Password Reset Complete",
      description: "You can now sign in with your new password.",
    });
  };

  const handleBackToAuth = () => {
    setCurrentFlow('auth');
    setOtpEmail('');
    setEmail('');
    setPassword('');
    setPasswordErrors([]);
  };

  // Render different flows
  const renderContent = () => {
    switch (currentFlow) {
      case 'signup-otp':
        return (
          <OTPInput
            email={otpEmail}
            type="signup"
            onVerified={handleSignupOTPVerified}
            onBack={handleBackToAuth}
          />
        );
      case 'reset-otp':
        return (
          <OTPInput
            email={otpEmail}
            type="password_reset"
            onVerified={handleResetOTPVerified}
            onBack={handleBackToAuth}
          />
        );
      case 'reset-password':
        return (
          <PasswordResetForm
            email={otpEmail}
            onSuccess={handlePasswordResetSuccess}
            onBack={handleBackToAuth}
          />
        );
      default:
        return (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="text-right">
                    <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Reset Password</DialogTitle>
                          <DialogDescription>
                            Enter your email address and we'll send you a verification code to reset your password.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input
                              id="reset-email"
                              type="email"
                              placeholder="Enter your email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={resetLoading}
                          >
                            {resetLoading ? 'Sending...' : 'Send OTP'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={loading}
                >
                  {loading ? t('auth.signingIn') : t('auth.signIn')}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-gray-700">{t('auth.email')}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-gray-700">{t('auth.password')}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder={t('auth.createPasswordPlaceholder')}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordErrors([]);
                    }}
                    required
                  />
                  <PasswordStrengthMeter password={password} />
                  {passwordErrors.length > 0 && (
                    <div className="space-y-1">
                      {passwordErrors.map((error, index) => (
                        <p key={index} className="text-sm text-destructive">
                          • {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white" 
                  disabled={loading}
                >
                  {loading ? t('auth.creatingAccount') : t('auth.signUp')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative">
      {/* Language Toggle - Top Right */}
      {currentFlow === 'auth' && (
        <div className="absolute top-4 right-4 flex flex-col items-center gap-1">
          <Button
            onClick={toggleLanguage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
          >
            <Languages size={18} />
            <span className="text-sm font-medium">
              {language === 'en' ? 'हिं' : 'EN'}
            </span>
          </Button>
          <span className="text-sm text-gray-700 font-medium text-center px-2 py-1 bg-gray-50 rounded-md">
            {language === 'en' ? 'If you want to change the language click above' : 'यदि आप भाषा बदलना चाहते हैं तो ऊपर क्लिक करें'}
          </span>
        </div>
      )}
      
      <Card className="w-full max-w-md bg-white">
        {currentFlow === 'auth' && (
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">{t('auth.welcome')}</CardTitle>
            <CardDescription className="text-gray-600">
              {t('auth.subtitle')}
            </CardDescription>
          </CardHeader>
        )}
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;