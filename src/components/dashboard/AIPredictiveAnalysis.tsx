import { useState } from 'react';
import { AlertTriangle, Brain, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface PredictionProps {
  id: string;
  type: 'delay' | 'risk' | 'demand';
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  actionable: boolean;
  mission?: string;
}  

const predictions: PredictionProps[] = [
  {
    id: 'PRED-001',
    type: 'delay',
    description: 'Mission M-7892 likely to be delayed by 45-60 minutes due to weather conditions',
    impact: 'negative',
    confidence: 87,
    actionable: true,
    mission: 'M-7892'
  },
  { 
    id: 'PRED-002',
    type: 'risk',
    description: 'Increased security risk detected on Route R-45 due to recent incidents',
    impact: 'negative',
    confidence: 92,
    actionable: true
  },
  {
    id: 'PRED-003',
    type: 'demand',
    description: 'Region C projected to need 15% more medical supplies next month',
    impact: 'neutral',
    confidence: 78,
    actionable: false
  },
  {
    id: 'PRED-004',
    type: 'delay',
    description: 'Mission M-7895 estimated to arrive 30 minutes ahead of schedule',
    impact: 'positive',
    confidence: 83,
    actionable: false,
    mission: 'M-7895'
  }
];

const getPredictionIcon = (type: PredictionProps['type'], impact: PredictionProps['impact']) => {
  if (type === 'risk') return <AlertTriangle className="h-5 w-5" />;
  if (impact === 'positive') return <TrendingUp className="h-5 w-5" />;
  if (impact === 'negative') return <TrendingDown className="h-5 w-5" />;
  return <Brain className="h-5 w-5" />;
};

const getPredictionColor = (impact: PredictionProps['impact']) => {
  switch (impact) {
    case 'positive':
      return {
        bg: 'bg-green-100',
        text: 'text-green-600',
        badge: 'bg-green-100 text-green-800'
      };
    case 'negative':
      return {
        bg: 'bg-red-100',
        text: 'text-red-600',
        badge: 'bg-red-100 text-red-800'
      };
    case 'neutral':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800'
      };
  }
};

const AIPredictiveAnalysis = () => {
  const [showAll, setShowAll] = useState(false);
  const displayPredictions = showAll ? predictions : predictions.slice(0, 2);
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-wfp-blue" />
              AI Predictive Analysis
            </CardTitle>
            <CardDescription>AI-generated insights and alerts</CardDescription>
          </div>
          <Link to="/dashboard/analytics/predictions">
            <Button variant="outline" size="sm">View Details</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayPredictions.map((prediction) => {
            const colorScheme = getPredictionColor(prediction.impact);
            
            return (
              <div key={prediction.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${colorScheme.bg} ${colorScheme.text}`}>
                  {getPredictionIcon(prediction.type, prediction.impact)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">
                      {prediction.type.charAt(0).toUpperCase() + prediction.type.slice(1)} Prediction
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorScheme.badge}`}>
                      {prediction.confidence}% confidence
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm text-muted-foreground">
                    {prediction.description}
                  </p>
                  
                  {prediction.mission && (
                    <div className="mt-2 text-xs">
                      <Link to={`/dashboard/missions/${prediction.mission}`} className="text-wfp-blue hover:underline">
                        View Mission {prediction.mission}
                      </Link>
                    </div>
                  )}
                  
                  {prediction.actionable && (
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Take Action
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {predictions.length > 2 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 w-full"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show ${predictions.length - 2} More Predictions`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPredictiveAnalysis;
