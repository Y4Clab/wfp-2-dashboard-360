export interface Mission {
  id: number;
  mission_id: string;
  unique_id?: string;
  title: string;
  type: string;
  number_of_beneficiaries: number;
  description: string;
  dept_location: string;
  destination_location: string;
  start_date: string;
  end_date: string;
  status: string;
}

export type MissionStatus = 'active' | 'completed' | 'pending' | 'all';
export type MissionPriority = 'low' | 'medium' | 'high' | 'critical' | 'all';
export type MissionType = 'food' | 'medical' | 'shelter' | 'water' | 'education' | 'regular' | 'emergency' | 'specialized' | 'all';

export interface MissionFilters {
  status?: MissionStatus;
  priority?: MissionPriority;
  type?: MissionType;
} 