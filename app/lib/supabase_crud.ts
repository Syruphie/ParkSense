import { supabase } from "./supabase";

export interface UserDetails {
  uuid?: string;
  FirstName: string;
  LastName: string;
  Email: string;
  password?: string; // optional when updating
}

const tableName = "user_details";

// CREATE a new user
export const createUser = async (user: UserDetails) => {
  const { data, error } = await supabase
    .from(tableName)
    .insert([user])
    .select();
  if (error) throw error;
  return data;
};

// READ all users
export const getUsers = async () => {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("FirstName", { ascending: true });
  if (error) throw error;
  return data;
};

// UPDATE user by UUID
export const updateUser = async (
  uuid: string,
  updates: Partial<UserDetails>
) => {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq("uuid", uuid)
    .select();
  if (error) throw error;
  return data;
};

// DELETE user by UUID
export const deleteUser = async (uuid: string) => {
  const { error } = await supabase.from(tableName).delete().eq("uuid", uuid);
  if (error) throw error;
  return true;
};
