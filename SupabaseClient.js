import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uvlyxwknrtgayncklxjc.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bHl4d2tucnRnYXluY2tseGpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzMwMTk0NSwiZXhwIjoyMDQ4ODc3OTQ1fQ.xzkC5DzF8_zDgfXpPZKmOis_Xfsfcfd2BdJpKy19Df4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);