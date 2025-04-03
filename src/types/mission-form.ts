import * as z from "zod";

// Define separate schemas for mission and cargo
export const missionDetailsSchema = z.object({
  missionTitle: z.string().min(5, {
    message: "Mission title must be at least 5 characters.",
  }),
  missionType: z.enum(["emergency", "regular", "specialized"], {
    required_error: "Please select a mission type.",
  }),
  vendorId: z.string().min(1, {
    message: "Please select a vendor.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  departureLocation: z.string().min(3, {
    message: "Departure location is required.",
  }),
  destinationLocation: z.string().min(3, {
    message: "Destination location is required.",
  }),
  beneficiaries: z.coerce.number().min(1, {
    message: "Number of beneficiaries must be at least 1.",
  }),
  description: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must confirm the mission details.",
  }),
});

export const foodItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1 kg.",
  }),
});

export const cargoSchema = z.object({
  foodItems: z.array(foodItemSchema).min(1, {
    message: "Please select at least one food type with quantity.",
  }),
  totalWeight: z.coerce.number().min(1, {
    message: "Total weight must be at least 1 kg.",
  }),
});

// Combined schema for the entire form
export const missionFormSchema = missionDetailsSchema.merge(cargoSchema).merge(
  z.object({
    // These are no longer used but kept for compatibility
    truckIds: z.array(z.string()).optional(),
    driverId: z.string().optional(),
  })
);

export type MissionFormValues = z.infer<typeof missionFormSchema>;
export type MissionDetailsValues = z.infer<typeof missionDetailsSchema>;
export type CargoValues = z.infer<typeof cargoSchema>;
export type FoodItem = z.infer<typeof foodItemSchema>;

// API types
export interface Product {
  id: number;
  unique_id: string;
  name: string;
  quantity: number;
}

export interface Vendor {
  id: number;
  unique_id: string;
  name: string;
  reg_no: string;
  vendor_type: string;
  fleet_size: number;
  description: string;
  status: string;
} 