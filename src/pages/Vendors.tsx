
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ChevronsUpDown, 
  Filter, 
  MoreHorizontal, 
  RefreshCw, 
  Search, 
  Trash, 
  UserPlus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data for vendors
const vendorsData = [
  {
    id: "V-001",
    name: "Global Food Solutions",
    type: "Food Supplier",
    location: "Nairobi, Kenya",
    contact: "John Doe",
    email: "john@globalfood.com",
    phone: "+254 712 345 678",
    status: "approved",
    rating: 4.8,
    lastDelivery: "2023-07-12",
  },
  {
    id: "V-002",
    name: "MedTech Logistics",
    type: "Medical Supplier",
    location: "Kampala, Uganda",
    contact: "Jane Smith",
    email: "jane@medtech.com",
    phone: "+256 782 123 456",
    status: "approved",
    rating: 4.5,
    lastDelivery: "2023-07-10",
  },
  {
    id: "V-003",
    name: "BuildEx Construction",
    type: "Construction Materials",
    location: "Mogadishu, Somalia",
    contact: "Ahmed Hassan",
    email: "ahmed@buildex.com",
    phone: "+252 612 789 012",
    status: "pending",
    rating: 3.9,
    lastDelivery: "2023-07-05",
  },
  {
    id: "V-004",
    name: "Pure Water Inc.",
    type: "Water Supplier",
    location: "Addis Ababa, Ethiopia",
    contact: "Mebratu Tekle",
    email: "mebratu@purewater.com",
    phone: "+251 912 345 678",
    status: "approved",
    rating: 4.7,
    lastDelivery: "2023-07-08",
  },
  {
    id: "V-005",
    name: "FarmFresh Produce",
    type: "Food Supplier",
    location: "Dar es Salaam, Tanzania",
    contact: "Grace Mwangi",
    email: "grace@farmfresh.com",
    phone: "+255 763 456 789",
    status: "approved",
    rating: 4.3,
    lastDelivery: "2023-07-11",
  },
  {
    id: "V-006",
    name: "MobileTech Communications",
    type: "Communications",
    location: "Kigali, Rwanda",
    contact: "Pascal Uwimana",
    email: "pascal@mobiletech.com",
    phone: "+250 783 567 890",
    status: "suspended",
    rating: 3.2,
    lastDelivery: "2023-06-30",
  },
  {
    id: "V-007",
    name: "SafeShelter Solutions",
    type: "Construction Materials",
    location: "Juba, South Sudan",
    contact: "David Malek",
    email: "david@safeshelter.com",
    phone: "+211 928 901 234",
    status: "pending",
    rating: 4.0,
    lastDelivery: "2023-07-02",
  },
  {
    id: "V-008",
    name: "AfricanTech Energy",
    type: "Energy & Power",
    location: "Nairobi, Kenya",
    contact: "Amina Osman",
    email: "amina@africantech.com",
    phone: "+254 722 345 678",
    status: "approved",
    rating: 4.6,
    lastDelivery: "2023-07-09",
  },
];

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter function
  const filteredVendors = vendorsData.filter((vendor) => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchLower) ||
      vendor.location.toLowerCase().includes(searchLower) ||
      vendor.contact.toLowerCase().includes(searchLower) ||
      vendor.email.toLowerCase().includes(searchLower);
    
    // Status filter
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    
    // Type filter
    const matchesType = typeFilter === "all" || vendor.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Sort function
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    let fieldA = a[sortField as keyof typeof a];
    let fieldB = b[sortField as keyof typeof b];
    
    if (typeof fieldA === 'string') {
      fieldA = fieldA.toLowerCase();
      fieldB = (fieldB as string).toLowerCase();
    }
    
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  
  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Refresh function
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Get unique vendor types for filter
  const vendorTypes = Array.from(new Set(vendorsData.map(vendor => vendor.type)));
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold mb-1">Vendor Management</h1>
          <p className="text-muted-foreground">
            Manage your suppliers and partners
          </p>
        </motion.div>
        
        <motion.div variants={item}>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Add Vendor</span>
          </Button>
        </motion.div>
      </div>
      
      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Vendor Directory</CardTitle>
            <CardDescription>
              View and manage all your registered vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-48">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="all">All Types</SelectItem>
                      {vendorTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { setSearchTerm(""); setStatusFilter("all"); setTypeFilter("all"); }}>
                      Clear all filters
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortField("rating")}>
                      Sort by rating
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortField("lastDelivery")}>
                      Sort by last delivery
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]" onClick={() => toggleSort("id")}>
                      <div className="flex items-center cursor-pointer">
                        ID
                        {sortField === "id" && (
                          <ChevronsUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort("name")}>
                      <div className="flex items-center cursor-pointer">
                        Vendor
                        {sortField === "name" && (
                          <ChevronsUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort("type")}>
                      <div className="flex items-center cursor-pointer">
                        Type
                        {sortField === "type" && (
                          <ChevronsUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort("location")}>
                      <div className="flex items-center cursor-pointer">
                        Location
                        {sortField === "location" && (
                          <ChevronsUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort("status")}>
                      <div className="flex items-center cursor-pointer">
                        Status
                        {sortField === "status" && (
                          <ChevronsUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead onClick={() => toggleSort("rating")}>
                      <div className="flex items-center cursor-pointer">
                        Rating
                        {sortField === "rating" && (
                          <ChevronsUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedVendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No vendors found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedVendors.map((vendor) => (
                      <TableRow key={vendor.id} className="hover-scale">
                        <TableCell className="font-medium">{vendor.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vendor.name}</div>
                            <div className="text-xs text-muted-foreground">{vendor.contact}</div>
                          </div>
                        </TableCell>
                        <TableCell>{vendor.type}</TableCell>
                        <TableCell>{vendor.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              vendor.status === "approved" ? "default" :
                              vendor.status === "pending" ? "outline" : "destructive"
                            }
                            className={
                              vendor.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                              vendor.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : ""
                            }
                          >
                            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2">{vendor.rating.toFixed(1)}</span>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-wfp-blue"
                                style={{ width: `${(vendor.rating / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <Link to={`/dashboard/vendors/${vendor.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Table Footer */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{sortedVendors.length}</span> of{" "}
                <span className="font-medium">{vendorsData.length}</span> vendors
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <Select defaultValue="10">
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent side="top">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    disabled
                  >
                    <span className="sr-only">Go to previous page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <path
                        d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    disabled
                  >
                    <span className="sr-only">Go to next page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <path
                        d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67627 12.0433 6.86514 11.8419L10.6151 7.84188C10.7954 7.64955 10.7954 7.35027 10.6151 7.15794L6.86514 3.15794C6.67627 2.95648 6.35986 2.94628 6.1584 3.13514Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Vendors;
