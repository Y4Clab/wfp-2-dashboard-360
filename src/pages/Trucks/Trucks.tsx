import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  AlertCircle,
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
  Verified,
  List,
  ChevronDown
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchTrucks, Truck } from "@/services/truckService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type TruckStatus = "all" | "active" | "maintenance" | "inactive";
type TruckType = "all" | "4x4 SUV" | "Cargo Van" | "Delivery Truck" | "Heavy Truck" | "Pickup Truck";

const Trucks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TruckStatus>("all");
  const [typeFilter, setTypeFilter] = useState<TruckType>("all");
  const [alertFilter, setAlertFilter] = useState<"all" | "withAlerts">("all");
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trucks on component mount
  useEffect(() => {
    const loadTrucks = async () => {
      try {
        setIsLoading(true);
        const trucksData = await fetchTrucks();
        setTrucks(trucksData);
      } catch (err) {
        console.error("Failed to load trucks:", err);
        setError("Failed to load trucks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrucks();
  }, []);

  // Filter trucks based on search query and filters
  const filteredTrucks = trucks.filter((truck) => {
    const matchesSearch = 
      truck.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.vehicle_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (truck.vendor && truck.vendor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (truck.assigned_mission && truck.assigned_mission.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (truck.mission_name && truck.mission_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || truck.status === statusFilter;
    // For type filter, we'll use a simple check on the vehicle name
    // In a real app, you'd have a proper type field in the database
    const matchesType = typeFilter === "all" || 
      (typeFilter === "4x4 SUV" && truck.vehicle_name.includes("Land Cruiser")) ||
      (typeFilter === "Cargo Van" && truck.vehicle_name.includes("Sprinter")) ||
      (typeFilter === "Delivery Truck" && truck.vehicle_name.includes("FRR")) ||
      (typeFilter === "Heavy Truck" && truck.vehicle_name.includes("Fuso")) ||
      (typeFilter === "Pickup Truck" && truck.vehicle_name.includes("Hilux"));
    
    const matchesAlert = alertFilter === "all" || (alertFilter === "withAlerts" && truck.alerts && truck.alerts.length > 0);
    
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              <TruckIcon size={16} />
              <span>Vehicles</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/dashboard/trucks")}>
              <List className="mr-2 h-4 w-4" />
              <span>View All Vehicles</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/trucks/new")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add New Vehicle</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/trucks/mission")}>
              <MapPin className="mr-2 h-4 w-4" />
              <span>Assign to Mission</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/tracking/new")}>
              <MapPin className="mr-2 h-4 w-4" />
              <span>Track Mission</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>Fleet Overview</CardTitle>
                <CardDescription>View and manage your fleet of vehicles</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vehicles..."
                    className="w-full sm:w-[250px] pl-8"
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
            </div>
          </CardHeader>
          <CardContent>
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        Loading trucks...
                      </TableCell>
                    </TableRow>
                  ) : filteredTrucks.length > 0 ? (
                    filteredTrucks.map((truck) => (
                      <TableRow key={truck.id}>
                        <TableCell className="font-medium">{truck.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{truck.vehicle_name}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                              {/* In a real app, you'd have a proper type field */}
                              {truck.vehicle_name.includes("Land Cruiser") ? "4x4 SUV" :
                               truck.vehicle_name.includes("Sprinter") ? "Cargo Van" :
                               truck.vehicle_name.includes("FRR") ? "Delivery Truck" :
                               truck.vehicle_name.includes("Fuso") ? "Heavy Truck" :
                               truck.vehicle_name.includes("Hilux") ? "Pickup Truck" : "Vehicle"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{truck.vendor || "N/A"}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{truck.location || "Unknown"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(truck.status)}>
                            {truck.status.charAt(0).toUpperCase() + truck.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {truck.assigned_mission ? (
                            <div className="flex items-center gap-1">
                              <Verified className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{truck.assigned_mission}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                              <Fuel className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs font-medium">{truck.fuel_level || 0}%</span>
                            </div>
                            <Progress 
                              value={truck.fuel_level || 0} 
                              className={`h-1.5 ${
                                (truck.fuel_level || 0) < 30 ? "bg-red-600" :
                                (truck.fuel_level || 0) < 50 ? "bg-amber-600" :
                                "bg-green-600"
                              }`}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{truck.next_maintenance ? new Date(truck.next_maintenance).toLocaleDateString() : "Not scheduled"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => navigate(`/dashboard/tracking/new?truck=${truck.id}`)}
                              title="Track Mission"
                            >
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        No vehicles found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance</CardTitle>
              <CardDescription>Vehicles scheduled for maintenance in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trucks
                  .filter(truck => truck.status !== "maintenance" && truck.next_maintenance)
                  .sort((a, b) => new Date(a.next_maintenance || "").getTime() - new Date(b.next_maintenance || "").getTime())
                  .slice(0, 5)
                  .map((truck) => {
                    const nextDate = new Date(truck.next_maintenance || "");
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
                          <p className="text-sm font-medium truncate">{truck.vehicle_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Next maintenance: {new Date(truck.next_maintenance || "").toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className={diffDays <= 7 ? "text-red-600 border-red-200" : diffDays <= 14 ? "text-amber-600 border-amber-200" : "text-blue-600 border-blue-200"}>
                            {diffDays} days
                          </Badge>
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
              <CardTitle>Fleet Status</CardTitle>
              <CardDescription>Overview of your fleet's current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
                    <span className="text-sm">Active</span>
                  </div>
                  <span className="text-sm font-medium">
                    {trucks.filter(t => t.status === "active").length} vehicles
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-600"></div>
                    <span className="text-sm">Maintenance</span>
                  </div>
                  <span className="text-sm font-medium">
                    {trucks.filter(t => t.status === "maintenance").length} vehicles
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-600"></div>
                    <span className="text-sm">Inactive</span>
                  </div>
                  <span className="text-sm font-medium">
                    {trucks.filter(t => t.status === "inactive").length} vehicles
                  </span>
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
