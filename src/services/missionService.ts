import axios from "axios";
import { MissionDetailsValues, CargoValues, Product, Vendor } from "@/types/mission-form";

// Define API URLs
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.100.4:8000/api";
const MISSIONS_URL = `${API_BASE_URL}/missions/`;
const VENDOR_MISSIONS_URL = `${API_BASE_URL}/vendor-missions/`;
const CARGO_URL = `${API_BASE_URL}/cargo/`;
const CARGO_ITEMS_URL = `${API_BASE_URL}/cargo-items/`;
const PRODUCTS_URL = `${API_BASE_URL}/products/`;
const VENDORS_URL = `${API_BASE_URL}/vendors/`;

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get<Product[]>(PRODUCTS_URL);
  return response.data;
};

export const fetchVendors = async (): Promise<Vendor[]> => {
  const response = await axios.get<Vendor[]>(VENDORS_URL);
  return response.data;
};

export const createMission = async (data: MissionDetailsValues): Promise<{id: string, data: Record<string, unknown>}> => {
  const missionData = {
    title: data.missionTitle,
    type: data.missionType,
    number_of_beneficiaries: data.beneficiaries,
    description: data.description || "",
    dept_location: data.departureLocation,
    destination_location: data.destinationLocation,
    start_date: data.startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    end_date: data.endDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    status: "pending"
  };
  
  console.log("Creating mission with data:", missionData);
  const response = await axios.post(MISSIONS_URL, missionData);
  console.log("Mission created:", response.data);
  
  return {
    id: response.data.id,
    data: response.data
  };
};

export const assignVendorToMission = async (vendorId: string, missionId: string, vendors: Vendor[]): Promise<void> => {
  // Looking at the error, the backend expects numeric IDs, not string UUIDs
  // Find the vendor in our vendors list to get its numeric ID
  const selectedVendor = vendors.find(v => v.unique_id === vendorId);
  
  if (selectedVendor) {
    console.log("Assigning vendor:", vendorId, "to mission:", missionId);
    const response = await axios.post(VENDOR_MISSIONS_URL, {
      vendor: selectedVendor.id, // Use the numeric id instead of the UUID
      mission: missionId
    });
    return response.data;
  } else {
    console.error("Could not find vendor with UUID:", vendorId);
    throw new Error("Could not find vendor with the provided UUID");
  }
};

export const createCargo = async (missionId: string, totalWeight: number): Promise<string> => {
  const cargoData = {
    mission: missionId,
    total_products_quantity: totalWeight
  };
  
  console.log("Creating cargo with data:", cargoData);
  const response = await axios.post(CARGO_URL, cargoData);
  console.log("Cargo created:", response.data);
  
  return response.data.id;
};

export const addCargoItem = async (
  cargoId: string, 
  productId: string, 
  quantity: number, 
  products: Product[]
): Promise<void> => {
  // Find the product to get its numeric ID
  const product = products.find(p => p.unique_id === productId);
  
  if (product) {
    const cargoItemData = {
      cargo: cargoId,
      product: product.id, // Use numeric ID
      quantity: quantity
    };
    
    console.log("Adding cargo item:", cargoItemData);
    const response = await axios.post(CARGO_ITEMS_URL, cargoItemData);
    return response.data;
  } else {
    console.error("Could not find product with UUID:", productId);
    throw new Error("Could not find product with the provided UUID");
  }
};

export const addCargoToMission = async (
  missionId: string, 
  data: CargoValues, 
  products: Product[]
): Promise<void> => {
  // Step 1: Create cargo for the mission
  const cargoId = await createCargo(missionId, data.totalWeight);
  
  // Step 2: Add cargo items one by one
  for (const item of data.foodItems) {
    await addCargoItem(cargoId, item.id, item.quantity, products);
  }
  
  return;
}; 