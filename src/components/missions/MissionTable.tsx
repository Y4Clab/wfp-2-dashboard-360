import { Link } from "react-router-dom";
import { Calendar, Check, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mission } from "@/types/mission";

interface MissionTableProps {
  missions: Mission[];
  loading: boolean;
  error: string | null;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-blue-100 text-blue-800";
    case "completed": return "bg-green-100 text-green-800";
    case "pending": return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const MissionTable = ({ missions, loading, error }: MissionTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Mission</TableHead>
            <TableHead className="hidden md:table-cell">From</TableHead>
            <TableHead className="hidden md:table-cell">To</TableHead>
            <TableHead className="hidden lg:table-cell">End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Type</TableHead>
            <TableHead className="hidden lg:table-cell">Beneficiaries</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span>Loading missions...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : missions.length > 0 ? (
            missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.id ? mission.id : 'N/A'}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{mission.title || 'Untitled Mission'}</p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{mission.type || 'No Type'}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{mission.dept_location || 'N/A'}</TableCell>
                <TableCell className="hidden md:table-cell">{mission.destination_location || 'N/A'}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{mission.end_date ? new Date(mission.end_date).toLocaleDateString() : 'No date'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(mission.status || 'pending')}>
                    {mission.status === "active" ? (
                      <Clock className="h-3 w-3 mr-1" />
                    ) : mission.status === "completed" ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <Calendar className="h-3 w-3 mr-1" />
                    )}
                    {(mission.status || 'pending').charAt(0).toUpperCase() + (mission.status || 'pending').slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">
                    {mission.type ? mission.type.charAt(0).toUpperCase() + mission.type.slice(1) : 'No Type'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {mission.number_of_beneficiaries || 0}
                </TableCell>
                <TableCell>
                  <Link to={`/dashboard/missions/${mission.unique_id}`}>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No missions found matching your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MissionTable; 