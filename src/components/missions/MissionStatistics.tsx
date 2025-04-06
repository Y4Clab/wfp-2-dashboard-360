import { Mission } from "@/features/missions/types/mission.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MissionStatisticsProps {
  missions: Mission[];
  loading: boolean;
}

const MissionStatistics = ({ missions, loading }: MissionStatisticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mission Statistics</CardTitle>
        <CardDescription>Overview of mission status and distribution</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-medium mb-2">Status Distribution</h4>
            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Active Missions</span>
                      <span className="text-sm font-medium">
                        {missions.filter(m => m.status === 'active').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: missions.length ? 
                            `${(missions.filter(m => m.status === 'active').length / missions.length) * 100}%` : 
                            "0%" 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Completed Missions</span>
                      <span className="text-sm font-medium">
                        {missions.filter(m => m.status === 'completed').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: missions.length ? 
                            `${(missions.filter(m => m.status === 'completed').length / missions.length) * 100}%` : 
                            "0%" 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Pending Missions</span>
                      <span className="text-sm font-medium">
                        {missions.filter(m => m.status === 'pending').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full" 
                        style={{ 
                          width: missions.length ? 
                            `${(missions.filter(m => m.status === 'pending').length / missions.length) * 100}%` : 
                            "0%" 
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Mission Types</h4>
            <div className="space-y-2">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Regular</span>
                      <span className="text-sm font-medium">
                        {missions.filter(m => m.type === 'regular').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ 
                          width: missions.length ? 
                            `${(missions.filter(m => m.type === 'regular').length / missions.length) * 100}%` : 
                            "0%" 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Emergency</span>
                      <span className="text-sm font-medium">
                        {missions.filter(m => m.type === 'emergency').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pink-600 h-2 rounded-full" 
                        style={{ 
                          width: missions.length ? 
                            `${(missions.filter(m => m.type === 'emergency').length / missions.length) * 100}%` : 
                            "0%" 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Specialized</span>
                      <span className="text-sm font-medium">
                        {missions.filter(m => m.type === 'specialized').length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ 
                          width: missions.length ? 
                            `${(missions.filter(m => m.type === 'specialized').length / missions.length) * 100}%` : 
                            "0%" 
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionStatistics; 