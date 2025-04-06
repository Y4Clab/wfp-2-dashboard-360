import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, CheckSquare, FileText, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CreateVendorDTO, VendorType, VendorStatus } from '../types/vendor';
import { useCreateVendor } from '../hooks/useVendors';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const vendorSchema = z.object({
  name: z.string(),
  reg_no: z.string(),
  vendor_type: z.enum(['food_supplier', 'medical_supplier', 'construction_supplier'] as const).nullable(),
  fleet_size: z.number().nullable(),
  description: z.string(),
  status: z.enum(['pending', 'approved', 'rejected'] as const).nullable()
});

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const VendorNew = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>('idle');
  const createVendor = useCreateVendor();

  const form = useForm<CreateVendorDTO>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: '',
      reg_no: '',
      vendor_type: null,
      fleet_size: null,
      description: '',
      status: null
    }
  });
  
  const onSubmit = async (data: CreateVendorDTO) => {
    setFormState('submitting');
    try {
      // Ensure all required fields are present and properly formatted
      const vendorData = {
        name: data.name.trim(),
        reg_no: data.reg_no.trim(),
        vendor_type: data.vendor_type,
        fleet_size: typeof data.fleet_size === 'number' ? data.fleet_size : null,
        description: data.description.trim(),
        status: 'pending'
      } as CreateVendorDTO;

      console.log('Attempting to create vendor with data:', JSON.stringify(vendorData, null, 2));
      
      const result = await createVendor.mutateAsync(vendorData);
      console.log('API Response:', result);
      
      setFormState('success');
      toast({
        title: "Vendor created successfully",
        description: `${data.name} has been added to your vendors list.`,
      });
      navigate('/dashboard/vendors');
    } catch (error: any) {
      console.error('Detailed API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      setFormState('error');
      toast({
        title: "Error creating vendor",
        description: error.response?.data?.message || error.message || "An unexpected error occurred while creating the vendor.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <Link to="/dashboard/vendors" className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vendors
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Register New Vendor</h1>
        <p className="text-muted-foreground">
          Add a new vendor to your approved suppliers list.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic details about the vendor company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="e.g., Global Foods Ltd." {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reg_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="e.g., REG123456" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vendor_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vendor type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="food_supplier">Food Supplier</SelectItem>
                          <SelectItem value="medical_supplier">Medical Supplier</SelectItem>
                          <SelectItem value="construction_supplier">Construction Supplier</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fleet_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fleet Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? null : Number(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>Number of vehicles in the vendor's fleet</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
                
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description*</FormLabel>
                    <FormControl>
                      <textarea 
                        className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Brief description of the company, its specialties, and capabilities..."
                        {...field}
                      />
                    </FormControl>
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
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vendor status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Set the initial status of the vendor</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/vendors')}
                  disabled={formState === 'submitting'}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="min-w-32"
                  disabled={formState === 'submitting' || formState === 'success'}
                >
                  {formState === 'submitting' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : formState === 'success' ? (
                    <>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Vendor Registered!
                    </>
                  ) : (
                    'Register Vendor'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </motion.div>
  );
};

export default VendorNew;
