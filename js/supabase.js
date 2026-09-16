// Supabase project URL
const SUPABASE_URL = "https://bzgurysojpxwtetifcqp.supabase.co";

// Supabase publishable key
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_2XqxqUnx5MP4yLFpxa9waA_yjABsVvV";

// Create the Supabase client
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);