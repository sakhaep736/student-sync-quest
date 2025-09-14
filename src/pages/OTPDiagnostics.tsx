import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface DiagnosticResult {
  timestamp: string;
  email: string;
  type: string;
  success: boolean;
  error?: string;
  requestId?: string;
  providerResponse?: any;
  duration: number;
}

const OTPDiagnostics = () => {
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const { toast } = useToast();

  const runDiagnostic = async (type: 'signup' | 'password_reset') => {
    if (!testEmail || !testEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      console.log(`🧪 Starting OTP diagnostic test - Type: ${type}, Email: ${testEmail}`);
      
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: testEmail, type }
      });

      const duration = Date.now() - startTime;

      const result: DiagnosticResult = {
        timestamp: new Date().toISOString(),
        email: testEmail,
        type,
        success: !error && data?.success,
        error: error?.message || (data?.success ? undefined : data?.error),
        requestId: data?.requestId,
        providerResponse: data,
        duration
      };

      console.log('🧪 Diagnostic result:', result);
      
      setResults(prev => [result, ...prev]);

      if (result.success) {
        toast({
          title: "✅ Test Successful",
          description: `OTP sent successfully to ${testEmail} in ${duration}ms`,
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }

    } catch (error: any) {
      const duration = Date.now() - startTime;
      console.error('🧪 Diagnostic error:', error);
      
      const result: DiagnosticResult = {
        timestamp: new Date().toISOString(),
        email: testEmail,
        type,
        success: false,
        error: error.message || 'Network or function error',
        duration
      };

      setResults(prev => [result, ...prev]);
      
      toast({
        title: "❌ Test Error",
        description: error.message || "Failed to run diagnostic test",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "SUCCESS" : "FAILED"}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            OTP Email Diagnostics
          </CardTitle>
          <CardDescription>
            Test OTP email delivery and diagnose configuration issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Test Email Address</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="Enter email to test OTP delivery"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => runDiagnostic('signup')}
              disabled={loading || !testEmail}
              className="flex-1"
            >
              {loading ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : null}
              Test Signup OTP
            </Button>
            <Button
              onClick={() => runDiagnostic('password_reset')}
              disabled={loading || !testEmail}
              variant="outline"
              className="flex-1"
            >
              {loading ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : null}
              Test Password Reset OTP
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Current Issues Detected:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Invalid RESEND_API_KEY configuration</li>
                <li>• SMTP authentication failing</li>
                <li>• Check Supabase Auth SMTP settings</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results ({results.length})</CardTitle>
            <CardDescription>
              Latest diagnostic test results with detailed error information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.success)}
                    <div>
                      <div className="font-medium">{result.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.type} • {new Date(result.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(result.success)}
                    <Badge variant="outline">{result.duration}ms</Badge>
                  </div>
                </div>

                {result.error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Error:</strong> {result.error}
                    </AlertDescription>
                  </Alert>
                )}

                {result.requestId && (
                  <div className="text-sm">
                    <strong>Request ID:</strong> <code className="bg-muted px-1 rounded">{result.requestId}</code>
                  </div>
                )}

                {result.providerResponse && (
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium">Provider Response</summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                      {JSON.stringify(result.providerResponse, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OTPDiagnostics;