
import { AlertCircle, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface IncidentProps {
  id: string;
  type: 'accident' | 'theft' | 'breakdown' | 'delay';
  location: string;
  time: string;
  mission: string;
  vendor: string;
  severity: 'high' | 'medium' | 'low';
}

const incidents: IncidentProps[] = [
  {
    id: 'INC-001',
    type: 'breakdown',
    location: 'Nairobi Highway, KM 45',
    time: '35 mins ago',
    mission: 'M-7890',
    vendor: 'Global Foods',
    severity: 'medium'
  },
  {
    id: 'INC-002',
    type: 'delay',
    location: 'Mombasa Road Checkpoint',
    time: '1 hour ago',
    mission: 'M-7892',
    vendor: 'Med Supplies Inc',
    severity: 'low'
  },
  {
    id: 'INC-003',
    type: 'accident',
    location: 'Garissa Junction',
    time: '2 hours ago',
    mission: 'M-7885',
    vendor: 'Water Systems',
    severity: 'high'
  },
  {
    id: 'INC-004',
    type: 'theft',
    location: 'Nakuru Distribution Center',
    time: '3 hours ago',
    mission: 'M-7882',
    vendor: 'BuildEx',
    severity: 'high'
  }
];

const getIncidentIcon = (type: IncidentProps['type']) => {
  switch (type) {
    case 'accident':
      return <AlertCircle className="h-5 w-5" />;
    case 'theft':
      return <AlertTriangle className="h-5 w-5" />;
    case 'breakdown':
      return <AlertCircle className="h-5 w-5" />;
    case 'delay':
      return <Clock className="h-5 w-5" />;
  }
};

const getIncidentColor = (severity: IncidentProps['severity']) => {
  switch (severity) {
    case 'high':
      return {
        bg: 'bg-red-100',
        text: 'text-red-600',
        badge: 'bg-red-100 text-red-800'
      };
    case 'medium':
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-600',
        badge: 'bg-amber-100 text-amber-800'
      };
    case 'low':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800'
      };
  }
};

const IncidentReports = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Incident Reports</CardTitle>
            <CardDescription>Active alerts requiring attention</CardDescription>
          </div>
          <Link to="/dashboard/incidents">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incidents.map((incident) => {
            const colorScheme = getIncidentColor(incident.severity);
            
            return (
              <div key={incident.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${colorScheme.bg} ${colorScheme.text}`}>
                  {getIncidentIcon(incident.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">
                      {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)} - {incident.id}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorScheme.badge}`}>
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {incident.location}
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      Mission: {incident.mission} • {incident.vendor}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {incident.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link to="/dashboard/incidents/new">
            <Button className="w-full">Report New Incident</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentReports;
