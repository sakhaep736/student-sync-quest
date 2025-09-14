import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';

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

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Send email with OTP
    const emailSubject = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">${emailSubject}</h2>
        <p style="color: #666; margin-bottom: 20px;">Your verification code is:</p>
        <div style="background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${otpCode}</span>
        </div>
        <p style="color: #666; margin-top: 20px;">This code will expire in 2 minutes.</p>
        <p style="color: #999; font-size: 14px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `;
    const emailText = `Your verification code is: ${otpCode}. This code will expire in 2 minutes. If you didn't request this, please ignore this email.`;

    try {
      const sendRes = await resend.emails.send({
        from: 'Lovable <onboarding@resend.dev>',
        to: [email],
        subject: emailSubject,
        html: emailContent,
        text: emailText,
      });

      console.log('Resend send result:', sendRes);
      console.log(`OTP sent to ${email}: ${otpCode} (type: ${type})`);
      
      // Check for Resend API errors
      if (sendRes.error) {
        console.error('Resend API error:', sendRes.error);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: `Email delivery failed: ${sendRes.error.message || 'Unknown provider error'}`,
            providerError: sendRes.error
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP sent successfully',
          requestId: sendRes.data?.id,
          provider: 'resend'
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // Enhanced error details
      let errorMessage = 'Failed to send OTP email';
      let errorDetails = emailError;
      
      if (emailError.message?.includes('API key')) {
        errorMessage = 'Invalid email service API key';
      } else if (emailError.message?.includes('authentication')) {
        errorMessage = 'Email service authentication failed';
      } else if (emailError.message?.includes('rate limit')) {
        errorMessage = 'Email service rate limit exceeded';
      }
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: errorMessage,
          details: errorDetails?.message || 'Unknown error',
          provider: 'resend'
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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