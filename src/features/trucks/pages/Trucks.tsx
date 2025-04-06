import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTracks } from "@/features/trucks/hooks/useTracks";
import { Truck } from "../services/truckService";

const Trucks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trucks, isLoading, error, loadTrucks } = useTracks();
  const [filteredTrucks, setFilteredTrucks] = useState<Truck[]>([]);

  useEffect(() => {
    loadTrucks();
  }, [loadTrucks]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTrucks(trucks);
      return;
    }

    const filtered = trucks.filter((truck) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        truck.vehicle_name.toLowerCase().includes(searchLower) ||
        truck.plate_number.toLowerCase().includes(searchLower) ||
        truck.vendor.name.toLowerCase().includes(searchLower)
      );
    });

    setFilteredTrucks(filtered);
  }, [searchQuery, trucks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "maintenance": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trucks</h1>
        <Button onClick={() => navigate("/dashboard/trucks/new")}>
          Add New Truck
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Trucks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, plate number, vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading trucks...</p>
          </div>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredTrucks.length === 0 ? (
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              No trucks found. {user?.user_role.role_name === 'vendor' ? 'Add a new truck to get started.' : 'No trucks are currently registered.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Name</TableHead>
                <TableHead>Plate Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Vendor Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrucks.map((truck) => (
                <TableRow key={truck.id}>
                  <TableCell>{truck.vehicle_name}</TableCell>
                  <TableCell>{truck.plate_number}</TableCell>
                  <TableCell>{truck.vendor.name}</TableCell>
                  <TableCell>{truck.vendor.vendor_type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(truck.status)}>
                      {truck.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/dashboard/trucks/${truck.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Trucks;
