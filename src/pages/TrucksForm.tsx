import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Save, 
  Truck, 
  Calendar,
  FileText, 
  Fuel,
  User,
  CheckSquare,
  Wrench,
  Loader2
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVendors } from "@/features/vendors/hooks/useVendors";
import { Vendor } from "@/features/vendors/types/vendor";

// Form validation schema
const truckFormSchema = z.object({
  vehicle_name: z.string().min(3, {
    message: "Vehicle name must be at least 3 characters.",
  }),
  vendor: z.string().nullable(),
  status: z.enum(["active", "maintenance", "inactive"]).nullable(),
});

type TruckFormValues = z.infer<typeof truckFormSchema>;

const TrucksForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: vendorsData, isLoading: isLoadingVendors, error: vendorsError } = useVendors();
  
  // Ensure vendors is an array and filter only approved vendors
  const vendors = Array.isArray(vendorsData) 
    ? vendorsData.filter(vendor => vendor.status === 'approved')
    : [];

  const form = useForm<TruckFormValues>({
    resolver: zodResolver(truckFormSchema),
    defaultValues: {
      vehicle_name: "",
      vendor: null,
      status: null,
    },
  });

  const onSubmit = (data: TruckFormValues) => {
    console.log(data);
    
    // Show success toast
    toast({
      title: "Truck added successfully",
      description: `${data.vehicle_name} has been added to your fleet.`,
      action: (
        <Button onClick={() => navigate('/dashboard/trucks')} variant="outline" size="sm">
          View All Trucks
        </Button>
      ),
    });

    // Navigate to trucks page
    navigate('/dashboard/trucks');
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
          <Link to="/dashboard/trucks" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trucks
          </Link>
          <h1 className="text-3xl font-bold">Add New Truck</h1>
          <p className="text-muted-foreground">
            Register a new truck to your fleet
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
              <CardDescription>
                Enter the basic details about the vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="vehicle_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Toyota Land Cruiser" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a unique name for the vehicle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vendor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {isLoadingVendors ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading vendors...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Select a vendor" />
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vendorsError ? (
                            <SelectItem value="error" disabled>
                              Error loading vendors
                            </SelectItem>
                          ) : vendors.length === 0 ? (
                            <SelectItem value="no-vendors" disabled>
                              No approved vendors available
                            </SelectItem>
                          ) : (
                            vendors.map((vendor) => (
                              <SelectItem 
                                key={vendor.unique_id} 
                                value={vendor.unique_id}
                              >
                                {vendor.name} ({vendor.reg_no})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select an approved vendor for this vehicle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the current status of the vehicle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/trucks')}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Vehicle
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default TrucksForm; 