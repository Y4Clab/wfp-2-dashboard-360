import { FilterX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MissionStatus, MissionPriority, MissionType } from "@/types/mission";

interface MissionFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: MissionStatus;
  setStatusFilter: (value: MissionStatus) => void;
  typeFilter: MissionType;
  setTypeFilter: (value: MissionType) => void;
  priorityFilter: MissionPriority;
  setPriorityFilter: (value: MissionPriority) => void;
}

const MissionFilters = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  priorityFilter,
  setPriorityFilter
}: MissionFiltersProps) => {
  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search missions..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as MissionStatus)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as MissionType)}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="specialized">Specialized</SelectItem>
          </SelectContent>
        </Select>

        {(statusFilter !== "all" || typeFilter !== "all" || searchQuery) && (
          <Button variant="outline" size="icon" onClick={clearFilters}>
            <FilterX className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MissionFilters; 