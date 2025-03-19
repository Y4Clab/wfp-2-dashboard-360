
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Fuel, 
  GaugeCircle, 
  GitBranch, 
  MapPin, 
  Plus, 
  Search, 
  Settings, 
  Truck as TruckIcon, 
  Verified 
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
import { Progress } from "@/components/ui/progress";

// Mock data for trucks
const TRUCKS_DATA = [
  {
    id: "TR-1234",
    model: "Toyota Land Cruiser",
    type: "4x4 SUV",
    status: "active",
    vendor: "Global Food Solutions",
    location: "Nairobi, Kenya",
    lastMaintenance: "2023-05-15",
    nextMaintenance: "2023-07-15",
    fuelLevel: 85,
    mileage: 45678,
    assignedMission: "M-7892",
    missionName: "Food Distribution - Nairobi",
    alerts: [],
  },
  {
    id: "TR-1235",
    model: "Mercedes Sprinter",
    type: "Cargo Van",
    status: "active",
    vendor: "MedTech Logistics",
    location: "Kampala, Uganda",
    lastMaintenance: "2023-05-10",
    nextMaintenance: "2023-07-10",
    fuelLevel: 42,
    mileage: 67890,
    assignedMission: "M-7891",
    missionName: "Medical Supplies - Kampala",
    alerts: ["Low fuel"],
  },
  {
    id: "TR-1236",
    model: "Isuzu FRR",
    type: "Delivery Truck",
    status: "maintenance",
    vendor: "BuildEx Construction",
    location: "Workshop, Nairobi",
    lastMaintenance: "2023-06-12",
    nextMaintenance: "2023-08-12",
    fuelLevel: 100,
    mileage: 89012,
    assignedMission: null,
    missionName: null,
    alerts: ["Scheduled maintenance"],
  },
  {
    id: "TR-1237",
    model: "Mitsubishi Fuso",
    type: "Heavy Truck",
    status: "inactive",
    vendor: "Pure Water Inc.",
    location: "Depot, Addis Ababa",
    lastMaintenance: "2023-04-20",
    nextMaintenance: "2023-06-20",
    fuelLevel: 30,
    mileage: 123456,
    assignedMission: null,
    missionName: null,
    alerts: ["Maintenance overdue", "Tire replacement needed"],
  },
  {
    id: "TR-1238",
    model: "Toyota Hilux",
    type: "Pickup Truck",
    status: "active",
    vendor: "NutriTech Solutions",
    location: "En route to Juba",
    lastMaintenance: "2023-05-25",
    nextMaintenance: "2023-07-25",
    fuelLevel: 65,
    mileage: 34567,
    assignedMission: "M-7888",
    missionName: "Nutrition Supplies - Juba",
    alerts: [],
  },
  {
    id: "TR-1239",
    model: "Land Rover Defender",
    type: "4x4 SUV",
    status: "active",
    vendor: "Rapid Relief Partners",
    location: "En route to Khartoum",
    lastMaintenance: "2023-06-05",
    nextMaintenance: "2023-08-05",
    fuelLevel: 75,
    mileage: 56789,
    assignedMission: "M-7887",
    missionName: "Emergency Food Aid - Khartoum",
    alerts: [],
  },
  {
    id: "TR-1240",
    model: "Mercedes Actros",
    type: "Heavy Truck",
    status: "active",
    vendor: "HealthFirst Logistics",
    location: "Dar es Salaam, Tanzania",
    lastMaintenance: "2023-05-30",
    nextMaintenance: "2023-07-30",
    fuelLevel: 58,
    mileage: 78901,
    assignedMission: "M-7886",
    missionName: "Medicine Delivery - Dar es Salaam",
    alerts: [],
  },
  {
    id: "TR-1241",
    model: "Ford Transit",
    type: "Cargo Van",
    status: "active",
    vendor: "EduSupply International",
    location: "Asmara, Eritrea",
    lastMaintenance: "2023-05-20",
    nextMaintenance: "2023-07-20",
    fuelLevel: 90,
    mileage: 23456,
    assignedMission: "M-7885",
    missionName: "School Supplies - Asmara",
    alerts: [],
  },
];

type TruckStatus = "all" | "active" | "maintenance" | "inactive";
type TruckType = "all" | "4x4 SUV" | "Cargo Van" | "Delivery Truck" | "Heavy Truck" | "Pickup Truck";

const Trucks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TruckStatus>("all");
  const [typeFilter, setTypeFilter] = useState<TruckType>("all");
  const [alertFilter, setAlertFilter] = useState<"all" | "withAlerts">("all");

  // Filter trucks based on search query and filters
  const filteredTrucks = TRUCKS_DATA.filter((truck) => {
    const matchesSearch = 
      truck.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (truck.assignedMission && truck.assignedMission.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (truck.missionName && truck.missionName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || truck.status === statusFilter;
    const matchesType = typeFilter === "all" || truck.type === typeFilter;
    const matchesAlert = alertFilter === "all" || (alertFilter === "withAlerts" && truck.alerts.length > 0);
    
    return matchesSearch && matchesStatus && matchesType && matchesAlert;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-amber-100 text-amber-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTruckStats = () => {
    const total = TRUCKS_DATA.length;
    const active = TRUCKS_DATA.filter(t => t.status === "active").length;
    const maintenance = TRUCKS_DATA.filter(t => t.status === "maintenance").length;
    const inactive = TRUCKS_DATA.filter(t => t.status === "inactive").length;
    const withAlerts = TRUCKS_DATA.filter(t => t.alerts.length > 0).length;
    
    return { total, active, maintenance, inactive, withAlerts };
  };

  const stats = getTruckStats();

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
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor, maintain, and track your fleet of delivery vehicles
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Vehicle</span>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Vehicles</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Verified className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Maintenance</p>
                  <p className="text-3xl font-bold">{stats.maintenance}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Alerts</p>
                  <p className="text-3xl font-bold">{stats.withAlerts}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Fleet Overview</CardTitle>
            <CardDescription>
              Monitor and manage your entire fleet of vehicles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TruckStatus)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as TruckType)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="4x4 SUV">4x4 SUV</SelectItem>
                    <SelectItem value="Cargo Van">Cargo Van</SelectItem>
                    <SelectItem value="Delivery Truck">Delivery Truck</SelectItem>
                    <SelectItem value="Heavy Truck">Heavy Truck</SelectItem>
                    <SelectItem value="Pickup Truck">Pickup Truck</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={alertFilter} onValueChange={(value) => setAlertFilter(value as "all" | "withAlerts")}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Alerts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trucks</SelectItem>
                    <SelectItem value="withAlerts">With Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead className="hidden md:table-cell">Vendor</TableHead>
                    <TableHead className="hidden lg:table-cell">Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Mission</TableHead>
                    <TableHead className="hidden lg:table-cell">Fuel</TableHead>
                    <TableHead className="hidden xl:table-cell">Next Maintenance</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrucks.length > 0 ? (
                    filteredTrucks.map((truck) => (
                      <TableRow key={truck.id}>
                        <TableCell className="font-medium">{truck.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{truck.model}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">{truck.type}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{truck.vendor}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{truck.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <Badge className={getStatusColor(truck.status)}>
                              {truck.status === "active" ? (
                                <Verified className="h-3 w-3 mr-1" />
                              ) : truck.status === "maintenance" ? (
                                <Settings className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              )}
                              {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
                            </Badge>
                            {truck.alerts.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {truck.alerts.map((alert, index) => (
                                  <Badge key={index} variant="outline" className="text-xs px-1 py-0 bg-red-50 text-red-800 border-red-200">
                                    {alert}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {truck.assignedMission ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">{truck.assignedMission}</span>
                              <span className="text-xs text-muted-foreground truncate max-w-36">{truck.missionName}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                              <Fuel className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs font-medium">{truck.fuelLevel}%</span>
                            </div>
                            <Progress 
                              value={truck.fuelLevel} 
                              className="h-1.5" 
                              indicatorClassName={
                                truck.fuelLevel < 30 ? "bg-red-600" :
                                truck.fuelLevel < 50 ? "bg-amber-600" :
                                "bg-green-600"
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{new Date(truck.nextMaintenance).toLocaleDateString()}</span>
                          </div>
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
                        No vehicles found matching your filters.
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
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>Upcoming maintenance for your fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TRUCKS_DATA
                  .filter(truck => truck.status !== "maintenance")
                  .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
                  .slice(0, 5)
                  .map((truck) => {
                    const nextDate = new Date(truck.nextMaintenance);
                    const today = new Date();
                    const diffTime = nextDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={truck.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                          ${diffDays <= 7 ? 'bg-red-100 text-red-600' : 
                          diffDays <= 14 ? 'bg-amber-100 text-amber-600' : 
                          'bg-blue-100 text-blue-600'}`}>
                          <GitBranch className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {truck.id}: {truck.model}
                            </p>
                            <Badge 
                              className={
                                diffDays <= 7 ? 'bg-red-100 text-red-800' : 
                                diffDays <= 14 ? 'bg-amber-100 text-amber-800' : 
                                'bg-blue-100 text-blue-800'
                              }
                            >
                              {diffDays <= 0 ? 'Overdue' : `${diffDays} days`}
                            </Badge>
                          </div>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              {nextDate.toLocaleDateString()}
                            </p>
                            <p className="text-xs">
                              <span className="text-muted-foreground">Mileage:</span> {truck.mileage.toLocaleString()} km
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Performance</CardTitle>
              <CardDescription>Track efficiency metrics across your fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Average Fuel Efficiency</h4>
                    <span className="text-sm font-medium">8.2 km/l</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">4x4 SUVs</span>
                        <span className="text-xs font-medium">6.8 km/l</span>
                      </div>
                      <Progress value={68} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Cargo Vans</span>
                        <span className="text-xs font-medium">7.5 km/l</span>
                      </div>
                      <Progress value={75} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Delivery Trucks</span>
                        <span className="text-xs font-medium">5.2 km/l</span>
                      </div>
                      <Progress value={52} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Heavy Trucks</span>
                        <span className="text-xs font-medium">3.8 km/l</span>
                      </div>
                      <Progress value={38} className="h-1.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Fleet Utilization</h4>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Idle: 12%</span>
                    <span>Maintenance: 10%</span>
                    <span>Active: 78%</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <GaugeCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Average Speed</p>
                        <p className="text-xs text-muted-foreground">During active missions</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold">48 km/h</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">On-Time Delivery</p>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold">92%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Trucks;
