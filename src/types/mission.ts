export interface Mission {
  id: number;
  unique_id: string;
  title: string | null;
  type: string | null;
  number_of_beneficiaries: number | null;
  description: string | null;
  dept_location: string | null;
  destination_location: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
}

export type MissionStatus = "all" | "pending" | "active" | "completed";
export type MissionPriority = "all" | "low" | "medium" | "high" | "critical";
export type MissionType = "all" | "food" | "medical" | "shelter" | "water" | "education" | "regular" | "emergency" | "specialized"; 