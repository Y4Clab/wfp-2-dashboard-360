import axios from 'axios';
import { Vendor, CreateVendorDTO, UpdateVendorDTO } from '../types/vendor';

const API_URL = import.meta.env.VITE_API_URL||"http://192.168.0.13:8000/api";
const VENDOR_API_URL = `${API_URL}/vendors/`;

export const vendorService = {
  // Get all vendors
  getVendors: async (): Promise<Vendor[]> => {
    const response = await axios.get<Vendor[]>(VENDOR_API_URL);
    return response.data;
  },

  // Get vendor by ID
  getVendorById: async (id: string): Promise<Vendor> => {
    const response = await axios.get<Vendor>(`${VENDOR_API_URL}/${id}`);
    return response.data;
  },

  // Create new vendor
  createVendor: async (data: CreateVendorDTO): Promise<Vendor> => {
    const response = await axios.post<Vendor>(VENDOR_API_URL, data);
    return response.data;
  },

  // Update vendor
  updateVendor: async (id: string, data: UpdateVendorDTO): Promise<Vendor> => {
    const response = await axios.patch<Vendor>(`${VENDOR_API_URL}/${id}`, data);
    return response.data;
  },

  // Delete vendor
  deleteVendor: async (id: string): Promise<void> => {
    await axios.delete(`${VENDOR_API_URL}/${id}`);
  },
};
