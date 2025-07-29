// app/types/calgary-parking.ts
// Interface definitions for Calgary parking API data

export interface CalgaryParkingLot {
  // Basic location info
  address_desc?: string;
  address_number?: string;
  street_name?: string;
  street_type?: string;
  street_direction?: string;
  
  // Zone and parking info
  permit_zone?: string;
  zone_type?: string;
  price_zone?: string;
  parking_type?: string;
  
  // Rate and pricing
  html_zone_rate?: string;
  rate_amount?: string | number;
  rate_period_desc?: string;
  max_time?: string;
  max_stay_desc?: string;
  
  // Identifiers
  globalid_guid?: string;
  stall_id?: string;
  objectid?: string;
  
  // Geometry data from Calgary API
  the_geom?: {
    coordinates?: number[][][];
  };
  
  // Google Places data (when merged)
  editorial_summary?: {
    overview?: string;
  };
  
  // Allow additional fields that might come from the API
  [key: string]: any;
}

export interface BookingParams {
  address_desc?: string;
  license_plate?: string;
  html_zone_rate?: string;
  rate_amount?: string;
  rate_period_desc?: string;
  max_time?: string;
  max_stay_desc?: string;
  permit_zone?: string;
  zone_type?: string;
  price_zone?: string;
  globalid_guid?: string;
  stall_id?: string;
  address_number?: string;
  street_name?: string;
  street_type?: string;
  street_direction?: string;
  latitude?: string;
  longitude?: string;
}

export interface TimerParams {
  zone?: string;
  spot?: string;
  time_start?: string;
  time_end?: string;
  total?: string;
  license?: string;
  permit_zone?: string;
  zone_type?: string;
  price_zone?: string;
  booking_id?: string;
}

// Helper function to safely extract booking params from lot data
export const createBookingParams = (
  lot: CalgaryParkingLot | any,
  lat?: number,
  lng?: number
): BookingParams => {
  return {
    address_desc: lot?.address_desc || "Unknown Location",
    license_plate: "CST309",
    html_zone_rate: lot?.html_zone_rate || "",
    rate_amount: lot?.rate_amount?.toString() || "",
    rate_period_desc: lot?.rate_period_desc || "",
    max_time: lot?.max_time || "",
    max_stay_desc: lot?.max_stay_desc || "",
    permit_zone: lot?.permit_zone || "",
    zone_type: lot?.zone_type || "",
    price_zone: lot?.price_zone || "",
    globalid_guid: lot?.globalid_guid || "",
    stall_id: lot?.stall_id || "",
    address_number: lot?.address_number || "",
    street_name: lot?.street_name || "",
    street_type: lot?.street_type || "",
    street_direction: lot?.street_direction || "",
    latitude: lat?.toString() || "",
    longitude: lng?.toString() || "",
  };
};

// Helper function to get zone display name
export const getZoneDisplay = (lot: CalgaryParkingLot | any): string => {
  if (lot?.permit_zone) return `ZONE ${lot.permit_zone}`;
  if (lot?.zone_type) return lot.zone_type.toUpperCase();
  if (lot?.price_zone) return `ZONE ${lot.price_zone}`;
  return "PARKING ZONE";
};

// Helper function to generate spot number
export const generateSpotNumber = (lot: CalgaryParkingLot | any): string => {
  if (lot?.stall_id) return lot.stall_id.toString();
  
  // Generate a realistic spot number
  const spotNum = Math.floor(Math.random() * 99) + 1;
  const spotLetter = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
  return `${spotNum}${spotLetter}`;
};

// Helper function to extract hourly rate
export const extractHourlyRate = (
  lot: CalgaryParkingLot | any,
  now: Date = new Date()
): number => {
  const html = lot?.html_zone_rate?.toLowerCase() || "";

  // If free parking is mentioned at all, and no time ranges match, default to 0
  const mentionsFree = html.includes("free");

  // Match time-based blocks with price like: "Mon-Fri 9:00 AM to 11:00 AM</b><br><br>$4.25"
  const regex = /<b>(.*?)<\/b><br><br>\$?([\d.]+)?/g;
  const blocks: { label: string; price: number }[] = [];

  let match;
  while ((match = regex.exec(html)) !== null) {
    const label = match[1];
    const price = parseFloat(match[2]);

    if (!isNaN(price)) {
      blocks.push({ label, price });
    }
  }

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  for (const block of blocks) {
    const timeMatch = block.label.match(/(\d{1,2}:\d{2} (AM|PM)) to (\d{1,2}:\d{2} (AM|PM))/i);
    if (!timeMatch) continue;

    const [, startStr,, endStr] = timeMatch;

    const start = new Date(now);
    const end = new Date(now);

    start.setHours(convertTo24Hour(startStr));
    start.setMinutes(parseInt(startStr.split(":")[1]));
    end.setHours(convertTo24Hour(endStr));
    end.setMinutes(parseInt(endStr.split(":")[1]));

    if (now >= start && now <= end) {
      return block.price;
    }
  }

  // If no match but contains "Free", return 0
  return mentionsFree ? 0 : 7.0; // fallback to $7/hr if unknown
};

// Helper: convert "1:30 PM" to 13
function convertTo24Hour(timeStr: string): number {
  const [time, meridiem] = timeStr.trim().split(" ");
  let [hour, min] = time.split(":").map(Number);

  if (meridiem.toLowerCase() === "pm" && hour !== 12) hour += 12;
  if (meridiem.toLowerCase() === "am" && hour === 12) hour = 0;

  return hour;
}