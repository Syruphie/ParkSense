import { supabase } from "@/lib/supabase";

export async function getCurrentUserNames() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;
  if (!userId) {
    return { first_name: "Guest", last_name: "" };
  }

  const { data, error } = await supabase
    .from("user_details")
    .select("first_name, last_name")
    .eq("uuid", userId) // ✅ use correct column name
    .single();

  if (error || !data) {
    console.warn("User details not found, defaulting to Guest");
    return { first_name: "Guest", last_name: "" };
  }

  return {
    first_name: data.first_name || "Guest",
    last_name: data.last_name || "",
  };
}
