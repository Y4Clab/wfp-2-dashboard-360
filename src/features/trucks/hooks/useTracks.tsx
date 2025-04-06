import { useState, useCallback } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { fetchTrucks, Truck } from '../services/truckService';


export const useTracks = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTrucks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchTrucks();
      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid trucks data received");
      }
      setTrucks(data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch trucks");
      toast({
        title: "Error",
        description: error.message || "Failed to fetch trucks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { trucks, isLoading, error, loadTrucks };
};

