import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing WhatsApp job alerts...');

    // Get all users with WhatsApp notifications enabled
    const { data: users, error: usersError } = await supabaseClient.auth.admin.listUsers();
    
    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    const whatsappUsers = users.users.filter(user => {
      const metadata = user.user_metadata;
      return metadata?.whatsappSettings?.isConnected && 
             metadata?.notifications?.whatsappEnabled &&
             metadata?.notifications?.whatsappJobAlerts;
    });

    console.log(`Found ${whatsappUsers.length} users with WhatsApp job alerts enabled`);

    // Simulate job data - in production, this would fetch from your jobs table
    const sampleJobs = [
      {
        title: "Flexible Data Entry Clerk",
        location: "Remote",
        hourlyRate: "₹300/hour",
        description: "Part-time data entry work, flexible hours"
      },
      {
        title: "Evening Delivery Assistant",
        location: "Mumbai",
        hourlyRate: "₹250/hour", 
        description: "Evening delivery shifts available"
      },
      {
        title: "Weekend Tutor",
        location: "Delhi",
        hourlyRate: "₹500/hour",
        description: "Mathematics tutor for high school students"
      }
    ];

    let successCount = 0;
    let failureCount = 0;

    // Send notifications to each user
    for (const user of whatsappUsers) {
      try {
        const phoneNumber = user.user_metadata?.whatsappSettings?.phoneNumber;
        if (!phoneNumber) continue;

        // Randomly select a job for demo
        const job = sampleJobs[Math.floor(Math.random() * sampleJobs.length)];
        
        const message = `New job opportunity available!\n\n*${job.title}*\nLocation: ${job.location}\nRate: ${job.hourlyRate}\n\n${job.description}`;

        // Call the send-whatsapp-notification function
        const notificationResponse = await supabaseClient.functions.invoke('send-whatsapp-notification', {
          body: {
            phoneNumber: phoneNumber,
            message: message,
            messageType: 'job_alert',
            jobData: job
          }
        });

        if (notificationResponse.error) {
          console.error(`Failed to send to ${phoneNumber}:`, notificationResponse.error);
          failureCount++;
        } else {
          console.log(`Successfully sent job alert to ${phoneNumber}`);
          successCount++;
        }

      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        failureCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'WhatsApp job alerts processed',
        stats: {
          totalUsers: whatsappUsers.length,
          successCount,
          failureCount
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error processing WhatsApp job alerts:', error);
    
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