import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import MissionDetailsForm from "@/components/mission-form/MissionDetailsForm";
import CargoForm from "@/components/mission-form/CargoForm";

// Import types and schemas
import {
  missionFormSchema,
  missionDetailsSchema,
  cargoSchema,
  MissionFormValues,
  MissionDetailsValues,
  CargoValues,
  Product,
  Vendor
} from "@/types/mission-form";

// Import services
import {
  fetchProducts,
  fetchVendors,
  createMission,
  assignVendorToMission,
  addCargoToMission
} from "@/services/missionService";

const MissionForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeTab, setActiveTab] = useState("mission");
  const [missionId, setMissionId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Initialize form
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
      foodItems: [],
      totalWeight: 0,
      beneficiaries: 0,
      truckIds: [],
      driverId: "",
      description: "",
      termsAccepted: false,
    },
    mode: "onChange",
  });

  // Fetch products and vendors when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [productsData, vendorsData] = await Promise.all([
          fetchProducts(),
          fetchVendors()
        ]);
        
        setProducts(productsData);
        setVendors(vendorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error fetching data",
          description: "Unable to load products and vendors",
          variant: "destructive",
        });
      } finally {
        setLoadingData(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Handle product selection
  const handleProductChange = (productId: string, checked: boolean) => {
    const product = products.find(p => p.unique_id === productId);
    if (!product) return;
    
    const currentItems = form.getValues().foodItems;
    
    if (checked) {
      // Add the product with default quantity
      setSelectedProducts([...selectedProducts, productId]);
      const newItems = [...currentItems, { id: product.unique_id, name: product.name, quantity: 1 }];
      form.setValue("foodItems", newItems, {
        shouldValidate: true
      });
    } else {
      // Remove the product
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
      const filteredItems = currentItems.filter(item => item.id !== productId);
      form.setValue("foodItems", filteredItems, {
        shouldValidate: true
      });
    }
  };

  // Handle quantity change
  const handleQuantityChange = (productId: string, quantity: number) => {
    const currentItems = form.getValues().foodItems;
    const updatedItems = currentItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    form.setValue("foodItems", updatedItems, {
      shouldValidate: true
    });
    
    // Calculate new total weight
    const totalWeight = updatedItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    form.setValue("totalWeight", totalWeight);
  };
  
  // Validate and submit mission details
  const validateAndSubmitMission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get all form values
    const allValues = form.getValues();
    
    // Extract only mission details values
    const missionDetails: MissionDetailsValues = {
      missionTitle: allValues.missionTitle,
      missionType: allValues.missionType,
      vendorId: allValues.vendorId,
      startDate: allValues.startDate,
      endDate: allValues.endDate,
      departureLocation: allValues.departureLocation,
      destinationLocation: allValues.destinationLocation,
      beneficiaries: allValues.beneficiaries,
      description: allValues.description,
      termsAccepted: allValues.termsAccepted,
    };
    
    // Validate only mission details
    const missionDetailsResult = missionDetailsSchema.safeParse(missionDetails);
    
    if (missionDetailsResult.success) {
      try {
        setLoading(true);
        
        // Create mission
        const result = await createMission(missionDetailsResult.data);
        const newMissionId = result.id;
        setMissionId(newMissionId);
        
        // Assign vendor to mission if needed
        if (missionDetailsResult.data.vendorId) {
          await assignVendorToMission(
            missionDetailsResult.data.vendorId, 
            newMissionId, 
            vendors
          );
        }
        
        // Show success toast
        toast({
          title: "Mission created successfully",
          description: "Now you can add cargo items to this mission.",
        });
  
        // Switch to cargo tab
        setActiveTab("cargo");
        
      } catch (error) {
        console.error("Error creating mission:", error);
        toast({
          title: "Error creating mission",
          description: "There was a problem creating the mission. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Mission details validation failed:", missionDetailsResult.error.format());
      
      // Set errors on form
      const errors = missionDetailsResult.error.format();
      
      // We need to manually set the errors on the form
      Object.keys(errors).forEach(path => {
        if (path !== '_errors') {
          form.setError(path as keyof MissionDetailsValues, {
            type: 'manual',
            message: errors[path]?._errors[0] || 'Invalid field'
          });
        }
      });
    }
  };
  
  // Validate and submit cargo details
  const validateAndSubmitCargo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!missionId) {
      toast({
        title: "Mission not created",
        description: "Please create a mission first before adding cargo.",
        variant: "destructive",
      });
      setActiveTab("mission");
      return;
    }
    
    // Get all form values
    const allValues = form.getValues();
    
    // Extract only cargo values
    const cargoDetails: CargoValues = {
      foodItems: allValues.foodItems,
      totalWeight: allValues.totalWeight,
    };
    
    // Validate only cargo details
    const cargoDetailsResult = cargoSchema.safeParse(cargoDetails);
    
    if (cargoDetailsResult.success) {
      try {
        setLoading(true);
        
        // Add cargo to mission
        await addCargoToMission(missionId, cargoDetailsResult.data, products);
        
        // Show success toast
        toast({
          title: "Cargo added successfully",
          description: `Cargo has been added to mission.`,
          action: (
            <Button onClick={() => navigate('/dashboard/missions')} variant="outline" size="sm">
              View All Missions
            </Button>
          ),
        });
  
        // Navigate to missions page
        navigate('/dashboard/missions');
        
      } catch (error) {
        console.error("Error adding cargo:", error);
        toast({
          title: "Error adding cargo",
          description: "There was a problem adding cargo to the mission. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Cargo details validation failed:", cargoDetailsResult.error.format());
      
      // Set errors on form
      const errors = cargoDetailsResult.error.format();
      
      // We need to manually set the errors on the form
      Object.keys(errors).forEach(path => {
        if (path !== '_errors') {
          form.setError(path as keyof CargoValues, {
            type: 'manual',
            message: errors[path]?._errors[0] || 'Invalid field'
          });
        }
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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

      <Tabs 
        defaultValue="mission" 
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
          <TabsTrigger value="mission" disabled={!!missionId}>
            <Package className="h-4 w-4 mr-2" />
            Mission Details
          </TabsTrigger>
          <TabsTrigger value="cargo" disabled={!missionId}>
            <Package className="h-4 w-4 mr-2" />
            Cargo
          </TabsTrigger>
        </TabsList>
            
        <TabsContent value="mission">
          <MissionDetailsForm
            form={form}
            loading={loading}
            vendors={vendors}
            onSubmitMission={validateAndSubmitMission}
          />
        </TabsContent>
        
        <TabsContent value="cargo">
          <CargoForm
            form={form}
            loading={loading}
            loadingData={loadingData}
            products={products}
            onSubmitCargo={validateAndSubmitCargo}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            handleProductChange={handleProductChange}
            handleQuantityChange={handleQuantityChange}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MissionForm;
