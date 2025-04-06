import { z } from "zod";

export const truckFormSchema = z.object({
  vehicle_name: z.string().min(1, "Vehicle name is required"),
  plate_number: z.string().min(1, "Plate number is required"),
  vendor: z.string().nullable(),
  capacity_tons: z.number().min(0.1, "Capacity must be greater than 0"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  registration_document: z.string().optional(),
  insurance_document: z.string().optional(),
  status: z.enum(["active", "maintenance", "inactive"]).default("active"),
});

export type TruckFormValues = z.infer<typeof truckFormSchema>;

export type Truck = {
  id: number;
  vehicle_name: string;
  plate_number: string;
  vendor: string | null;
  capacity_tons: number;
  model: string;
  year: string;
  registration_document?: string;
  insurance_document?: string;
  status: "active" | "maintenance" | "inactive";
  created_at: string;
  updated_at: string;
}; 