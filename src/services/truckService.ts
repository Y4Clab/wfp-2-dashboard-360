import axios from "axios";

// Define API URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.100.4:8000/api";
const TRUCKS_URL = `${API_BASE_URL}/trucks/`;
const TRUCK_MISSIONS_URL = `${API_BASE_URL}/truck-missions/`;

// Define truck types
export interface Truck {
  id: string;
  vehicle_name: string;
  vendor: string | null;
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
  vendor: string | null;
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

// Assign truck to mission
export const assignTruckToMission = async (truckId: string, missionId: string): Promise<void> => {
  await axios.post(TRUCK_MISSIONS_URL, {
    truck: truckId,
    mission: missionId
  });
};

// Get trucks by vendor
export const getTrucksByVendor = async (vendorId: string): Promise<Truck[]> => {
  const response = await axios.get<Truck[]>(`${TRUCKS_URL}?vendor=${vendorId}`);
  return response.data;
}; 