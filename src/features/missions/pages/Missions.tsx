import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

//Import types
import { Mission, MissionStatus, MissionPriority, MissionType } from "@/features/missions/types/mission.types";

// Import components
import MissionTable from "@/components/missions/MissionTable";
import MissionFilters from "@/components/missions/MissionFilters";
import MissionStatistics from "@/components/missions/MissionStatistics";
import RecentMissions from "@/components/missions/RecentMissions";

// Define API URL
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const MISSIONS_URL = `${API_BASE_URL}/api/missions/`;

interface MissionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: MissionStatus | "all";
  setStatusFilter: (status: MissionStatus | "all") => void;
  typeFilter: MissionType | "all";
  setTypeFilter: (type: MissionType | "all") => void;
  priorityFilter: MissionPriority | "all";
  setPriorityFilter: (priority: MissionPriority | "all") => void;
}

const Missions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MissionStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<MissionPriority | "all">("all");
  const [typeFilter, setTypeFilter] = useState<MissionType | 'all'>('all');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch missions from the backend
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetch
        const response = await axios.get(MISSIONS_URL);
        console.log("Missions from backend:", response.data);
        
        // Check if the response is an array
        if (Array.isArray(response.data)) {
          setMissions(response.data);
        } else if (response.data && Array.isArray(response.data.results)) {
          // Some APIs wrap results in a data object
          setMissions(response.data.results);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Received invalid data format from server");
        }
      } catch (err) {
        console.error("Error fetching missions:", err);
        setError("Failed to load missions. Please try again later.");
        toast({
          title: "Error fetching missions",
          description: "Could not load missions from the server.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();

    
  }, [toast]);
  
  
  

  // Filter missions based on search query and filters
  const filteredMissions = missions.filter((mission) => {
    const matchesSearch = 
      (mission.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (mission.unique_id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (mission.dept_location?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (mission.destination_location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || mission.status === statusFilter;
    // For now, we don't have priority in the backend, so skip this filter
    const matchesPriority = true; // priorityFilter === "all"
    const matchesType = typeFilter === "all" || mission.type === typeFilter;
    
    // Return the combined filter result
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mission Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, assign, and track food distribution missions
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => navigate('/dashboard/missions/new')}>
          <Plus size={16} />
          <span>Create Mission</span>
        </Button>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Mission Overview</CardTitle>
            <CardDescription>
              Track and manage all food distribution missions across regions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MissionFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
            />
            <MissionTable 
              missions={filteredMissions} 
              loading={loading} 
              error={error} 
            />
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <MissionStatistics 
            missions={missions} 
            loading={loading} 
          />
        </motion.div>

        <motion.div variants={item}>
          <RecentMissions 
            missions={missions} 
            loading={loading} 
            error={error} 
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Missions;
