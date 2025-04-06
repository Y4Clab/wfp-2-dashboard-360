import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Truck as TruckIcon, 
  Save, 
  AlertCircle,
  Plus,
  Trash2,
  Package,
  Search,
  Info
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
import { assignTruckToMission, fetchTrucks, Truck } from "@/services/truckService";
import { fetchMissions, Mission, fetchProducts, Product } from "@/services/missionService";

// Define the cargo item interface
interface CargoItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

// Define the API request interface
interface TruckMissionRequest {
  mission: number;
  truck: number;
  cargo_items: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}

const TruckMission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    mission: "",
    truck: "",
    cargo_items: [] as CargoItem[]
  });

  // New cargo item state
  const [newCargoItem, setNewCargoItem] = useState({
    name: "",
    quantity: 1,
    unit: "kg"
  });

  // Fetch trucks, missions, and products on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [trucksData, missionsData, productsData] = await Promise.all([
          fetchTrucks(),
          fetchMissions(),
          fetchProducts()
        ]);
        setTrucks(trucksData);
        setMissions(missionsData);
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Update selected truck when truck is selected
  useEffect(() => {
    if (formData.truck) {
      const truck = trucks.find(t => t.id.toString() === formData.truck);
      setSelectedTruck(truck || null);
    } else {
      setSelectedTruck(null);
    }
  }, [formData.truck, trucks]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCargoItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setNewCargoItem(prev => ({
        ...prev,
        [name]: value === '' ? 0 : parseFloat(value)
      }));
    } else {
      setNewCargoItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddCargoItem = () => {
    if (!newCargoItem.name) {
      toast({
        title: "Missing information",
        description: "Please enter a cargo item name.",
        variant: "destructive",
      });
      return;
    }

    const newItem: CargoItem = {
      id: `cargo-${Date.now()}`,
      name: newCargoItem.name,
      quantity: newCargoItem.quantity,
      unit: newCargoItem.unit
    };

    setFormData(prev => ({
      ...prev,
      cargo_items: [...prev.cargo_items, newItem]
    }));

    // Reset the new cargo item form
    setNewCargoItem({
      name: "",
      quantity: 1,
      unit: "kg"
    });

    toast({
      title: "Cargo item added",
      description: `${newItem.name} has been added to the cargo list.`,
    });
  };

  const handleRemoveCargoItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      cargo_items: prev.cargo_items.filter(item => item.id !== id)
    }));
  };

  const handleAddExistingProduct = (product: Product) => {
    const newItem: CargoItem = {
      id: `cargo-${Date.now()}`,
      name: product.name,
      quantity: 1,
      unit: "kg" // Default to kg since Product doesn't have a unit property
    };

    setFormData(prev => ({
      ...prev,
      cargo_items: [...prev.cargo_items, newItem]
    }));

    toast({
      title: "Product added",
      description: `${product.name} has been added to the cargo list.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.mission) {
        throw new Error("Mission is required");
      }
      
      if (!formData.truck) {
        throw new Error("Truck is required");
      }
      
      if (formData.cargo_items.length === 0) {
        throw new Error("At least one cargo item is required");
      }
      
      // Prepare data for API
      const apiData: TruckMissionRequest = {
        mission: parseInt(formData.mission),
        truck: parseInt(formData.truck),
        cargo_items: formData.cargo_items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit
        }))
      };
      
      // Call the API to assign the truck to the mission
      await assignTruckToMission(apiData);
      
      toast({
        title: "Assignment successful",
        description: "Truck has been assigned to the mission successfully.",
      });
      
      // Navigate back to the trucks page
      navigate("/dashboard/trucks");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to assign truck to mission. Please try again.";
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

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">Assign Truck to Mission</h1>
          <p className="text-muted-foreground mt-1">
            Assign a truck to a mission and specify cargo items
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
            <CardTitle>Assignment Information</CardTitle>
            <CardDescription>
              Select a mission and truck, and specify cargo items
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mission" className="flex items-center gap-1">
                    Mission <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.mission} 
                    onValueChange={(value) => handleSelectChange("mission", value)}
                    disabled={isLoading}
                    defaultValue=""
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mission" />
                    </SelectTrigger>
                    <SelectContent>
                      {missions.length > 0 ? (
                        missions.map((mission) => (
                          <SelectItem key={mission.id} value={mission.id.toString()}>
                            {mission.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-missions" disabled>
                          No missions available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="truck" className="flex items-center gap-1">
                    Truck <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.truck} 
                    onValueChange={(value) => handleSelectChange("truck", value)}
                    disabled={isLoading}
                    defaultValue=""
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select truck" />
                    </SelectTrigger>
                    <SelectContent>
                      {trucks.length > 0 ? (
                        trucks.map((truck) => (
                          <SelectItem key={truck.id} value={truck.id.toString()}>
                            {truck.vehicle_name || truck.plate_number}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-trucks" disabled>
                          No trucks available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedTruck && (
                <Alert className="bg-muted">
                  <TruckIcon className="h-4 w-4" />
                  <AlertTitle>Selected Truck Information</AlertTitle>
                  <AlertDescription className="mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>Vehicle Name:</strong> {selectedTruck.vehicle_name || "N/A"}</p>
                        <p><strong>Plate Number:</strong> {selectedTruck.plate_number || "N/A"}</p>
                        <p><strong>Capacity:</strong> {selectedTruck.capacity_tons || "N/A"} tons</p>
                      </div>
                      <div>
                        <p><strong>Model:</strong> {selectedTruck.model || "N/A"}</p>
                        <p><strong>Year:</strong> {selectedTruck.year || "N/A"}</p>
                        <p><strong>Status:</strong> {selectedTruck.status || "N/A"}</p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Cargo Items for this Truck</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleAddCargoItem}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Custom Item</span>
                  </Button>
                </div>
                
                {formData.cargo_items.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Item</th>
                          <th className="px-4 py-2 text-left">Quantity</th>
                          <th className="px-4 py-2 text-left">Unit</th>
                          <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.cargo_items.map((item) => (
                          <tr key={item.id} className="border-b last:border-0">
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2">{item.quantity}</td>
                            <td className="px-4 py-2">{item.unit}</td>
                            <td className="px-4 py-2 text-right">
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleRemoveCargoItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No cargo items added yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Please add cargo items that will be transported by this truck
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="cargo-name">Item Name</Label>
                    <Input
                      id="cargo-name"
                      name="name"
                      placeholder="Maize"
                      value={newCargoItem.name}
                      onChange={handleCargoItemChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cargo-quantity">Quantity</Label>
                    <Input
                      id="cargo-quantity"
                      name="quantity"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="100"
                      value={newCargoItem.quantity}
                      onChange={handleCargoItemChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cargo-unit">Unit</Label>
                    <Select 
                      value={newCargoItem.unit} 
                      onValueChange={(value) => setNewCargoItem(prev => ({...prev, unit: value}))}
                      defaultValue="kg"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="l">Liters (L)</SelectItem>
                        <SelectItem value="ml">Milliliters (mL)</SelectItem>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="boxes">Boxes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Select Existing Products</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span>Select from available products in the system</span>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {isLoading ? (
                    <div className="col-span-full text-center py-4">Loading products...</div>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="border rounded-md p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              kg
                            </p>
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddExistingProduct(product)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-4">
                      {searchQuery ? "No products found matching your search" : "No products available"}
                    </div>
                  )}
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
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Assign Truck</span>
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

export default TruckMission; 