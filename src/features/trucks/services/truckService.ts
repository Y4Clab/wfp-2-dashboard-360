import axios from "axios";

// Define API URLs
const API_BASE_URL = import.meta.env.VITE_APP_API_URL ;
const TRUCKS_URL = `${API_BASE_URL}/api/vendor/trucks/`;
const TRUCK_MISSIONS_URL = `${API_BASE_URL}/api/vendor/truck-missions/`;

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
  id: number;
  vendor: {
    id: number;
    unique_id: string;
    name: string;
    reg_no: string;
    vendor_type: string;
    fleet_size: number;
    description: string;
    status: string;
  };
  plate_number: string;
  unique_id: string;
  vehicle_name: string;
  status: string;
}

// Fetch all trucks
export const fetchTrucks = async (): Promise<Truck[]> => {
  const response = await axios.get<Truck[]>(TRUCKS_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// Add a new truck
export const addTruck = async (truckData: {
  plate_number: string;
  year: number;
  model: string;
  vehicle_name: string;
  status: string;
}): Promise<Truck> => {
  const response = await axios.post<Truck>(TRUCKS_URL, truckData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      'Content-Type': 'application/json',
    }
  });
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