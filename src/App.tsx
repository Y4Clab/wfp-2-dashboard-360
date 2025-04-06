import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/features/auth/context/AuthContext";

// Layouts
import DashboardLayout from "@/layouts/DashboardLayout";

// Auth
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";

// Features
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Vendors from "@/features/vendors/pages/Vendors";
import VendorDetail from "@/features/vendors/pages/VendorDetail";
import VendorNew from "@/features/vendors/pages/VendorNew";
import VendorForm from "@/features/vendors/pages/VendorForm";
import Trucks from "@/features/trucks/pages/Trucks";
import TrucksForm from "@/features/trucks/pages/TrucksNew";
import Missions from "@/features/missions/pages/Missions";
import MissionDetail from "@/features/missions/pages/MissionDetail";
import MissionNew from "@/features/missions/pages/MissionNew";
import MissionForm from "@/features/missions/pages/MissionForm";
import VendorMissions from "@/features/missions/pages/VendorMissions";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import LiveTracking from "@/pages/LiveTracking";
import NotFound from "@/pages/NotFound";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
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
                
                {/* Vendor-specific Routes */}
                <Route path="vendor/missions" element={<VendorMissions />} />
                <Route path="vendor/missions/:id" element={<MissionDetail />} />
                
                {/* Tracking Routes */}
                <Route path="tracking" element={<LiveTracking />} />
                <Route path="tracking/geofencing" element={<NotFound />} />
                
                {/* Analytics Routes */}
                <Route path="analytics" element={<Analytics />} />
                <Route path="analytics/export" element={<NotFound />} />
                
                {/* Settings & Profile */}
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
