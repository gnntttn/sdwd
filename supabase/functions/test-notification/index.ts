import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'https://deno.land/x/web_push@0.2.0/mod.ts';

// These secrets are set in the Supabase Dashboard
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT');

const TEST_NOTIFICATION = {
  title: 'إشعار تجريبي',
  body: 'إذا وصلك هذا الإشعار، فالنظام يعمل بنجاح!',
};

serve(async (_req) => {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
      throw new Error('VAPID keys are not set in environment variables. Please set them in your Supabase project secrets.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch all subscriptions from the database
    const { data: subscriptions, error: dbError } = await supabaseAdmin
      .from('push_subscriptions')
      .select('id, subscription_data');

    if (dbError) throw dbError;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No active subscriptions found to send a test notification.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Set VAPID details for web-push
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    // Send notifications to all subscribers
    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          sub.subscription_data,
          JSON.stringify(TEST_NOTIFICATION)
        );
      } catch (err) {
        // If a subscription is expired or invalid, delete it
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log(`Subscription ${sub.id} is expired or invalid. Deleting.`);
          await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
        } else {
          console.error(`Failed to send notification to subscription ${sub.id}:`, err);
        }
      }
    });

    await Promise.all(sendPromises);

    return new Response(JSON.stringify({ message: `Successfully sent test notifications to ${subscriptions.length} subscribers.` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in test-notification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
