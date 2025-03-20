
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';

const vendorData = [
  { name: 'Global Foods', successRate: 94, onTimeRate: 88, efficiency: 92 },
  { name: 'Med Supplies', successRate: 97, onTimeRate: 95, efficiency: 96 },
  { name: 'Water Systems', successRate: 91, onTimeRate: 82, efficiency: 87 },
  { name: 'BuildEx', successRate: 89, onTimeRate: 79, efficiency: 84 },
  { name: 'Tech Logistics', successRate: 95, onTimeRate: 91, efficiency: 93 }
];

const tripData = [
  { name: 'Region A', success: 92, delay: 8 },
  { name: 'Region B', success: 87, delay: 13 },
  { name: 'Region C', success: 95, delay: 5 },
  { name: 'Region D', success: 83, delay: 17 },
  { name: 'Region E', success: 90, delay: 10 }
];

type DataType = 'vendor' | 'trip';

const PerformanceMetrics = () => {
  const [dataType, setDataType] = useState<DataType>('vendor');
  
  return (
    <Card className="hover-scale">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              {dataType === 'vendor' ? 'Vendor performance ratings' : 'Trip success rates by region'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={dataType === 'vendor' ? 'default' : 'outline'}
              onClick={() => setDataType('vendor')}
            >
              Vendors
            </Button>
            <Button
              size="sm"
              variant={dataType === 'trip' ? 'default' : 'outline'}
              onClick={() => setDataType('trip')}
            >
              Trips
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {dataType === 'vendor' ? (
              <BarChart data={vendorData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis unit="%" domain={[60, 100]} />
                <Tooltip
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Bar dataKey="successRate" name="Success Rate" fill="#0A77BF" />
                <Bar dataKey="onTimeRate" name="On-Time Rate" fill="#5FB3E4" />
                <Bar dataKey="efficiency" name="Efficiency" fill="#075A89" />
              </BarChart>
            ) : (
              <BarChart data={tripData} stackOffset="expand" layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" unit="%" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" />
                <Tooltip
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                    border: 'none'
                  }}
                />
                <Legend />
                <Bar dataKey="success" name="Success Rate" fill="#4CAF50" stackId="a" />
                <Bar dataKey="delay" name="Delay Rate" fill="#FF9800" stackId="a" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
