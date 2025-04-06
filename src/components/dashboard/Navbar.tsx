import { Bell, LogOut, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/auth/context/AuthContext";
import { cn } from "@/lib/utils";
interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar = ({  toggleSidebar }: NavbarProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const isVendor = user?.user_role.role_name === "vendor";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-subtle border-b h-16">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <Link to="/dashboard" className="flex items-center gap-2 mr-8">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-wfp-blue text-white font-semibold">
              WFP
            </div>
            <span className="text-lg font-semibold hidden md:block">
              {isVendor ? "Vendor Portal" : "WFP Admin"}
            </span>
          </Link>
        </div>

        <div className="flex-1 flex justify-end md:justify-center">
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%", maxWidth: "600px" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Input
                  autoFocus
                  placeholder={
                    isVendor
                      ? "Search your missions..."
                      : "Search missions, vendors..."
                  }
                  className="w-full rounded-full pr-10"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="hidden md:flex md:items-center"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem
                    key={i}
                    className="flex flex-col items-start py-2 cursor-pointer"
                  >
                    <p className="font-medium">
                      {isVendor
                        ? `Mission Update #${i}`
                        : `System Update #${i}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isVendor
                        ? `Your truck TRK-${i}234 has arrived at checkpoint ${i}.`
                        : `New vendor registration pending approval.`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {i}0 minutes ago
                    </p>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium text-wfp-blue">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

         
          <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-2 justify-center hover:bg-red-50 hover:text-red-600"
          )}
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
           
             
             
        </div>
      </div>
    </header>
  );
};

export default Navbar;
