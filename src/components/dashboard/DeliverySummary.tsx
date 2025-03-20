
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DeliverySummaryCardProps {
  title: string;
  count: number;
  total: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const DeliverySummaryCard = ({ title, count, total, icon, color, bgColor }: DeliverySummaryCardProps) => {
  const percentage = Math.round((count / total) * 100);
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-sm">{title}</h3>
        <div className={`${bgColor} ${color} p-1.5 rounded-full`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold">{count}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{percentage}% of total</span>
        <span className="font-medium">{total} total</span>
      </div>
      <Progress
        value={percentage}
        className={`h-1.5 ${color.replace('text-', 'bg-').replace('-600', '-200')}`}
      />
    </div>
  );
};

const DeliverySummary = () => {
  const summaryData = {
    active: 24,
    completed: 187,
    delayed: 8,
    total: 219
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Summary</CardTitle>
        <CardDescription>
          Current status of all delivery missions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DeliverySummaryCard
            title="Active Deliveries"
            count={summaryData.active}
            total={summaryData.total}
            icon={<Clock className="h-4 w-4" />}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          
          <DeliverySummaryCard
            title="Completed"
            count={summaryData.completed}
            total={summaryData.total}
            icon={<CheckCircle className="h-4 w-4" />}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          
          <DeliverySummaryCard
            title="Delayed"
            count={summaryData.delayed}
            total={summaryData.total}
            icon={<AlertTriangle className="h-4 w-4" />}
            color="text-amber-600"
            bgColor="bg-amber-100"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliverySummary;
