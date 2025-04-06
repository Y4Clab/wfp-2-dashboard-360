import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  AlertCircle,
  Truck as TruckIcon,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Mock data for missions and trucks
const MOCK_MISSIONS = [
  { id: "M-2023-056", title: "Food Distribution - Kakuma" },
  { id: "M-2023-057", title: "Medical Supplies - Dire Dawa" },
  { id: "M-2023-058", title: "Emergency Relief - Garissa" },
  { id: "M-2023-059", title: "Water Delivery - Juba" },
  { id: "M-2023-060", title: "Shelter Materials - Mogadishu" }
];

const MOCK_TRUCKS = [
  { id: "TRK-1001", name: "Toyota Land Cruiser" },
  { id: "TRK-1002", name: "Mercedes Sprinter" },
  { id: "TRK-1003", name: "Isuzu FRR" },
  { id: "TRK-1004", name: "Mitsubishi Fuso" },
  { id: "TRK-1005", name: "Toyota Hilux" }
];

const TrackMission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get truck ID from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const truckIdFromUrl = queryParams.get('truck');
  
  // Form state
  const [formData, setFormData] = useState({
    mission: "",
    truck: truckIdFromUrl || ""
  });

  // Update form data when truck ID is available from URL
  useEffect(() => {
    if (truckIdFromUrl) {
      setFormData(prev => ({
        ...prev,
        truck: truckIdFromUrl
      }));
    }
  }, [truckIdFromUrl]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare data for API
      const apiData = {
        mission: formData.mission || null,
        truck: formData.truck || null
      };
      
      // Here you would typically make an API call to save the tracking data
      // For now, we'll just simulate a successful save
      console.log("Submitting data:", apiData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Tracking assignment created",
        description: "The mission and truck have been successfully linked for tracking.",
      });
      
      // Navigate back to the tracking page
      navigate("/dashboard/tracking");
    } catch (err) {
      setError("Failed to create tracking assignment. Please try again.");
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
          onClick={() => navigate("/dashboard/tracking")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Track Mission</h1>
          <p className="text-muted-foreground mt-1">
            Assign a truck to a mission for tracking
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
            <CardTitle>Mission Tracking Assignment</CardTitle>
            <CardDescription>
              Select a mission and a truck to track together
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission</Label>
                  <Select 
                    value={formData.mission} 
                    onValueChange={(value) => handleSelectChange("mission", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mission" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_MISSIONS.map((mission) => (
                        <SelectItem key={mission.id} value={mission.id}>
                          <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4" />
                            <span>{mission.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="truck">Truck</Label>
                  <Select 
                    value={formData.truck} 
                    onValueChange={(value) => handleSelectChange("truck", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a truck" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_TRUCKS.map((truck) => (
                        <SelectItem key={truck.id} value={truck.id}>
                          <div className="flex items-center gap-2">
                            <TruckIcon className="h-4 w-4" />
                            <span>{truck.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Truck and Mission Assignment Illustration */}
              {(formData.mission || formData.truck) && (
                <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                  <h3 className="text-sm font-medium mb-3">Assignment Preview</h3>
                  <div className="flex items-center justify-center gap-4">
                    {formData.mission && (
                      <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <ClipboardList className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xs mt-1 font-medium">
                          {MOCK_MISSIONS.find(m => m.id === formData.mission)?.title || 'Mission'}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <div className="h-0.5 w-8 bg-muted-foreground/30"></div>
                      <div className="h-0.5 w-8 bg-muted-foreground/30"></div>
                    </div>
                    
                    {formData.truck && (
                      <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <TruckIcon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xs mt-1 font-medium">
                          {MOCK_TRUCKS.find(t => t.id === formData.truck)?.name || 'Truck'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard/tracking")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Create Tracking Assignment</span>
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

export default TrackMission; 