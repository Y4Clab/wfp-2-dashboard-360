import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Clock, Filter, Search, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for trucks
const TRUCKS = [
  { 
    id: "TRK-1001", 
    driver: "Ahmed Hassan", 
    location: "Nairobi, Kenya", 
    status: "active", 
    mission: "M-2023-056",
    destination: "Kakuma Refugee Camp",
    eta: "2 hours",
    updatedAt: "5 minutes ago",
    progress: 65
  },
  { 
    id: "TRK-1002", 
    driver: "Fatima Osei", 
    location: "Addis Ababa, Ethiopia", 
    status: "active", 
    mission: "M-2023-057",
    destination: "Dire Dawa",
    eta: "3.5 hours",
    updatedAt: "2 minutes ago",
    progress: 42
  },
  { 
    id: "TRK-1003", 
    driver: "Mohammad Ali", 
    location: "Mombasa, Kenya", 
    status: "delayed", 
    mission: "M-2023-058",
    destination: "Garissa",
    eta: "5 hours (delayed)",
    updatedAt: "13 minutes ago",
    progress: 28
  },
  { 
    id: "TRK-1004", 
    driver: "Grace Mwangi", 
    location: "Juba, South Sudan", 
    status: "completed", 
    mission: "M-2023-055",
    destination: "Bor",
    eta: "Delivered",
    updatedAt: "1 hour ago",
    progress: 100
  },
  { 
    id: "TRK-1005", 
    driver: "Daniel Ochieng", 
    location: "Mogadishu, Somalia", 
    status: "active", 
    mission: "M-2023-059",
    destination: "Kismayo",
    eta: "4 hours",
    updatedAt: "7 minutes ago",
    progress: 35
  },
];

const LiveTracking = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTrucks = TRUCKS.filter(truck => {
    const matchesSearch = 
      truck.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      truck.mission.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || truck.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "delayed": return "bg-amber-100 text-amber-700";
      case "completed": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="h-4 w-4" />;
      case "delayed": return <AlertTriangle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Live Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your fleet and deliveries in real-time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Live Fleet Map</CardTitle>
            <CardDescription>Real-time location of all active trucks and missions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-slate-100 rounded-md flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-lg font-medium text-muted-foreground mb-4">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  This would be replaced with an actual interactive map using Google Maps, Mapbox, or Leaflet
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>Active Fleet</CardTitle>
                <CardDescription>All trucks currently on mission</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trucks or drivers..."
                    className="w-full sm:w-[250px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <Select
                    defaultValue="all"
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 font-medium text-sm">
                    <div className="col-span-2">Truck ID</div>
                    <div className="col-span-2">Driver</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2">Destination</div>
                    <div className="col-span-1">ETA</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                  {filteredTrucks.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      No trucks found matching your criteria
                    </div>
                  ) : (
                    filteredTrucks.map((truck) => (
                      <div
                        key={truck.id}
                        className="grid grid-cols-12 gap-2 p-4 border-t hover:bg-muted/30 text-sm"
                      >
                        <div className="col-span-2 font-medium">{truck.id}</div>
                        <div className="col-span-2">{truck.driver}</div>
                        <div className="col-span-2">
                          <Badge variant="outline" className={`${getStatusColor(truck.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(truck.status)}
                            <span className="capitalize">{truck.status}</span>
                          </Badge>
                        </div>
                        <div className="col-span-2">{truck.location}</div>
                        <div className="col-span-2">{truck.destination}</div>
                        <div className="col-span-1">{truck.eta}</div>
                        <div className="col-span-1">
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTrucks.length === 0 ? (
                    <div className="md:col-span-2 lg:col-span-3 p-8 text-center text-muted-foreground">
                      No trucks found matching your criteria
                    </div>
                  ) : (
                    filteredTrucks.map((truck) => (
                      <Card key={truck.id} className="overflow-hidden">
                        <div className={`h-2 ${truck.status === 'active' ? 'bg-green-500' : truck.status === 'delayed' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold">{truck.id}</p>
                              <p className="text-sm text-muted-foreground">{truck.driver}</p>
                            </div>
                            <Badge variant="outline" className={`${getStatusColor(truck.status)} flex items-center gap-1`}>
                              {getStatusIcon(truck.status)}
                              <span className="capitalize">{truck.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm mb-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Mission:</span>
                              <span className="font-medium">{truck.mission}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Location:</span>
                              <span>{truck.location}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Destination:</span>
                              <span>{truck.destination}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">ETA:</span>
                              <span>{truck.eta}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  truck.status === 'active' ? 'bg-green-500' : 
                                  truck.status === 'delayed' ? 'bg-amber-500' : 
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${truck.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>{truck.progress}% completed</span>
                              <span className="text-muted-foreground">Updated {truck.updatedAt}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default LiveTracking;
