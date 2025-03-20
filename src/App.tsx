
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import VendorNew from "./pages/VendorNew";
import VendorForm from "./pages/VendorForm";
import Trucks from "./pages/Trucks";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/MissionDetail";
import MissionNew from "./pages/MissionNew";
import MissionForm from "./pages/MissionForm";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import LiveTracking from "./pages/LiveTracking";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              
              {/* Vendor Routes */}
              <Route path="vendors" element={<Vendors />} />
              <Route path="vendors/new" element={<VendorForm />} />
              <Route path="vendors/:id" element={<VendorDetail />} />
              
              {/* Truck Routes */}
              <Route path="trucks" element={<Trucks />} />
              <Route path="trucks/new" element={<NotFound />} />
              <Route path="trucks/:id" element={<NotFound />} />
              
              {/* Mission Routes */}
              <Route path="missions" element={<Missions />} />
              <Route path="missions/new" element={<MissionForm />} />
              <Route path="missions/:id" element={<MissionDetail />} />
              
              {/* Tracking Routes */}
              <Route path="tracking" element={<LiveTracking />} />
              <Route path="tracking/geofencing" element={<NotFound />} />
              
              {/* Analytics Routes */}
              <Route path="analytics" element={<Analytics />} />
              <Route path="analytics/export" element={<NotFound />} />
              
              {/* Incidents Routes */}
              <Route path="incidents" element={<NotFound />} />
              <Route path="incidents/compliance" element={<NotFound />} />
              
              {/* Admin Routes */}
              <Route path="admin" element={<NotFound />} />
              <Route path="admin/roles" element={<NotFound />} />
              
              {/* Settings & Profile */}
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Role-based dashboards */}
            <Route path="/vendor-dashboard" element={<NotFound />} />
            <Route path="/driver-dashboard" element={<NotFound />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
