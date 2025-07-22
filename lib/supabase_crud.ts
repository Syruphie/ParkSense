import { supabase } from "./supabase";

export interface UserDetails {
  uuid?: string;
  FirstName: string;
  LastName: string;
  Email: string;
  password?: string;
}

const tableName = "user_details";

export const createUser = async (user: UserDetails) => {
  const { data, error } = await supabase
    .from(tableName)
    .insert([user])
    .select();
  if (error) throw error;
  return data;
};

export const getUsers = async () => {
  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .order("FirstName", { ascending: true });
  if (error) throw error;
  return data;
};

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

export const deleteUser = async (uuid: string) => {
  const { error } = await supabase.from(tableName).delete().eq("uuid", uuid);
  if (error) throw error;
  return true;
};