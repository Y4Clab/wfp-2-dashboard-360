
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import VendorDetail from "./pages/VendorDetail";
import VendorNew from "./pages/VendorNew";
import Trucks from "./pages/Trucks";
import Missions from "./pages/Missions";
import MissionDetail from "./pages/MissionDetail";
import MissionNew from "./pages/MissionNew";
import Analytics from "./pages/Analytics";
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
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              
              {/* Vendor Routes */}
              <Route path="vendors" element={<Vendors />} />
              <Route path="vendors/new" element={<VendorNew />} />
              <Route path="vendors/:id" element={<VendorDetail />} />
              <Route path="vendors/risk" element={<NotFound />} />
              
              {/* Truck Routes */}
              <Route path="trucks" element={<Trucks />} />
              <Route path="trucks/new" element={<NotFound />} />
              <Route path="trucks/maintenance" element={<NotFound />} />
              <Route path="trucks/:id" element={<NotFound />} />
              
              {/* Mission Routes */}
              <Route path="missions" element={<Missions />} />
              <Route path="missions/new" element={<MissionNew />} />
              <Route path="missions/:id" element={<MissionDetail />} />
              
              {/* Tracking Routes */}
              <Route path="tracking" element={<NotFound />} />
              <Route path="tracking/geofencing" element={<NotFound />} />
              <Route path="tracking/history" element={<NotFound />} />
              
              {/* Analytics Routes */}
              <Route path="analytics" element={<Analytics />} />
              <Route path="analytics/export" element={<NotFound />} />
              <Route path="analytics/predictions" element={<NotFound />} />
              
              {/* Incidents Routes */}
              <Route path="incidents" element={<NotFound />} />
              <Route path="incidents/new" element={<NotFound />} />
              <Route path="incidents/compliance" element={<NotFound />} />
              <Route path="incidents/risk" element={<NotFound />} />
              
              {/* Admin Routes */}
              <Route path="admin" element={<NotFound />} />
              <Route path="admin/roles" element={<NotFound />} />
              <Route path="admin/security" element={<NotFound />} />
              
              {/* Settings */}
              <Route path="settings" element={<NotFound />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
