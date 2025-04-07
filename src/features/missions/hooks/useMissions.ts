import { useState, useCallback } from 'react';
import { Mission, MissionStatus } from '../types/mission.types';
import { missionsService } from '../services/missions.service';
import { useToast } from '@/components/ui/use-toast';

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  //vendor missions
  const fetchMissions = useCallback(async (status?: MissionStatus) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await missionsService.getVendorMissions({
        status: status as MissionStatus
        
      });
      
      setMissions(data);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getMissionById = useCallback(async (id: string) => {
    try {
      return await missionsService.getMissionById(id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return {
    missions,
    isLoading,
    error,
    fetchMissions,
    getMissionById
  };
};

