import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import webpush from 'https://deno.land/x/web_push@0.2.0/mod.ts';

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT');

const NOTIFICATION_MESSAGES = [
  { title: 'تذكير يومي', body: 'سبحان الله وبحمده، سبحان الله العظيم' },
  { title: 'آية وتدبر', body: 'وَاذْكُر رَّبَّكَ فِي نَفْسِكَ تَضَرُّعًا وَخِيفَةً' },
  { title: 'دعاء اليوم', body: 'اللهم أعني على ذكرك وشكرك وحسن عبادتك' },
  { title: 'كنز من كنوز الجنة', body: 'لا حول ولا قوة إلا بالله' },
  { title: 'فضل الصلاة على النبي', body: 'اللهم صل وسلم على نبينا محمد' },
  { title: 'تسبيحة اليوم', body: 'سبحان الله وبحمده عدد خلقه ورضا نفسه وزنة عرشه ومداد كلماته' },
  { title: 'ذكر ودعاء', body: 'لا إله إلا أنت سبحانك إني كنت من الظالمين' },
  { title: 'استغفار', body: 'أستغفر الله الذي لا إله إلا هو الحي القيوم وأتوب إليه' },
  { title: 'دعاء العفو', body: 'اللهم إنك عفو كريم تحب العفو فاعف عنا' },
  { title: 'توكل على الله', body: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم' },
  { title: 'سيد الاستغفار', body: 'اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك وأنا على عهدك ووعدك ما استطعت' },
  { title: 'كلمتان خفيفتان', body: 'سبحان الله وبحمده، سبحان الله العظيم' },
];

serve(async (req) => {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
      throw new Error('VAPID keys are not set in environment variables.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: subscriptions, error: dbError } = await supabaseAdmin
      .from('push_subscriptions')
      .select('id, subscription_data');

    if (dbError) throw dbError;
    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No subscriptions to notify.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const randomMessage = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];

    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          sub.subscription_data,
          JSON.stringify(randomMessage)
        );
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log(`Subscription ${sub.id} is expired. Deleting.`);
          await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
        } else {
          console.error(`Failed to send notification to ${sub.id}:`, err);
        }
      }
    });

    await Promise.all(sendPromises);

    return new Response(JSON.stringify({ message: `Sent notifications to ${subscriptions.length} subscribers.` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in daily-notification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
