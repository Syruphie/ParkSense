import { User } from "@/lib/object_types";
import { supabase } from "./supabase";

const table_name = "user_details";

export async function getAllUsers() {
  const { data, error } = await supabase
    .from(table_name)
    .select("*")
    .order("email", { ascending: true });

  if (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
  return data;
}

export const addUser = async (user: User) => {
  const { error } = await supabase.from("user_details").insert([
    {
      uuid: user.uuid,
      email: user.email,
      first_name: user.first_name, // Map camelCase → PascalCase
      last_name: user.last_name,
    },
  ]);

  if (error) throw error;
};

export async function updateUser(user_id: string, user: User) {
  const { data, error } = await supabase
    .from(table_name)
    .update(user)
    .eq("uuid", user_id); // ✅ use 'uuid' instead of 'id'

  if (error) {
    console.error(`Error updating user with ID ${user_id}: `, error);
    throw error;
  }
  return data;
}

export async function deleteUser(user_id: string) {
  const { data, error } = await supabase
    .from(table_name)
    .delete()
    .eq("uuid", user_id); // ✅ use 'uuid' instead of 'id'

  if (error) {
    console.error(`Error deleting user with ID ${user_id}: `, error);
    throw error;
  }
  return data;
}
