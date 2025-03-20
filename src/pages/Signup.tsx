
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("wfp-admin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Store user info in localStorage for demo
      localStorage.setItem('user', JSON.stringify({
        name,
        email,
        role,
        isLoggedIn: true
      }));
      
      toast({
        title: "Account created successfully!",
        description: `You've been registered as a ${getRoleName(role)}.`,
      });
      
      // Redirect based on role
      switch(role) {
        case "wfp-admin":
          navigate("/dashboard");
          break;
        case "vendor":
          navigate("/vendor-dashboard");
          break;
        case "driver":
          navigate("/driver-dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleName = (role: string) => {
    switch(role) {
      case "wfp-admin": return "WFP Admin";
      case "vendor": return "Vendor";
      case "driver": return "Driver";
      default: return role;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel - Signup form */}
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
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground mb-8">
              Join the WFP Operations Platform
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
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Select your role</Label>
              <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                  <RadioGroupItem value="wfp-admin" id="wfp-admin" />
                  <Label htmlFor="wfp-admin" className="font-medium cursor-pointer flex-1">WFP Admin</Label>
                  <span className="text-xs text-muted-foreground">Manage operations & resources</span>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                  <RadioGroupItem value="vendor" id="vendor" />
                  <Label htmlFor="vendor" className="font-medium cursor-pointer flex-1">Vendor</Label>
                  <span className="text-xs text-muted-foreground">Provide services & trucks</span>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                  <RadioGroupItem value="driver" id="driver" />
                  <Label htmlFor="driver" className="font-medium cursor-pointer flex-1">Driver</Label>
                  <span className="text-xs text-muted-foreground">Deliver food & supplies</span>
                </div>
              </RadioGroup>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
            
            <div className="text-center text-sm">
              Already have an account? {" "}
              <Link to="/login" className="text-wfp-blue hover:underline">
                Sign in
              </Link>
            </div>
          </motion.form>
        </div>
      </div>
      
      {/* Right panel - Image and info */}
      <div className="hidden md:flex md:w-1/2 bg-wfp-blue relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
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
                "Mission coordination",
                "Vendor management",
                "Fleet tracking",
                "Delivery planning",
                "Performance analytics",
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

export default Signup;
