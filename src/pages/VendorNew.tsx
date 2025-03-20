
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, CheckSquare, FileText, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const VendorNew = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>('idle');
  const form = useForm({
    defaultValues: {
      name: '',
      type: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      contactTitle: '',
      certifications: '',
      description: ''
    }
  });
  
  const onSubmit = (data: any) => {
    console.log('Vendor data:', data);
    setFormState('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
      // Navigate to vendors list after successful submission
      setTimeout(() => {
        navigate('/dashboard/vendors');
      }, 1500);
    }, 2000);
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Basic details about the vendor company
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
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
                            <Input className="pl-10" placeholder="e.g., Global Foods Ltd." {...field} required />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Type*</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                            required
                          >
                            <option value="">Select vendor type...</option>
                            <option value="food">Food Supplier</option>
                            <option value="medical">Medical Supplies</option>
                            <option value="water">Water & Sanitation</option>
                            <option value="shelter">Shelter & Construction</option>
                            <option value="logistics">Logistics & Transport</option>
                            <option value="other">Other</option>
                          </select>
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
                      <FormLabel>Company Address*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="Full company address" {...field} required />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Email*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="email" className="pl-10" placeholder="e.g., contact@globalfoods.com" {...field} required />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Phone*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="e.g., +254 123 456 789" {...field} required />
                          </div>
                        </FormControl>
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
                      <FormLabel>Company Description*</FormLabel>
                      <FormControl>
                        <textarea 
                          className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Brief description of the company, its specialties, and capabilities..."
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contact & Compliance</CardTitle>
                <CardDescription>
                  Contact details and certification information
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Contact Person*</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="e.g., John Smith" {...field} required />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Title/Position*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Operations Manager" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certifications & Compliance*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <textarea 
                            className="flex min-h-24 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="List all relevant certifications, licenses, and compliance documents..."
                            {...field}
                            required
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Include ISO certifications, food safety standards, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6">
                  <h3 className="font-medium mb-2">Document Upload</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please upload the following required documents:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                    <li>• Business Registration Certificate</li>
                    <li>• Tax Compliance Certificate</li>
                    <li>• Quality Certifications</li>
                    <li>• Insurance Documents</li>
                  </ul>
                  <Button type="button" variant="outline" className="w-full">
                    Upload Documents
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Max 5MB per file. Accepted formats: PDF, JPG, PNG
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
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
