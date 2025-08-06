// lib/booking_crud.ts
import { supabase } from "@/lib/supabase";

const table = "bookings";

// lib/booking_crud.ts
export type Booking = {
  booking_id?: string;
  user_id: string;
  first_name: string;
  last_name: string;
  license: string;
  address: string;
  zone: string;
  spot: string;
  time_start: string;
  time_end: string;
  duration: number;
  total: number;
  booking_date: string;
  created_at?: string;
  latitude?: number;
  longitude?: number;
};

export async function addBooking(booking: Booking) {
  const { data, error } = await supabase.from(table).insert([booking]);

  if (error) {
    console.error("Error adding booking:", error.message);
    throw error;
  }

  return data;
}

export async function updateBookingCoordinates(
  booking_id: string,
  latitude: number,
  longitude: number
) {
  const { data, error } = await supabase
    .from(table)
    .update({ latitude, longitude })
    .eq("booking_id", booking_id);

  if (error) {
    console.error("❌ Error updating coordinates:", error.message);
    throw error;
  }

  console.log("✅ Coordinates updated:", data);
  return data;
}

export async function getBookingsByUser(user_id: string) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", user_id)
    .order("time_start", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error.message);
    throw error;
  }

  return data as Booking[];
}

export async function getAllBookings() {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("time_start", { ascending: false });

  if (error) {
    console.error("Error fetching all bookings:", error.message);
    throw error;
  }

  return data as Booking[];
}

export async function deleteBooking(booking_id: string) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("booking_id", booking_id);

  if (error) {
    console.error("Error deleting booking:", error.message);
    throw error;
  }

  return data;
}
