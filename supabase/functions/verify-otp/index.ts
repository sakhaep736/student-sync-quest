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
    const { email, otp, type } = await req.json();
    
    if (!email || !otp || !type) {
      return new Response(
        JSON.stringify({ error: 'Email, OTP, and type are required' }), 
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

    // Verify OTP using database function
    const { data: isValid, error: verifyError } = await supabase.rpc('verify_otp', {
      email_param: email,
      otp_code_param: otp,
      otp_type_param: type
    });

    if (verifyError) {
      console.error('Error verifying OTP:', verifyError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify OTP' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If this is a signup OTP, create/verify the user
    if (type === 'signup') {
      // For signup verification, we'll return success and let the client handle user creation
      return new Response(
        JSON.stringify({ 
          success: true, 
          verified: true,
          message: 'Email verified successfully' 
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // For password reset, return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        verified: true,
        message: 'OTP verified successfully' 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in verify-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});