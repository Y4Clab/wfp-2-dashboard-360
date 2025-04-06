import axios from "axios";

// Define API URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.100.4:8000/api";
const TRUCKS_URL = `${API_BASE_URL}/trucks/`;
const TRUCK_MISSIONS_URL = `${API_BASE_URL}/truck-missions/`;

// Define cargo item interface
export interface CargoItem {
  name: string;
  quantity: number;
  unit: string;
}

// Define truck mission assignment interface
export interface TruckMissionAssignment {
  mission: number;
  truck: number;
  cargo_items: CargoItem[];
}

// Define truck types
export interface Truck {
  id: string;
  vehicle_name: string;
  plate_number: string;
  vendor: string | null;
  capacity_tons: number;
  model?: string;
  year?: number;
  registration_document?: string;
  insurance_document?: string;
  status: string;
  location?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  fuel_level?: number;
  mileage?: number;
  assigned_mission?: string | null;
  mission_name?: string | null;
  alerts?: string[];
}

// Fetch all trucks
export const fetchTrucks = async (): Promise<Truck[]> => {
  const response = await axios.get<Truck[]>(TRUCKS_URL);
  return response.data;
};

// Add a new truck
export const addTruck = async (truckData: {
  vehicle_name: string;
  plate_number: string;
  vendor: string | null;
  capacity_tons: number;
  model?: string;
  year?: number;
  registration_document?: string;
  insurance_document?: string;
  status: string;
}): Promise<Truck> => {
  const response = await axios.post<Truck>(TRUCKS_URL, truckData);
  return response.data;
};

// Update truck status
export const updateTruckStatus = async (truckId: string, status: string): Promise<Truck> => {
  const response = await axios.patch<Truck>(`${TRUCKS_URL}${truckId}/`, { status });
  return response.data;
};

// Assign truck to mission with cargo items
export const assignTruckToMission = async (assignmentData: TruckMissionAssignment): Promise<void> => {
  console.log("Assigning truck to mission with data:", assignmentData);
  const response = await axios.post(TRUCK_MISSIONS_URL, assignmentData);
  return response.data;
};

// Get trucks by vendor
export const getTrucksByVendor = async (vendorId: string): Promise<Truck[]> => {
  const response = await axios.get<Truck[]>(`${TRUCKS_URL}?vendor=${vendorId}`);
  return response.data;
}; 