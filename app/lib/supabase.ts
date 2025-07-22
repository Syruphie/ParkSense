import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gekgxoylukqidijpsbdc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdla2d4b3lsdWtxaWRpanBzYmRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTg5NTIsImV4cCI6MjA2ODE3NDk1Mn0.ac7GJcVNnRpNDjW_PzCNMI_viVrfm-NXdIaXk9RgAzs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
