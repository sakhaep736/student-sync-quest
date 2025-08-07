import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, TestTube, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WhatsAppTestPanel = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("+911234567890");
  const [testMessage, setTestMessage] = useState("Test WhatsApp notification from ShiftBuddy!");
  const [messageType, setMessageType] = useState("job_alert");

  const messageTypes = [
    { value: "job_alert", label: "Job Alert", emoji: "🚨" },
    { value: "application_update", label: "Application Update", emoji: "📋" },
    { value: "interview_reminder", label: "Interview Reminder", emoji: "⏰" },
    { value: "payment_notification", label: "Payment Notification", emoji: "💰" },
    { value: "weekly_digest", label: "Weekly Digest", emoji: "📊" },
    { value: "urgent_alert", label: "Urgent Alert", emoji: "🔴" }
  ];

  const handleTestNotification = async () => {
    if (!testPhone || !testMessage) {
      toast({
        title: "Error",
        description: "Please enter both phone number and message",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-notification', {
        body: {
          phoneNumber: testPhone,
          message: testMessage,
          messageType: messageType
        }
      });

      if (error) throw error;

      toast({
        title: "Test Notification Sent",
        description: `WhatsApp message sent successfully! Message ID: ${data.messageId}`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkJobAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-job-alerts');

      if (error) throw error;

      toast({
        title: "Bulk Alerts Processed",
        description: `Sent alerts to ${data.stats.successCount} users, ${data.stats.failureCount} failed`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Bulk Alert Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          WhatsApp Integration Test Panel
          <Badge variant="outline" className="ml-auto">
            <TestTube className="h-3 w-3 mr-1" />
            Development Mode
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Setup Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p>To enable real WhatsApp messaging, configure these Supabase secrets:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>TWILIO_ACCOUNT_SID</code> - Your Twilio Account SID</li>
              <li><code>TWILIO_AUTH_TOKEN</code> - Your Twilio Auth Token</li>
              <li><code>TWILIO_WHATSAPP_NUMBER</code> - Your Twilio WhatsApp number (e.g., +14155238886)</li>
            </ul>
            <p className="mt-2">
              <strong>Note:</strong> Without these credentials, the system will simulate message sending for testing.
            </p>
          </div>
        </div>

        <Separator />

        {/* Single Message Test */}
        <div className="space-y-4">
          <h4 className="font-semibold">Test Single WhatsApp Notification</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testPhone">Test Phone Number</Label>
              <Input
                id="testPhone"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+911234567890"
              />
            </div>
            
            <div>
              <Label htmlFor="messageType">Message Type</Label>
              <select
                id="messageType"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {messageTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.emoji} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="testMessage">Test Message</Label>
            <textarea
              id="testMessage"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your test message..."
            />
          </div>

          <Button onClick={handleTestNotification} disabled={loading} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Sending..." : "Send Test Notification"}
          </Button>
        </div>

        <Separator />

        {/* Bulk Job Alerts Test */}
        <div className="space-y-4">
          <h4 className="font-semibold">Test Bulk Job Alerts</h4>
          <p className="text-sm text-gray-600">
            This will send job alert notifications to all users who have WhatsApp notifications enabled.
          </p>
          
          <Button 
            onClick={handleBulkJobAlerts} 
            disabled={loading} 
            variant="outline" 
            className="w-full"
          >
            <Clock className="h-4 w-4 mr-2" />
            {loading ? "Processing..." : "Send Bulk Job Alerts"}
          </Button>
        </div>

        {/* WhatsApp Features Overview */}
        <div className="space-y-3">
          <h4 className="font-semibold">Available WhatsApp Notification Types</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {messageTypes.map(type => (
              <div key={type.value} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span>{type.emoji}</span>
                <span className="text-sm">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppTestPanel;