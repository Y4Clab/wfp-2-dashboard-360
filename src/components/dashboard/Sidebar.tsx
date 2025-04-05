import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  ClipboardList, 
  Home, 
  Map, 
  Settings,
  ShieldAlert,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  User,
  FileWarning,
  Car
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isOpen: boolean;
  isActive: boolean;
  subItems?: { label: string; to: string }[];
}

const NavItem = ({ icon: Icon, label, to, isOpen, isActive, subItems }: NavItemProps) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;
  
  return (
    <div className="mb-1">
      <Link
        to={hasSubItems ? "#" : to}
        onClick={(e) => {
          if (hasSubItems) {
            e.preventDefault();
            setIsSubMenuOpen(!isSubMenuOpen);
          }
        }}
        className={cn(
          "flex items-center group px-3 py-2 rounded-lg transition-colors relative overflow-hidden",
          isActive ? "bg-wfp-blue text-white" : "hover:bg-wfp-blue/10"
        )}
      >
        <div className="flex items-center flex-1">
          <Icon
            className={cn(
              "h-5 w-5",
              isActive ? "text-white" : "text-wfp-blue group-hover:text-wfp-blue"
            )}
          />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-3 whitespace-nowrap font-medium"
            >
              {label}
            </motion.span>
          )}
        </div>
        
        {isOpen && hasSubItems && (
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isSubMenuOpen && "transform rotate-180"
            )}
          />
        )}
      </Link>
      
      {/* Submenu */}
      {isOpen && hasSubItems && (
        <AnimatePresence>
          {isSubMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden ml-2 pl-4 border-l border-wfp-blue/20"
            >
              {subItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center text-sm py-2 px-3 mt-1 rounded-lg hover:bg-wfp-blue/10 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      to: "/dashboard" 
    },
    { 
      icon: Users, 
      label: "Vendor Management", 
      to: "/dashboard/vendors",
      subItems: [
        { label: "All Vendors", to: "/dashboard/vendors" },
        { label: "Add New Vendor", to: "/dashboard/vendors/new" }
      ]
    },
    { 
      icon: Car, 
      label: "Trucks", 
      to: "/dashboard/trucks",
      subItems: [
        { label: "All Vehicles", to: "/dashboard/trucks" },
        { label: "Add New Vehicle", to: "/dashboard/trucks/new" },
        { label: "Track Mission", to: "/dashboard/tracking/new" },
        { label: "Service Records", to: "/dashboard/trucks/service" }
      ]
    },
    { 
      icon: ClipboardList, 
      label: "Missions", 
      to: "/dashboard/missions",
      subItems: [
        { label: "All Missions", to: "/dashboard/missions" },
        { label: "Active Missions", to: "/dashboard/missions?status=active" },
        { label: "Completed", to: "/dashboard/missions?status=completed" },
        { label: "Create Mission", to: "/dashboard/missions/new" }
      ]
    },
    { 
      icon: Map, 
      label: "Live Tracking", 
      to: "/dashboard/tracking",
      subItems: [
        { label: "Live Map", to: "/dashboard/tracking" },
        { label: "Geofencing", to: "/dashboard/tracking/geofencing" }
      ]
    },
    { 
      icon: BarChart3, 
      label: "Analytics", 
      to: "/dashboard/analytics",
      subItems: [
        { label: "Performance Metrics", to: "/dashboard/analytics" },
        { label: "Export Reports", to: "/dashboard/analytics/export" }
      ]
    },
    { 
      icon: FileWarning, 
      label: "Incidents", 
      to: "/dashboard/incidents",
      subItems: [
        { label: "Incident Reports", to: "/dashboard/incidents" },
        { label: "Compliance Logs", to: "/dashboard/incidents/compliance" }
      ]
    },
    { 
      icon: ShieldAlert, 
      label: "Admin", 
      to: "/dashboard/admin",
      subItems: [
        { label: "User Management", to: "/dashboard/admin" },
        { label: "Role Assignment", to: "/dashboard/admin/roles" }
      ]
    },
    { 
      icon: Settings, 
      label: "Settings", 
      to: "/dashboard/settings" 
    },
    { 
      icon: User, 
      label: "Profile", 
      to: "/dashboard/profile" 
    },
  ];
  
  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isOpen ? 280 : 80,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      className="h-full fixed left-0 top-0 z-20 pt-20 bg-white shadow-subtle flex flex-col"
    >
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isOpen={isOpen}
              isActive={
                currentPath === item.to || 
                (item.subItems && item.subItems.some(sub => currentPath.includes(sub.to.split('?')[0])))
              }
              subItems={item.subItems}
            />
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <Link to="/dashboard/profile" className={cn(
          "flex items-center p-3 transition-all rounded-lg hover:bg-wfp-blue/10",
          isOpen ? "justify-start" : "justify-center"
        )}>
          <img 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            alt="User"
            className="h-8 w-8 rounded-full border-2 border-wfp-blue" 
          />
          
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="ml-3 overflow-hidden"
            >
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </motion.div>
          )}
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
