import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Truck as TruckIcon, 
  Save, 
  AlertCircle,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { addTruck } from "@/services/truckService";
import { fetchVendors } from "@/services/missionService";
import { Vendor } from "@/types/mission-form";
import { Textarea } from "@/components/ui/textarea";

const TruckNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(true);
  
  // Form state - updated to match API requirements
  const [formData, setFormData] = useState({
    vehicle_name: "",
    plate_number: "",
    vendor: "none",
    capacity_tons: 0,
    model: "",
    year: new Date().getFullYear(),
    registration_document: "",
    insurance_document: "",
    status: "active"
  });

  // Fetch vendors on component mount
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const vendorsData = await fetchVendors();
        setVendors(vendorsData);
      } catch (err) {
        console.error("Failed to load vendors:", err);
        setError("Failed to load vendors. Please try again.");
      } finally {
        setIsLoadingVendors(false);
      }
    };
    
    loadVendors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to a server
      // and get back a URL. For now, we'll just use a placeholder.
      const fileUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        [field]: fileUrl
      }));
      
      toast({
        title: "File selected",
        description: `${file.name} has been selected for ${field.replace('_', ' ')}.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.plate_number) {
        throw new Error("Plate number is required");
      }
      
      if (formData.vendor === "none") {
        throw new Error("Vendor is required");
      }
      
      if (formData.capacity_tons <= 0) {
        throw new Error("Capacity must be greater than 0");
      }
      
      // Prepare data for API
      const apiData = {
        vehicle_name: formData.vehicle_name,
        plate_number: formData.plate_number,
        vendor: formData.vendor,
        capacity_tons: formData.capacity_tons,
        model: formData.model || null,
        year: formData.year || null,
        registration_document: formData.registration_document || null,
        insurance_document: formData.insurance_document || null,
        status: formData.status
      };
      
      // Call the API to save the truck
      await addTruck(apiData);
      
      toast({
        title: "Vehicle added successfully",
        description: `Vehicle ${formData.vehicle_name || formData.plate_number} has been added to the fleet.`,
      });
      
      // Navigate back to the trucks page
      navigate("/dashboard/trucks");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add vehicle. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/dashboard/trucks")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Vehicle</h1>
          <p className="text-muted-foreground mt-1">
            Add a new vehicle to your fleet
          </p>
        </div>
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
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
            <CardDescription>
              Enter the details of the new vehicle
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_name">Vehicle Name</Label>
                  <Input
                    id="vehicle_name"
                    name="vehicle_name"
                    placeholder="Toyota Land Cruiser"
                    value={formData.vehicle_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plate_number" className="flex items-center gap-1">
                    Plate Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="plate_number"
                    name="plate_number"
                    placeholder="KAA 123A"
                    value={formData.plate_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vendor" className="flex items-center gap-1">
                    Vendor <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.vendor} 
                    onValueChange={(value) => handleSelectChange("vendor", value)}
                    disabled={isLoadingVendors}
                    defaultValue="none"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.unique_id} value={vendor.unique_id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity_tons" className="flex items-center gap-1">
                    Capacity (tons) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capacity_tons"
                    name="capacity_tons"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="5.0"
                    value={formData.capacity_tons}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="Land Cruiser V8"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder={new Date().getFullYear().toString()}
                    value={formData.year}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange("status", value)}
                    defaultValue="active"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="registration_document">Registration Document</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="registration_document"
                        name="registration_document"
                        value={formData.registration_document}
                        onChange={handleChange}
                        placeholder="Document URL"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => document.getElementById('registration_file')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <input
                        id="registration_file"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'registration_document')}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="insurance_document">Insurance Document</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="insurance_document"
                        name="insurance_document"
                        value={formData.insurance_document}
                        onChange={handleChange}
                        placeholder="Document URL"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => document.getElementById('insurance_file')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <input
                        id="insurance_file"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'insurance_document')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard/trucks")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isLoadingVendors}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Vehicle</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TruckNew; 