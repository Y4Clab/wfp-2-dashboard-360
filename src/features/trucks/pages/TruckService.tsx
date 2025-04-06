import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  Settings, 
  Truck as TruckIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Wrench
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { fetchServiceRecords, addServiceRecord, ServiceRecord } from "@/features/trucks/services/truckServiceService";
import { fetchTrucks, Truck } from "@/features/trucks/services/truckService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ServiceStatus = "all" | "completed" | "scheduled" | "pending";
type ServiceType = "all" | "Routine Maintenance" | "Repair" | "Emergency Repair" | "Inspection";

const TruckService = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus>("all");
  const [typeFilter, setTypeFilter] = useState<ServiceType>("all");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newService, setNewService] = useState({
    truck_id: "",
    service_type: "",
    date: new Date(),
    description: "",
    cost: 0,
    technician: "",
    next_service_date: new Date(new Date().setMonth(new Date().getMonth() + 3))
  });

  // Fetch service records and trucks on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [recordsData, trucksData] = await Promise.all([
          fetchServiceRecords(),
          fetchTrucks()
        ]);
        setServiceRecords(recordsData);
        setTrucks(trucksData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load service records. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredServiceRecords = serviceRecords.filter(record => {
    const matchesSearch = 
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.truck_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.truck_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.technician.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesType = typeFilter === "all" || record.service_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "scheduled": return <Calendar className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleAddService = async () => {
    try {
      // Format dates for API
      const formattedService = {
        ...newService,
        date: format(newService.date, "yyyy-MM-dd"),
        next_service_date: format(newService.next_service_date, "yyyy-MM-dd")
      };
      
      // Add the service record to the database
      const newRecord = await addServiceRecord(formattedService);
      
      // Update the local state with the new record
      setServiceRecords([...serviceRecords, newRecord]);
      
      // Close the dialog and reset the form
      setIsAddServiceOpen(false);
      setNewService({
        truck_id: "",
        service_type: "",
        date: new Date(),
        description: "",
        cost: 0,
        technician: "",
        next_service_date: new Date(new Date().setMonth(new Date().getMonth() + 3))
      });
    } catch (err) {
      console.error("Failed to add service record:", err);
      setError("Failed to add service record. Please try again.");
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
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Truck Service</h1>
          <p className="text-muted-foreground">
            Manage maintenance and service records for your fleet
          </p>
        </div>
        <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Add Service Record</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Service Record</DialogTitle>
              <DialogDescription>
                Create a new service record for a truck in your fleet
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="truck" className="text-right">
                  Truck
                </Label>
                <Select 
                  value={newService.truck_id} 
                  onValueChange={(value) => setNewService({...newService, truck_id: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a truck" />
                  </SelectTrigger>
                  <SelectContent>
                    {trucks.map((truck) => (
                      <SelectItem key={truck.id} value={truck.id.toString()}>
                        {truck.vehicle_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceType" className="text-right">
                  Service Type
                </Label>
                <Select 
                  value={newService.service_type} 
                  onValueChange={(value) => setNewService({...newService, service_type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine Maintenance">Routine Maintenance</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Emergency Repair">Emergency Repair</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Service Date
                </Label>
                <div className="col-span-3">
                  <CalendarComponent
                    mode="single"
                    selected={newService.date}
                    onSelect={(date) => date && setNewService({...newService, date})}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nextServiceDate" className="text-right">
                  Next Service
                </Label>
                <div className="col-span-3">
                  <CalendarComponent
                    mode="single"
                    selected={newService.next_service_date}
                    onSelect={(date) => date && setNewService({...newService, next_service_date: date})}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="technician" className="text-right">
                  Technician
                </Label>
                <Input
                  id="technician"
                  value={newService.technician}
                  onChange={(e) => setNewService({...newService, technician: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cost" className="text-right">
                  Cost
                </Label>
                <Input
                  id="cost"
                  type="number"
                  value={newService.cost}
                  onChange={(e) => setNewService({...newService, cost: parseFloat(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddService}>
                Add Service Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <CardTitle>Service Records</CardTitle>
                <CardDescription>View and manage service records for your fleet</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    className="w-full sm:w-[250px] pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ServiceStatus)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ServiceType)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Routine Maintenance">Routine Maintenance</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Emergency Repair">Emergency Repair</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
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
                    <TableHead>Truck</TableHead>
                    <TableHead className="hidden md:table-cell">Service Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Technician</TableHead>
                    <TableHead className="hidden xl:table-cell">Next Service</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading service records...
                      </TableCell>
                    </TableRow>
                  ) : filteredServiceRecords.length > 0 ? (
                    filteredServiceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.truck_name}</p>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                              {record.truck_id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{record.service_type}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusIcon(record.status)}
                            <span className="ml-1">{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{record.technician}</TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {new Date(record.next_service_date).toLocaleDateString()}
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
                      <TableCell colSpan={8} className="text-center py-8">
                        No service records found matching your filters
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
              <CardTitle>Upcoming Services</CardTitle>
              <CardDescription>Vehicles scheduled for service in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceRecords
                  .filter(record => record.status === "scheduled" || record.status === "pending")
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((record) => {
                    const serviceDate = new Date(record.date);
                    const today = new Date();
                    const diffTime = serviceDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={record.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                          ${diffDays <= 7 ? 'bg-red-100 text-red-600' : 
                          diffDays <= 14 ? 'bg-amber-100 text-amber-600' : 
                          'bg-blue-100 text-blue-600'}`}>
                          <Wrench className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{record.truck_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {record.service_type} - {new Date(record.date).toLocaleDateString()}
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
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Overview of service records by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-600"></div>
                    <span className="text-sm">Completed</span>
                  </div>
                  <span className="text-sm font-medium">
                    {serviceRecords.filter(r => r.status === "completed").length} records
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                    <span className="text-sm">Scheduled</span>
                  </div>
                  <span className="text-sm font-medium">
                    {serviceRecords.filter(r => r.status === "scheduled").length} records
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-600"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="text-sm font-medium">
                    {serviceRecords.filter(r => r.status === "pending").length} records
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

export default TruckService; 