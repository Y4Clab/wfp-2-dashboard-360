
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, MapPin, Package, Save, Truck, Users } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const missionFormSchema = z.object({
  missionTitle: z.string().min(5, {
    message: "Mission title must be at least 5 characters.",
  }),
  missionType: z.enum(["emergency", "regular", "specialized"], {
    required_error: "Please select a mission type.",
  }),
  vendorId: z.string().min(1, {
    message: "Please select a vendor.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  departureLocation: z.string().min(3, {
    message: "Departure location is required.",
  }),
  destinationLocation: z.string().min(3, {
    message: "Destination location is required.",
  }),
  foodType: z.array(z.string()).nonempty({
    message: "Please select at least one food type.",
  }),
  totalWeight: z.coerce.number().min(1, {
    message: "Total weight must be at least 1 kg.",
  }),
  beneficiaries: z.coerce.number().min(1, {
    message: "Number of beneficiaries must be at least 1.",
  }),
  truckIds: z.array(z.string()).nonempty({
    message: "Please assign at least one truck.",
  }),
  driverId: z.string().min(1, {
    message: "Please select a driver.",
  }),
  description: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must confirm the mission details.",
  }),
});

type MissionFormValues = z.infer<typeof missionFormSchema>;

// Mock vendors data
const VENDORS = [
  { id: "V-001", name: "East Africa Logistics Ltd" },
  { id: "V-002", name: "Kenya Transport Services" },
  { id: "V-003", name: "Nairobi Supply Chain Solutions" },
  { id: "V-004", name: "Uganda Food Distributors" },
  { id: "V-005", name: "Tanzania Cargo Movers" },
];

// Mock trucks data
const TRUCKS = [
  { id: "TRK-1001", name: "Mercedes-Benz Actros", capacity: "20 tons" },
  { id: "TRK-1002", name: "Volvo FH16", capacity: "18 tons" },
  { id: "TRK-1003", name: "Scania R730", capacity: "25 tons" },
  { id: "TRK-1004", name: "MAN TGX", capacity: "22 tons" },
  { id: "TRK-1005", name: "Isuzu FVZ", capacity: "15 tons" },
  { id: "TRK-1006", name: "Mitsubishi Fuso", capacity: "12 tons" },
];

// Mock drivers data
const DRIVERS = [
  { id: "D-001", name: "Ahmed Hassan" },
  { id: "D-002", name: "Fatima Osei" },
  { id: "D-003", name: "Mohammad Ali" },
  { id: "D-004", name: "Grace Mwangi" },
  { id: "D-005", name: "Daniel Ochieng" },
];

// Food types
const FOOD_TYPES = [
  "Rice",
  "Beans",
  "Maize",
  "Wheat Flour",
  "Cooking Oil",
  "Salt",
  "Sugar",
  "Fortified Cereals",
  "Dried Fish",
  "Canned Goods",
];

const MissionForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: {
      missionTitle: "",
      missionType: "regular",
      vendorId: "",
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      departureLocation: "",
      destinationLocation: "",
      foodType: [],
      totalWeight: 0,
      beneficiaries: 0,
      truckIds: [],
      driverId: "",
      description: "",
      termsAccepted: false,
    },
  });

  const onSubmit = (data: MissionFormValues) => {
    console.log(data);
    
    // Show success toast
    toast({
      title: "Mission created successfully",
      description: `Mission ${data.missionTitle} has been created.`,
      action: (
        <Button onClick={() => navigate('/dashboard/missions')} variant="outline" size="sm">
          View All Missions
        </Button>
      ),
    });

    // Navigate to missions page
    navigate('/dashboard/missions');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Mission</h1>
          <p className="text-muted-foreground">
            Plan and schedule a new food distribution mission
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/missions')}
          >
            Cancel
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-4">
              <TabsTrigger value="mission">
                <Package className="h-4 w-4 mr-2" />
                Mission Details
              </TabsTrigger>
              <TabsTrigger value="logistics">
                <Truck className="h-4 w-4 mr-2" />
                Logistics
              </TabsTrigger>
              <TabsTrigger value="cargo">
                <Package className="h-4 w-4 mr-2" />
                Cargo
              </TabsTrigger>
              <TabsTrigger value="scheduling">
                <Clock className="h-4 w-4 mr-2" />
                Scheduling
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="mission">
              <Card>
                <CardHeader>
                  <CardTitle>Mission Information</CardTitle>
                  <CardDescription>
                    Enter the basic details about the mission
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="missionTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mission Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Emergency Food Distribution to Dadaab" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="missionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mission Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select mission type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="emergency">Emergency (Priority)</SelectItem>
                              <SelectItem value="regular">Regular Scheduled</SelectItem>
                              <SelectItem value="specialized">Specialized Delivery</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="vendorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned Vendor</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a vendor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {VENDORS.map(vendor => (
                                <SelectItem key={vendor.id} value={vendor.id}>
                                  {vendor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="beneficiaries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Beneficiaries</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              placeholder="e.g., 500" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Estimated number of people to be served
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mission Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide details about the mission purpose and objectives" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="logistics">
              <Card>
                <CardHeader>
                  <CardTitle>Transportation & Logistics</CardTitle>
                  <CardDescription>
                    Select transportation and route details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="departureLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departure Location</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-8" 
                                placeholder="e.g., Nairobi Warehouse" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="destinationLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination Location</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                className="pl-8" 
                                placeholder="e.g., Dadaab Refugee Camp" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="truckIds"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Assigned Trucks</FormLabel>
                          <FormDescription>
                            Select trucks for this mission
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {TRUCKS.map((truck) => (
                            <FormField
                              key={truck.id}
                              control={form.control}
                              name="truckIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={truck.id}
                                    className="flex items-center space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(truck.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, truck.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== truck.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex-1 space-y-1">
                                      <FormLabel className="text-sm font-medium leading-none cursor-pointer">
                                        {truck.id}: {truck.name}
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        Capacity: {truck.capacity}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="driverId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Driver</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                              <SelectValue placeholder="Select a lead driver" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DRIVERS.map(driver => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Lead driver responsible for the mission
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cargo">
              <Card>
                <CardHeader>
                  <CardTitle>Cargo Details</CardTitle>
                  <CardDescription>
                    Specify food items and quantities for delivery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="foodType"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Food Types</FormLabel>
                          <FormDescription>
                            Select all food types that will be distributed
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {FOOD_TYPES.map((type) => (
                            <FormField
                              key={type}
                              control={form.control}
                              name="foodType"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={type}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, type])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== type
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {type}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="totalWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Cargo Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            placeholder="e.g., 5000" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Total weight of all food items in kilograms
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="scheduling">
              <Card>
                <CardHeader>
                  <CardTitle>Mission Schedule</CardTitle>
                  <CardDescription>
                    Set mission start and end dates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={
                                    "pl-3 text-left font-normal flex justify-start items-center"
                                  }
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            The date when mission will begin
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={
                                    "pl-3 text-left font-normal flex justify-start items-center"
                                  }
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            The date when mission is expected to complete
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            I confirm that all mission details are accurate
                          </FormLabel>
                          <FormDescription>
                            By checking this box, you confirm the mission is ready for deployment.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard/missions')}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Create Mission
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default MissionForm;
