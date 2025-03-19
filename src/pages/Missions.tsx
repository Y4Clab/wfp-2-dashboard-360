
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertCircle, 
  Calendar, 
  Check, 
  ChevronRight, 
  Clock, 
  FilterX, 
  Plus, 
  Search, 
  Truck 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for missions
const MISSIONS_DATA = [
  {
    id: "M-7892",
    name: "Food Distribution - Nairobi",
    type: "Food",
    status: "active",
    priority: "high",
    assignedTo: "Global Food Solutions",
    location: "Nairobi, Kenya",
    date: "2023-06-15",
    deadline: "2023-06-20",
    progress: 65,
  },
  {
    id: "M-7891",
    name: "Medical Supplies - Kampala",
    type: "Medical",
    status: "active",
    priority: "medium",
    assignedTo: "MedTech Logistics",
    location: "Kampala, Uganda",
    date: "2023-06-12",
    deadline: "2023-06-18",
    progress: 42,
  },
  {
    id: "M-7890",
    name: "Shelter Materials - Mogadishu",
    type: "Shelter",
    status: "completed",
    priority: "high",
    assignedTo: "BuildEx Construction",
    location: "Mogadishu, Somalia",
    date: "2023-06-05",
    deadline: "2023-06-12",
    progress: 100,
  },
  {
    id: "M-7889",
    name: "Water Purification - Addis Ababa",
    type: "Water",
    status: "completed",
    priority: "medium",
    assignedTo: "Pure Water Inc.",
    location: "Addis Ababa, Ethiopia",
    date: "2023-06-01",
    deadline: "2023-06-08",
    progress: 100,
  },
  {
    id: "M-7888",
    name: "Nutrition Supplies - Juba",
    type: "Food",
    status: "planned",
    priority: "high",
    assignedTo: "NutriTech Solutions",
    location: "Juba, South Sudan",
    date: "2023-06-20",
    deadline: "2023-06-27",
    progress: 0,
  },
  {
    id: "M-7887",
    name: "Emergency Food Aid - Khartoum",
    type: "Food",
    status: "planned",
    priority: "critical",
    assignedTo: "Rapid Relief Partners",
    location: "Khartoum, Sudan",
    date: "2023-06-22",
    deadline: "2023-06-25",
    progress: 0,
  },
  {
    id: "M-7886",
    name: "Medicine Delivery - Dar es Salaam",
    type: "Medical",
    status: "active",
    priority: "medium",
    assignedTo: "HealthFirst Logistics",
    location: "Dar es Salaam, Tanzania",
    date: "2023-06-10",
    deadline: "2023-06-17",
    progress: 78,
  },
  {
    id: "M-7885",
    name: "School Supplies - Asmara",
    type: "Education",
    status: "active",
    priority: "low",
    assignedTo: "EduSupply International",
    location: "Asmara, Eritrea",
    date: "2023-06-08",
    deadline: "2023-06-20",
    progress: 55,
  },
];

type MissionStatus = "all" | "active" | "completed" | "planned";
type MissionPriority = "all" | "low" | "medium" | "high" | "critical";
type MissionType = "all" | "Food" | "Medical" | "Shelter" | "Water" | "Education";

const Missions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MissionStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<MissionPriority>("all");
  const [typeFilter, setTypeFilter] = useState<MissionType>("all");

  // Filter missions based on search query and filters
  const filteredMissions = MISSIONS_DATA.filter((mission) => {
    const matchesSearch = 
      mission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || mission.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || mission.priority === priorityFilter;
    const matchesType = typeFilter === "all" || mission.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "planned": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
        <Button className="flex items-center gap-2">
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
                    <SelectItem value="planned">Planned</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as MissionPriority)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as MissionType)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Shelter">Shelter</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>

                {(statusFilter !== "all" || priorityFilter !== "all" || typeFilter !== "all" || searchQuery) && (
                  <Button variant="outline" size="icon" onClick={() => {
                    setStatusFilter("all");
                    setPriorityFilter("all");
                    setTypeFilter("all");
                    setSearchQuery("");
                  }}>
                    <FilterX className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Mission</TableHead>
                    <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden lg:table-cell">Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Priority</TableHead>
                    <TableHead className="hidden lg:table-cell">Progress</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMissions.length > 0 ? (
                    filteredMissions.map((mission) => (
                      <TableRow key={mission.id}>
                        <TableCell className="font-medium">{mission.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{mission.name}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">{mission.type}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{mission.assignedTo}</TableCell>
                        <TableCell className="hidden md:table-cell">{mission.location}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{new Date(mission.deadline).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(mission.status)}>
                            {mission.status === "active" ? (
                              <Clock className="h-3 w-3 mr-1" />
                            ) : mission.status === "completed" ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <Calendar className="h-3 w-3 mr-1" />
                            )}
                            {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={getPriorityColor(mission.priority)}>
                            {mission.priority === "critical" ? (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            ) : null}
                            {mission.priority.charAt(0).toUpperCase() + mission.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {mission.status !== "planned" && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  mission.status === "completed" 
                                    ? "bg-green-600" 
                                    : "bg-blue-600"
                                }`}
                                style={{ width: `${mission.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No missions found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Mission Statistics</CardTitle>
              <CardDescription>Overview of mission status and distribution</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-medium mb-2">Status Distribution</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Active Missions</span>
                        <span className="text-sm font-medium">4</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "50%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Completed Missions</span>
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Planned Missions</span>
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Mission Types</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Food</span>
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "37.5%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Medical</span>
                        <span className="text-sm font-medium">2</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-pink-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Shelter</span>
                        <span className="text-sm font-medium">1</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "12.5%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Water</span>
                        <span className="text-sm font-medium">1</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-cyan-600 h-2 rounded-full" style={{ width: "12.5%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Education</span>
                        <span className="text-sm font-medium">1</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-teal-600 h-2 rounded-full" style={{ width: "12.5%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Latest mission activities and status changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    id: "M-7892", 
                    name: "Food Distribution - Nairobi", 
                    update: "Checkpoint reached - 15km from destination",
                    time: "10 minutes ago",
                    status: "active"
                  },
                  { 
                    id: "M-7886", 
                    name: "Medicine Delivery - Dar es Salaam", 
                    update: "Truck maintenance completed, resuming journey",
                    time: "30 minutes ago",
                    status: "active"
                  },
                  { 
                    id: "M-7891", 
                    name: "Medical Supplies - Kampala", 
                    update: "Delivery delayed due to road conditions",
                    time: "1 hour ago",
                    status: "active"
                  },
                  { 
                    id: "M-7890", 
                    name: "Shelter Materials - Mogadishu", 
                    update: "Mission successfully completed",
                    time: "3 hours ago",
                    status: "completed"
                  },
                  { 
                    id: "M-7888", 
                    name: "Nutrition Supplies - Juba", 
                    update: "Mission scheduled for next week",
                    time: "5 hours ago",
                    status: "planned"
                  },
                ].map((update, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                      ${update.status === 'active' ? 'bg-blue-100 text-blue-600' : 
                      update.status === 'completed' ? 'bg-green-100 text-green-600' : 
                      'bg-amber-100 text-amber-600'}`}>
                      {update.status === 'active' ? (
                        <Truck className="h-5 w-5" />
                      ) : update.status === 'completed' ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Calendar className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {update.id}: {update.name}
                        </p>
                        <span className="text-xs text-muted-foreground">{update.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {update.update}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Missions;
