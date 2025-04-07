export interface Contact {
  id: number;
  unique_id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
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

export interface Product {
  id: number;
  unique_id: string;
  name: string;
  quantity: number;
}

export interface Cargo {
  id: number;
  mission: string;
  unique_id: string;
  total_products_quantity: number;
}

export interface CargoItem {
  id: number;
  cargo: Cargo;
  product: Product;
  remaining_quantity: number;
  unique_id: string;
  quantity: number;
}

export interface CapacityData {
  total_capacity: number;
  items_assigned: number;
  remaining_capacity: number;
  utilization_percentage: number;
}

export interface AssignedCargo {
  cargo_item: CargoItem;
  quantity: number;
}

export interface Truck {
  id: number;
  unique_id: string;
  plate_number: string;
  vehicle_name: string;
  year: number;
  model: string;
  capacity: number;
  status: string;
  vendor: Vendor;
}

export interface AssignedTruck {
  assignment_id: string;
  truck: Truck;
  assigned_cargo: AssignedCargo[];
  capacity_data: CapacityData;
}

export interface VendorAssignment {
  assignment_id: string;
  vendor: Vendor;
  contacts: Contact[];
}

export interface Mission {
  unique_id: string;
  id: number;
  title: string;
  type: string;
  number_of_beneficiaries: number;
  description: string;
  dept_location: string;
  destination_location: string;
  start_date: string;
  end_date: string;
  status: string;
  cargo_items: CargoItem[];
  assigned_trucks: AssignedTruck[];
  assigned_vendors: VendorAssignment[];
}

// Enums for status and type values
export enum MissionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DELAYED = 'delayed'
}

export enum MissionType {
  REGULAR = 'regular',
  FOOD = 'food',
  MEDICAL = 'medical',
  EMERGENCY = 'emergency',
  SPECIALIZED = 'specialized'
}

export enum VendorType {
  FOOD_SUPPLIER = 'food_supplier',
  TRANSPORT = 'transport',
  MEDICAL_SUPPLIER = 'medical_supplier'
}

export enum VendorStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export enum TruckStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}

//Mission Filters// 'all'
export interface MissionFilters {
  status?: string;
  type?: string;
  vendor_type?: string;
}

 //Priority
export enum MissionPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}
