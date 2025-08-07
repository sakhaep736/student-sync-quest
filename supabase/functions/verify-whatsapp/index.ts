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
    const { phoneNumber } = await req.json();
    
    console.log('Verifying WhatsApp number:', phoneNumber);
    
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error('Invalid phone number format. Please include country code.');
    }

    // In a real implementation, you would:
    // 1. Send a verification code via WhatsApp using Twilio or similar service
    // 2. Store the verification code temporarily
    // 3. Return success to prompt user for verification
    
    // For demo purposes, we'll simulate successful verification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('Generated verification code:', verificationCode, 'for number:', phoneNumber);
    
    // In production, you would send this code via WhatsApp API
    // For now, we'll just return success
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Verification code sent to WhatsApp',
        // In production, don't return the code!
        verificationCode: verificationCode // Only for demo
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error verifying WhatsApp:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
})