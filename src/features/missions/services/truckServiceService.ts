import axios from "axios";

// Define API URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.100.4:8000/api";
const TRUCK_SERVICES_URL = `${API_BASE_URL}/truck-services/`;

// Define service record types
export interface ServiceRecord {
  id: string;
  truck_id: string;
  truck_name: string;
  service_type: string;
  date: string;
  status: string;
  cost: number;
  description: string;
  next_service_date: string;
  technician: string;
}

// Fetch all service records
export const fetchServiceRecords = async (): Promise<ServiceRecord[]> => {
  const response = await axios.get<ServiceRecord[]>(TRUCK_SERVICES_URL);
  return response.data;
};

// Add a new service record
export const addServiceRecord = async (serviceData: {
  truck_id: string;
  service_type: string;
  date: string;
  description: string;
  cost: number;
  technician: string;
  next_service_date: string;
}): Promise<ServiceRecord> => {
  const response = await axios.post<ServiceRecord>(TRUCK_SERVICES_URL, serviceData);
  return response.data;
};

// Update service record status
export const updateServiceStatus = async (serviceId: string, status: string): Promise<ServiceRecord> => {
  const response = await axios.patch<ServiceRecord>(`${TRUCK_SERVICES_URL}${serviceId}/`, { status });
  return response.data;
};

// Get service records by truck
export const getServiceRecordsByTruck = async (truckId: string): Promise<ServiceRecord[]> => {
  const response = await axios.get<ServiceRecord[]>(`${TRUCK_SERVICES_URL}?truck_id=${truckId}`);
  return response.data;
}; 