import { Calendar, Check, Truck } from "lucide-react";
import { Mission } from "@/types/mission";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RecentMissionsProps {
  missions: Mission[];
  loading: boolean;
  error: string | null;
}

const RecentMissions = ({ missions, loading, error }: RecentMissionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Missions</CardTitle>
        <CardDescription>Latest missions created in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : missions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No missions found</div>
          ) : (
            [...missions]
              .filter(mission => mission.start_date !== null)
              .sort((a, b) => 
                new Date(b.start_date || 0).getTime() - new Date(a.start_date || 0).getTime()
              )
              .slice(0, 5)
              .map((mission) => (
                <div key={mission.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                    ${mission.status === 'active' ? 'bg-blue-100 text-blue-600' : 
                    mission.status === 'completed' ? 'bg-green-100 text-green-600' : 
                    'bg-amber-100 text-amber-600'}`}>
                    {mission.status === 'active' ? (
                      <Truck className="h-5 w-5" />
                    ) : mission.status === 'completed' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Calendar className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {mission.title || 'Untitled Mission'}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {mission.start_date ? new Date(mission.start_date).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {mission.description || `From ${mission.dept_location || 'Unknown'} to ${mission.destination_location || 'Unknown'}`}
                    </p>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMissions; 