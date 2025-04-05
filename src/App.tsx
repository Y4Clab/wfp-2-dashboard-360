import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Login from "./features/auth/pages/Login";

import Register from "./features/auth/pages/Register";
import Dashboard from "./pages/Dashboard";
import Vendors from "./features/vendors/pages/Vendors";
import VendorDetail from "./features/vendors/pages/VendorDetail";
import VendorNew from "./features/vendors/pages/VendorNew";
import VendorForm from "./features/vendors/pages/VendorForm";
import Trucks from "./features/trucks/pages/Trucks";
import TrucksForm from "./features/trucks/pages/TrucksForm";
import Missions from "./features/missions/pages/Missions";
import MissionDetail from "./features/missions/pages/MissionDetail";
import MissionNew from "./features/missions/pages/MissionNew";
import MissionForm from "./features/missions/pages/MissionForm";
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
            
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              
              {/* Vendor Routes */}
              <Route path="vendors" element={<Vendors />} />
              <Route path="vendors/new" element={<VendorNew />} />
              <Route path="vendors/:id" element={<VendorDetail />} />
              <Route path="vendors/:id/edit" element={<VendorForm />} />
              
              {/* Truck Routes */}
              <Route path="trucks" element={<Trucks />} />
              <Route path="trucks/new" element={<TrucksForm />} />
              <Route path="trucks/:id" element={<NotFound />} />
              
              {/* Mission Routes */}
              <Route path="missions" element={<Missions />} />
              <Route path="missions/new" element={<MissionForm />} />
              <Route path="missions/:id" element={<MissionDetail />} />
              <Route path="missions/:id/edit" element={<MissionForm />} />
              
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
            <Route path="/vendor-dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/driver-dashboard" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
