import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, message, messageType, jobData } = await req.json();
    
    console.log('Sending WhatsApp notification:', { phoneNumber, messageType });
    
    if (!phoneNumber || !message) {
      throw new Error('Phone number and message are required');
    }

    // Get Twilio credentials from Supabase secrets
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioWhatsappNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER');

    if (!twilioAccountSid || !twilioAuthToken || !twilioWhatsappNumber) {
      console.log('Twilio credentials not configured, simulating message send');
      
      // Simulate successful send for demo
      return new Response(
        JSON.stringify({
          success: true,
          message: 'WhatsApp notification sent successfully (simulated)',
          messageId: `msg_${Date.now()}`,
          messageType: messageType
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    // Format message based on type
    let formattedMessage = message;
    
    switch (messageType) {
      case 'job_alert':
        formattedMessage = `🚨 *New Job Alert!*\n\n${message}\n\n💼 Apply now on ShiftBuddy!`;
        break;
      case 'application_update':
        formattedMessage = `📋 *Application Update*\n\n${message}\n\n✅ Check your dashboard for details.`;
        break;
      case 'interview_reminder':
        formattedMessage = `⏰ *Interview Reminder*\n\n${message}\n\n🤝 Good luck!`;
        break;
      case 'payment_notification':
        formattedMessage = `💰 *Payment Notification*\n\n${message}\n\n💳 Check your earnings dashboard.`;
        break;
      case 'weekly_digest':
        formattedMessage = `📊 *Weekly Digest*\n\n${message}\n\n📱 Open ShiftBuddy for more details.`;
        break;
      case 'urgent_alert':
        formattedMessage = `🔴 *URGENT ALERT*\n\n${message}\n\n⚡ Immediate action required!`;
        break;
      default:
        formattedMessage = `📢 *ShiftBuddy Notification*\n\n${message}`;
    }

    // Send WhatsApp message via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('From', `whatsapp:${twilioWhatsappNumber}`);
    formData.append('To', `whatsapp:${phoneNumber}`);
    formData.append('Body', formattedMessage);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Twilio API error: ${result.message}`);
    }

    console.log('WhatsApp message sent successfully:', result.sid);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'WhatsApp notification sent successfully',
        messageId: result.sid,
        messageType: messageType
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
})