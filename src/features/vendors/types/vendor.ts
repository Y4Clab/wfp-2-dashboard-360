export type VendorType = 'food_supplier' | 'medical_supplier' | 'construction_supplier';
export type VendorStatus = 'pending' | 'approved' | 'rejected';

export interface Vendor {
  id: number;
  unique_id: string;
  name: string;
  reg_no: string;
  vendor_type: VendorType;
  fleet_size: number;
  description: string;
  status: VendorStatus;
}

export type CreateVendorDTO = Omit<Vendor, 'id' | 'unique_id'>;
export type UpdateVendorDTO = Partial<CreateVendorDTO>;
