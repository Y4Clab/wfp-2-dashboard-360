import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Truck,
  Users,
  Package,
  Box,
  User,
  Phone,
  ClipboardList,
  AlertCircle,
  Clock,
  CheckCircle2,
  Map,
  Mail,
  Contact,
  Gauge,
  Weight,
  HardDriveUpload,
  HardDriveDownload,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,

} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Mission } from "../types/mission.types";
import { useTracks } from "@/features/trucks/hooks/useTracks";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const MISSIONS_URL = `${API_BASE_URL}/api/vendor/missions/`;

const statusIcons = {
  Pending: <Clock className="w-4 h-4" />,
  Active: <AlertCircle className="w-4 h-4 text-blue-500" />,
  Completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  Cancelled: <AlertCircle className="w-4 h-4 text-red-500" />,
  Delayed: <Clock className="w-4 h-4 text-orange-500" />,
};

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Active: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Delayed: "bg-orange-100 text-orange-800",
};

type CargoAssignment = {
  cargo_item_id: string;
  quantity: number;
};

type FormValues = {
  truck_id: string;
  cargo_items: Record<string, number>;
};

const formSchema = z.object({
  truck_id: z.string().min(1, "Please select a truck"),
  cargo_items: z.record(
    z.number()
      .min(1, "Quantity must be at least 1")
      .max(1000, "Quantity too large")
  )
});

const VendorMissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { trucks, isLoading: isLoadingTrucks, loadTrucks } = useTracks();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      truck_id: "",
      cargo_items: {}
    }
  });

  const getMissionById = async (id: string) => {
    try {
      const { data } = await axios.get(`${MISSIONS_URL}${id}`);
      setMission(data);
      
      // Initialize form with cargo items
      if (data.cargo_items) {
        const cargoDefaults = data.cargo_items.reduce((acc: Record<string, number>, item: any) => {
          acc[item.unique_id] = 0;
          return acc;
        }, {});
        
        form.reset({
          truck_id: "",
          cargo_items: cargoDefaults
        });
      }
    } catch (error) {
      console.error("Error fetching mission:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getMissionById(id);
      loadTrucks();
    }
  }, [id]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Check if at least one cargo item has quantity > 0
      const hasCargo = Object.values(values.cargo_items).some(qty => qty > 0);
      
      if (!hasCargo) {
        form.setError("cargo_items", {
          message: "Please assign at least one cargo item"
        });
        return;
      }

      // Transform the form data to match API requirements
      const payload = {
        mission: id,
        truck: values.truck_id,
        cargo_items: Object.entries(values.cargo_items)
          .filter(([_, quantity]) => quantity > 0)
          .map(([cargo_item_id, quantity]) => ({
            cargo_item_id,
            quantity
          }))
      };

      await axios.post(`${API_BASE_URL}/api/vendor/trucks-for-mission/`, payload);
      
      toast({
        title: "Assignment successful",
        description: "Truck and cargo have been assigned to the mission"
      });
      
      // Refresh mission data
      await getMissionById(id);
      setActiveTab("logistics");
      
    } catch (error: any) {
      toast({
        title: "Assignment failed",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">Mission not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The mission you're looking for doesn't exist or may have been removed.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/dashboard/vendor/missions">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Missions
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-6 space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            to="/dashboard/vendor/missions"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Missions
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight capitalize">
              {mission.title}
            </h1>
            <Badge
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[mission.status as keyof typeof statusColors]
              }`}
            >
              <div className="flex items-center gap-1.5">
                {statusIcons[mission.status as keyof typeof statusIcons]}
                <span>{mission.status}</span>
              </div>
            </Badge>
          </div>
          <p className="mt-2 text-lg text-muted-foreground">
            {mission.description}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Map className="w-4 h-4" />
            View on Map
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
            <ClipboardList className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      {mission.assigned_trucks?.length === 0 && (
        <div
          className="bg-yellow-100 border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Warning! </strong>
          <span className="block sm:inline">
            This mission does not have any assigned trucks.
          </span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 h-12">
          <TabsTrigger value="overview" className="py-3">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              Overview
            </div>
          </TabsTrigger>
          {mission.assigned_trucks?.length === 0 && (
            <TabsTrigger value="assign-trucks" className="py-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Assign Trucks
              </div>
            </TabsTrigger>
          )}
          {mission.assigned_trucks?.length > 0 && (
            <TabsTrigger value="logistics" className="py-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Logistics
              </div>
            </TabsTrigger>
          )}
          <TabsTrigger value="contacts" className="py-3">
            <div className="flex items-center gap-2">
              <Contact className="w-4 h-4" />
              Contacts
            </div>
          </TabsTrigger>
          <TabsTrigger value="cargo" className="py-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Cargo
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  Mission Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {mission.type}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Beneficiaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mission.number_of_beneficiaries}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {formatDate(mission.start_date)}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  End Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {formatDate(mission.end_date)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Locations Section */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Locations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <HardDriveUpload className="w-4 h-4" />
                    Departure
                  </h3>
                  <p className="text-lg font-medium capitalize">
                    {mission.dept_location}
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <HardDriveDownload className="w-4 h-4" />
                    Destination
                  </h3>
                  <p className="text-lg font-medium capitalize">
                    {mission.destination_location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assign Trucks Tab */}
        <TabsContent value="assign-trucks" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span>Assign Trucks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form{...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="truck_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Truck</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a truck" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingTrucks ? (
                              <SelectItem value="loading" disabled>
                                Loading trucks...
                              </SelectItem>
                            ) : (
                              trucks?.map((truck) => (
                                <SelectItem 
                                  key={truck.id} 
                                  value={truck.id}
                                  disabled={truck.status !== "active"}
                                >
                                  {truck.plate_number} - {truck.vehicle_name} ({truck.status})
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="font-medium">Cargo Assignment</h3>
                    {mission.cargo_items?.map((item) => (
                      <FormField
                        key={item.unique_id}
                        control={form.control}
                        name={`cargo_items.${item.unique_id}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              {item.product.name} (Max: {item.remaining_quantity})
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={item.remaining_quantity}
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  field.onChange(isNaN(value) ? 0 : Math.min(value, item.remaining_quantity));
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              {item.product.quantity} kg per unit
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Saving..." : "Save Assignment"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Available Trucks List */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span>Available Trucks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingTrucks ? (
                <div className="col-span-2 flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                trucks?.map((truck) => (
                  <div key={truck.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="border-2 border-primary/20 w-12 h-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {truck.plate_number.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-lg">
                            {truck.plate_number}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {truck.vehicle_name} • {truck.model} • {truck.year}
                          </p>
                        </div>
                      </div>
                      <Badge variant={truck.status === "active" ? "default" : "destructive"}>
                        {truck.status}
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <Gauge className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Capacity</p>
                          <p className="font-medium">{truck.capacity} kg</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <Navigation className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="font-medium capitalize">{truck.current_location || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logistics Tab */}
        <TabsContent value="logistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mission.assigned_trucks?.length > 0 && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <span>Assigned Trucks</span>
                    <Badge className="ml-auto">
                      {mission.assigned_trucks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mission.assigned_trucks.map(
                    ({ truck, assignment_id, assigned_cargo }) => (
                      <div
                        key={assignment_id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-muted/10 to-background"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar className="border-2 border-primary/20 w-12 h-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {truck.plate_number.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-lg">
                                {truck.plate_number}
                              </h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {truck.vehicle_name} • {truck.model} • {truck.year}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              truck.status === "active" ? "default" : "destructive"
                            }
                            className="capitalize"
                          >
                            {truck.status}
                          </Badge>
                        </div>

                        {truck.vendor && (
                          <div className="mt-3 flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-primary/10">
                                {getInitials(truck.vendor.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Vendor
                              </p>
                              <p className="text-sm font-medium capitalize">
                                {truck.vendor.name}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <Gauge className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Capacity
                              </p>
                              <p className="font-medium">{truck.capacity} kg</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <Weight className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Current Load
                              </p>
                              <p className="font-medium">
                                {assigned_cargo?.reduce(
                                  (sum, cargo) =>
                                    sum +
                                    cargo.cargo_item.product.quantity *
                                    cargo.quantity,
                                  0
                                )}{" "}
                                kg
                              </p>
                            </div>
                          </div>
                        </div>

                        {assigned_cargo?.length > 0 && (
                          <div className="mt-4">
                            <Separator className="my-3" />
                            <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                              <Package className="w-3 h-3" />
                              CARGO ASSIGNMENTS
                            </h4>
                            <div className="space-y-3">
                              {assigned_cargo.map((cargo, index) => (
                                <div
                                  key={index}
                                  className="pl-3 border-l-2 border-primary/50"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium capitalize">
                                      {cargo.cargo_item.product.name}
                                    </span>
                                    <span className="text-sm font-semibold">
                                      {cargo.quantity} units
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>
                                      {cargo.cargo_item.product.quantity *
                                        cargo.quantity}{" "}
                                      kg
                                    </span>
                                    <span>
                                      {(
                                        (cargo.quantity /
                                          cargo.cargo_item.quantity) *
                                        100
                                      ).toFixed(0)}
                                      % of total
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Contact className="w-5 h-5 text-primary" />
                <span>All Contacts</span>
                <Badge className="ml-auto">
                  {mission.assigned_vendors?.reduce(
                    (sum, vendor) => sum + (vendor.contacts?.length || 0),
                    0
                  )}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mission.assigned_vendors?.map((vendor) =>
                  vendor.contacts?.map((contact) => (
                    <div
                      key={`${vendor.assignment_id}-${contact.id}`}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-muted/10 to-background"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {contact.name
                              ? getInitials(contact.name)
                              : `C${contact.id}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {contact.name || `Contact #${contact.id}`}
                          </h3>
                          <p className="text-xs text-muted-foreground capitalize">
                            {vendor.vendor.name} •{" "}
                            {vendor.vendor.vendor_type.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={`tel:${contact.phone}`}
                            className="hover:text-primary"
                          >
                            {contact.phone}
                          </a>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a
                              href={`mailto:${contact.email}`}
                              className="hover:text-primary truncate"
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cargo Tab */}
        <TabsContent value="cargo" className="space-y-6">
          {mission.cargo_items?.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span>Cargo Details</span>
                  <Badge className="ml-auto">
                    {mission.cargo_items.length} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mission.cargo_items.map((item) => {
                  const deliveredPercentage =
                    ((item.quantity - item.remaining_quantity) /
                    item.quantity) *
                    100;

                  return (
                    <Card
                      key={item.unique_id}
                      className="hover:shadow-md transition-shadow border-primary/20"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="capitalize text-lg">
                            {item.product.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-sm">
                            {item.quantity} units
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Weight className="w-3 h-3" />
                          {item.product.quantity} kg per unit
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                Delivery Progress
                              </span>
                              <span className="font-medium">
                                {item.quantity - item.remaining_quantity} /{" "}
                                {item.quantity} units
                              </span>
                            </div>
                            <Progress
                              value={deliveredPercentage}
                              className="h-2"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <Box className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-muted-foreground">
                                  Remaining
                                </p>
                                <p className="font-medium">
                                  {item.remaining_quantity} units
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <HardDriveDownload className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-muted-foreground">
                                  Total Weight
                                </p>
                                <p className="font-medium">
                                  {item.quantity * item.product.quantity} kg
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                            <p>Product ID: {item.product.unique_id}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default VendorMissionDetail;