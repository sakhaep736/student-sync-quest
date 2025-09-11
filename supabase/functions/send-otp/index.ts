import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type } = await req.json();
    
    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: 'Email and type are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate type
    if (!['signup', 'password_reset'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid OTP type' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate OTP using database function
    const { data: otpCode, error: otpError } = await supabase.rpc('generate_otp', {
      email_param: email,
      otp_type_param: type
    });

    if (otpError) {
      console.error('Error generating OTP:', otpError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate OTP' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Send email with OTP
    const emailSubject = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
    const emailContent = `
      <h2>${emailSubject}</h2>
      <p>Your verification code is: <strong style="font-size: 24px; color: #2563eb;">${otpCode}</strong></p>
      <p>This code will expire in 2 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `;

    // For demo purposes, we'll just log the OTP (in production, integrate with email service)
    console.log(`OTP for ${email}: ${otpCode} (type: ${type})`);
    
    // In production, replace this with actual email sending logic
    // Example with SendGrid, Mailgun, or other email service
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // Remove this in production - for demo only
        otp: otpCode 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});