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
export const extractHourlyRate = (lot: CalgaryParkingLot | any): number => {
  // Try html_zone_rate first
  if (lot?.html_zone_rate) {
    const matches = lot.html_zone_rate.match(/\$([\d.]+)/g);
    if (matches) {
      const rates = matches.map((r: string) => parseFloat(r.replace("$", "")));
      if (rates.length) return rates[0];
    }
  }
  
  // Try rate_amount
  if (lot?.rate_amount) {
    const amount = parseFloat(lot.rate_amount.toString());
    if (!isNaN(amount)) return amount;
  }
  
  // Default rate
  return 7.0;
};