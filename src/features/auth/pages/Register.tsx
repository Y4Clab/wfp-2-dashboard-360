import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vendorTypes = [
  { value: "food-supplier", label: "Food Supplier" },
  { value: "logistics", label: "Logistics Provider" },
  { value: "transport", label: "Transport Company" },
  { value: "warehouse", label: "Warehouse Provider" },
  { value: "packaging", label: "Packaging Supplier" },
  { value: "other", label: "Other" }
];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [vendorType, setVendorType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!vendorType) {
      setError("Please select a vendor type");
      return;
    }
    
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Account created successfully!",
        description: "You can now log in to your account.",
      });
      
      navigate("/login");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - Registration form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Link to="/" className="inline-block mb-8">
              <div className="flex items-center justify-center mx-auto h-12 w-12 rounded-xl bg-wfp-blue text-white font-bold text-lg">
                WFP
              </div>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground mb-8">
              Start managing your fleet operations today
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required />
              </div>

              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" type="text" placeholder="Your Company Ltd." required />
              </div>

              <div>
                <Label htmlFor="vendorType">Vendor Type</Label>
                <Select value={vendorType} onValueChange={setVendorType} required>
                  <SelectTrigger id="vendorType">
                    <SelectValue placeholder="Select vendor type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendorTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@company.com" required />
              </div>

              <div>
                <Label htmlFor="fleetSize">Fleet Size</Label>
                <Input id="fleetSize" type="number" placeholder="Number of vehicles" required />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
              </div>

              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-wfp-blue hover:underline">
                Sign in
              </Link>
            </p>
          </motion.form>
        </div>
      </div>

      {/* Right panel - Image and info */}
      <div className="hidden md:flex md:w-1/2 bg-wfp-blue relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="WFP Operations"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-md text-center"
          >
            <h2 className="text-3xl font-bold mb-6">
              Join our global mission
            </h2>
            <p className="text-white/80 mb-8">
              Help us deliver food to those who need it most. Partner with the World Food Programme to make a difference.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                "Fleet management",
                "Real-time tracking",
                "Mission planning",
                "Resource allocation",
                "Performance metrics",
                "Compliance monitoring"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register; 