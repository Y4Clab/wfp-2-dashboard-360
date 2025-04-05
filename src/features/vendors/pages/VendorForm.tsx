
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building, CheckCircle, FileText, Save, Star, Upload, X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

const vendorFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  registrationNumber: z.string().min(3, {
    message: "Registration number is required.",
  }),
  contactPersonName: z.string().min(2, {
    message: "Contact person name is required.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contactPhone: z.string().min(6, {
    message: "Please enter a valid phone number.",
  }),
  fleetSize: z.string().min(1, {
    message: "Fleet size is required.",
  }),
  address: z.string().min(5, {
    message: "Address is required.",
  }),
  country: z.string().min(2, {
    message: "Country is required.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  postalCode: z.string().optional(),
  vendorType: z.enum(["food-supplier", "logistics", "mixed"], {
    required_error: "Please select a vendor type.",
  }),
  operatingRegions: z.array(z.string()).nonempty({
    message: "Please select at least one operating region.",
  }),
  description: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

const VendorForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      companyName: "",
      registrationNumber: "",
      contactPersonName: "",
      contactEmail: "",
      contactPhone: "",
      fleetSize: "",
      address: "",
      country: "",
      city: "",
      postalCode: "",
      vendorType: "logistics",
      operatingRegions: [],
      description: "",
      termsAccepted: false,
    },
  });

  const onSubmit = (data: VendorFormValues) => {
    console.log(data, selectedFiles);
    
    // Show success toast
    toast({
      title: "Vendor added successfully",
      description: `${data.companyName} has been added to your vendors.`,
      action: (
        <Button onClick={() => navigate('/dashboard/vendors')} variant="outline" size="sm">
          View All Vendors
        </Button>
      ),
    });

    // Navigate to vendors page
    navigate('/dashboard/vendors');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
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
          <h1 className="text-3xl font-bold mb-2">Add New Vendor</h1>
          <p className="text-muted-foreground">
            Register a new logistics or food supply vendor
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/vendors')}
          >
            Cancel
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="company" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-4">
              <TabsTrigger value="company">
                <Building className="h-4 w-4 mr-2" />
                Company Info
              </TabsTrigger>
              <TabsTrigger value="contact">
                <Star className="h-4 w-4 mr-2" />
                Contact
              </TabsTrigger>
              <TabsTrigger value="operations">
                <CheckCircle className="h-4 w-4 mr-2" />
                Operations
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Enter the basic details about the vendor company
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Example Logistics Ltd." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="REG12345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="vendorType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="food-supplier" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Food Supplier
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="logistics" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Logistics Provider
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="mixed" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Mixed (Both)
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fleetSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fleet Size</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="e.g., 25" {...field} />
                          </FormControl>
                          <FormDescription>
                            Number of trucks/vehicles in the vendor's fleet
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
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the company and its services" 
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
            
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Enter contact details for the vendor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="contactPersonName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Nairobi" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Kenya" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="00100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="operations">
              <Card>
                <CardHeader>
                  <CardTitle>Operational Information</CardTitle>
                  <CardDescription>
                    Specify vendor's operational details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="operatingRegions"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Operating Regions</FormLabel>
                          <FormDescription>
                            Select all regions where this vendor operates
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            "East Africa",
                            "West Africa",
                            "North Africa",
                            "Central Africa",
                            "Southern Africa",
                            "Middle East",
                            "South Asia",
                            "South America",
                            "Central America",
                          ].map((region) => (
                            <FormField
                              key={region}
                              control={form.control}
                              name="operatingRegions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={region}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(region)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, region])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== region
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {region}
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
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Agreements</CardTitle>
                  <CardDescription>
                    Upload required documentation for the vendor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <h3 className="mt-2 font-medium">Upload Documents</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop files or click to browse
                    </p>
                    <Input
                      type="file"
                      id="vendorDocuments"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('vendorDocuments')?.click()}
                    >
                      Select Files
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                    </p>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                          >
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-sm truncate max-w-[200px] sm:max-w-xs">
                                {file.name}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({(file.size / 1024).toFixed(0)} KB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
                            I confirm that all information provided is accurate
                          </FormLabel>
                          <FormDescription>
                            By checking this box, you agree to the WFP's vendor terms and conditions.
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
              onClick={() => navigate('/dashboard/vendors')}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Vendor
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default VendorForm;
