import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
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
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

//types
import { Mission } from "../types/mission.types";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const MISSIONS_URL = `${API_BASE_URL}/api/missions/`;

const statusIcons = {
  'Pending': <Clock className="w-4 h-4" />,
  'Active': <AlertCircle className="w-4 h-4 text-blue-500" />,
  'Completed': <CheckCircle2 className="w-4 h-4 text-green-500" />,
  'Cancelled': <AlertCircle className="w-4 h-4 text-red-500" />,
  'Delayed': <Clock className="w-4 h-4 text-orange-500" />
};

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Active': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'Delayed': 'bg-orange-100 text-orange-800'
};

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const getMissionById = async (id: string) => {
    try {
      const { data } = await axios.get(`${MISSIONS_URL}${id}`);
      setMission(data);
    } catch (error) {
      console.error("Error fetching mission:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getMissionById(id);
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!mission) return (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium">Mission not found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        The mission you're looking for doesn't exist or may have been removed.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/dashboard/missions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Missions
          </Link>
        </Button>
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
            to="/dashboard/missions" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Missions
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight capitalize">{mission.title}</h1>
            <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[mission.status as keyof typeof statusColors]}`}>
              <div className="flex items-center gap-1.5">
                {statusIcons[mission.status as keyof typeof statusIcons]}
                <span>{mission.status}</span>
              </div>
            </Badge>
          </div>
          <p className="mt-2 text-lg text-muted-foreground">{mission.description}</p>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 h-12">
          <TabsTrigger value="overview" className="py-3">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              Overview
            </div>
          </TabsTrigger>
          <TabsTrigger value="logistics" className="py-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Logistics
            </div>
          </TabsTrigger>
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
                <div className="text-2xl font-bold capitalize">{mission.type}</div>
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
                <div className="text-2xl font-bold">{mission.number_of_beneficiaries}</div>
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
                <div className="text-lg font-bold">{formatDate(mission.start_date)}</div>
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
                <div className="text-lg font-bold">{formatDate(mission.end_date)}</div>
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
                  <p className="text-lg font-medium capitalize">{mission.dept_location}</p>
                </div>
                <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <HardDriveDownload className="w-4 h-4" />
                    Destination
                  </h3>
                  <p className="text-lg font-medium capitalize">{mission.destination_location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logistics Tab */}
        <TabsContent value="logistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assigned Trucks */}
            {mission.assigned_trucks?.length > 0 && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <span>Assigned Trucks</span>
                    <Badge className="ml-auto">{mission.assigned_trucks.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mission.assigned_trucks.map(({ truck, assignment_id, assigned_cargo }) => (
                    <div key={assignment_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-muted/10 to-background">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="border-2 border-primary/20 w-12 h-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {truck.plate_number.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg">{truck.plate_number}</h3>
                            <p className="text-sm text-muted-foreground capitalize">
                              {truck.vehicle_name} • {truck.model} • {truck.year}
                            </p>
                          </div>
                        </div>
                        <Badge variant={truck.status === 'active' ? 'default' : 'destructive'} className="capitalize">
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
                            <p className="text-xs text-muted-foreground">Vendor</p>
                            <p className="text-sm font-medium capitalize">{truck.vendor.name}</p>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                          <Gauge className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Capacity</p>
                            <p className="font-medium">{truck.capacity} kg</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                          <Weight className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Current Load</p>
                            <p className="font-medium">
                              {assigned_cargo?.reduce((sum, cargo) => sum + (cargo.cargo_item.product.quantity * cargo.quantity), 0)} kg
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
                              <div key={index} className="pl-3 border-l-2 border-primary/50">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium capitalize">{cargo.cargo_item.product.name}</span>
                                  <span className="text-sm font-semibold">{cargo.quantity} units</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{cargo.cargo_item.product.quantity * cargo.quantity} kg</span>
                                  <span>
                                    {((cargo.quantity / cargo.cargo_item.quantity) * 100).toFixed(0)}% of total
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Assigned Vendors */}
            {mission.assigned_vendors?.length > 0 && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Assigned Vendors</span>
                    <Badge className="ml-auto">{mission.assigned_vendors.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mission.assigned_vendors.map(({ vendor, assignment_id, contacts }) => (
                    <div key={assignment_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-muted/10 to-background">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="border-2 border-primary/20 w-12 h-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {getInitials(vendor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-lg capitalize">{vendor.name}</h3>
                            <p className="text-sm text-muted-foreground">{vendor.reg_no}</p>
                          </div>
                        </div>
                        <Badge variant={vendor.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                          {vendor.status}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                          <Box className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Vendor Type</p>
                            <p className="font-medium capitalize">{vendor.vendor_type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                          <Truck className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Fleet Size</p>
                            <p className="font-medium">{vendor.fleet_size}</p>
                          </div>
                        </div>
                      </div>

                      {contacts?.length > 0 && (
                        <div className="mt-4">
                          <Separator className="my-3" />
                          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <Contact className="w-3 h-3" />
                            CONTACTS
                          </h4>
                          <div className="space-y-3">
                            {contacts.map((contact) => (
                              <div key={contact.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">
                                    {contact.name ? getInitials(contact.name) : `C${contact.id}`}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {contact.name || `Contact #${contact.id}`}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <a href={`tel:${contact.phone}`} className="hover:text-primary flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {contact.phone}
                                    </a>
                                    {contact.email && (
                                      <a href={`mailto:${contact.email}`} className="hover:text-primary flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        <span className="truncate">{contact.email}</span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
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
                  {mission.assigned_vendors?.reduce((sum, vendor) => sum + (vendor.contacts?.length || 0), 0)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mission.assigned_vendors?.map((vendor) => (
                  vendor.contacts?.map((contact) => (
                    <div key={`${vendor.assignment_id}-${contact.id}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-muted/10 to-background">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {contact.name ? getInitials(contact.name) : `C${contact.id}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {contact.name || `Contact #${contact.id}`}
                          </h3>
                          <p className="text-xs text-muted-foreground capitalize">
                            {vendor.vendor.name} • {vendor.vendor.vendor_type.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href={`tel:${contact.phone}`} className="hover:text-primary">
                            {contact.phone}
                          </a>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <a href={`mailto:${contact.email}`} className="hover:text-primary truncate">
                              {contact.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ))}
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
                  <Badge className="ml-auto">{mission.cargo_items.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mission.cargo_items.map((item) => {
                  const deliveredPercentage = ((item.quantity - item.remaining_quantity) / item.quantity) * 100;
                  
                  return (
                    <Card key={item.unique_id} className="hover:shadow-md transition-shadow border-primary/20">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="capitalize text-lg">{item.product.name}</CardTitle>
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
                              <span className="text-muted-foreground">Delivery Progress</span>
                              <span className="font-medium">
                                {item.quantity - item.remaining_quantity} / {item.quantity} units
                              </span>
                            </div>
                            <Progress value={deliveredPercentage} className="h-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <Box className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-muted-foreground">Remaining</p>
                                <p className="font-medium">{item.remaining_quantity} units</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <HardDriveDownload className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-muted-foreground">Total Weight</p>
                                <p className="font-medium">{item.quantity * item.product.quantity} kg</p>
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

export default MissionDetail;