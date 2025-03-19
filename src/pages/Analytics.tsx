
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Clock, 
  Download, 
  PieChart, 
  TrendingDown, 
  TrendingUp 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";

// Mock data for charts
const monthlyData = [
  { name: "Jan", missions: 45, trucks: 32, deliveries: 42 },
  { name: "Feb", missions: 52, trucks: 36, deliveries: 48 },
  { name: "Mar", missions: 48, trucks: 39, deliveries: 46 },
  { name: "Apr", missions: 61, trucks: 42, deliveries: 58 },
  { name: "May", missions: 55, trucks: 45, deliveries: 53 },
  { name: "Jun", missions: 67, trucks: 48, deliveries: 65 },
  { name: "Jul", missions: 60, trucks: 46, deliveries: 58 },
  { name: "Aug", missions: 63, trucks: 49, deliveries: 61 },
  { name: "Sep", missions: 71, trucks: 52, deliveries: 68 },
  { name: "Oct", missions: 68, trucks: 54, deliveries: 65 },
  { name: "Nov", missions: 72, trucks: 57, deliveries: 69 },
  { name: "Dec", missions: 78, trucks: 60, deliveries: 74 },
];

const weeklyData = [
  { name: "Mon", missions: 12, trucks: 10, deliveries: 11 },
  { name: "Tue", missions: 15, trucks: 12, deliveries: 14 },
  { name: "Wed", missions: 17, trucks: 13, deliveries: 16 },
  { name: "Thu", missions: 14, trucks: 11, deliveries: 13 },
  { name: "Fri", missions: 16, trucks: 12, deliveries: 15 },
  { name: "Sat", missions: 8, trucks: 6, deliveries: 7 },
  { name: "Sun", missions: 4, trucks: 3, deliveries: 3 },
];

const regionData = [
  { name: "East Africa", missions: 156, onTime: 142, delayed: 14 },
  { name: "West Africa", missions: 128, onTime: 112, delayed: 16 },
  { name: "North Africa", missions: 86, onTime: 75, delayed: 11 },
  { name: "Central Africa", missions: 94, onTime: 81, delayed: 13 },
  { name: "Southern Africa", missions: 72, onTime: 65, delayed: 7 },
];

const supplyTypeData = [
  { name: "Food", value: 45 },
  { name: "Medical", value: 25 },
  { name: "Shelter", value: 15 },
  { name: "Water", value: 10 },
  { name: "Education", value: 5 },
];

const vendorPerformanceData = [
  { name: "Global Food Solutions", rating: 4.8, missions: 32, onTime: 96 },
  { name: "MedTech Logistics", rating: 4.6, missions: 28, onTime: 93 },
  { name: "BuildEx Construction", rating: 4.3, missions: 24, onTime: 87 },
  { name: "Pure Water Inc.", rating: 4.7, missions: 20, onTime: 95 },
  { name: "NutriTech Solutions", rating: 4.5, missions: 18, onTime: 91 },
  { name: "Rapid Relief Partners", rating: 4.2, missions: 15, onTime: 85 },
  { name: "HealthFirst Logistics", rating: 4.9, missions: 12, onTime: 97 },
];

const predictionData = [
  { name: "Week 1", actual: 24, predicted: 23 },
  { name: "Week 2", actual: 28, predicted: 27 },
  { name: "Week 3", actual: 26, predicted: 28 },
  { name: "Week 4", actual: 32, predicted: 30 },
  { name: "Week 5", actual: 30, predicted: 31 },
  { name: "Week 6", actual: 34, predicted: 33 },
  { name: "Week 7", actual: 32, predicted: 34 },
  { name: "Week 8", actual: 36, predicted: 35 },
  { name: "Week 9", actual: null, predicted: 38 },
  { name: "Week 10", actual: null, predicted: 36 },
  { name: "Week 11", actual: null, predicted: 39 },
  { name: "Week 12", actual: null, predicted: 41 },
];

const COLORS = ["#0A77BF", "#5FB3E4", "#075A89", "#AECBD3", "#66A3C2"];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly">("monthly");
  const chartData = timeRange === "weekly" ? weeklyData : monthlyData;
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Calculate summary metrics
  const getTrendData = () => {
    const data = monthlyData;
    const lastMonth = data[data.length - 1];
    const prevMonth = data[data.length - 2];
    
    const missionChange = ((lastMonth.missions - prevMonth.missions) / prevMonth.missions) * 100;
    const truckChange = ((lastMonth.trucks - prevMonth.trucks) / prevMonth.trucks) * 100;
    const deliveryChange = ((lastMonth.deliveries - prevMonth.deliveries) / prevMonth.deliveries) * 100;
    
    // Calculate on-time percentage
    const allMissions = regionData.reduce((sum, item) => sum + item.missions, 0);
    const onTimeMissions = regionData.reduce((sum, item) => sum + item.onTime, 0);
    const onTimePercentage = (onTimeMissions / allMissions) * 100;
    const onTimeChange = 2.3; // Mock data for change percentage
    
    return {
      missions: { value: lastMonth.missions, change: missionChange },
      trucks: { value: lastMonth.trucks, change: truckChange },
      deliveries: { value: lastMonth.deliveries, change: deliveryChange },
      onTime: { value: onTimePercentage.toFixed(1), change: onTimeChange }
    };
  };

  const trendData = getTrendData();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track performance metrics, trends, and insights
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          <span>Export Reports</span>
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Missions</p>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${trendData.missions.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {trendData.missions.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(trendData.missions.change).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold">{trendData.missions.value}</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">Active Trucks</p>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${trendData.trucks.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {trendData.trucks.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(trendData.trucks.change).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold">{trendData.trucks.value}</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">Deliveries</p>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${trendData.deliveries.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {trendData.deliveries.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(trendData.deliveries.change).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold">{trendData.deliveries.value}</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">On-Time Delivery</p>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${trendData.onTime.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {trendData.onTime.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(trendData.onTime.change).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold">{trendData.onTime.value}%</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mission & Fleet Activity</CardTitle>
                <CardDescription>
                  Mission counts and truck usage over time
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={timeRange === "weekly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("weekly")}
                >
                  Weekly
                </Button>
                <Button
                  variant={timeRange === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("monthly")}
                >
                  Monthly
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                      border: 'none'
                    }} 
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="missions"
                    stroke="#0A77BF"
                    fill="#0A77BF"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Missions"
                  />
                  <Area
                    type="monotone"
                    dataKey="trucks"
                    stroke="#5FB3E4"
                    fill="#5FB3E4"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Trucks Deployed"
                  />
                  <Area
                    type="monotone"
                    dataKey="deliveries"
                    stroke="#075A89"
                    fill="#075A89"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="Deliveries Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Mission Performance by Region</CardTitle>
              <CardDescription>
                Number of missions and on-time delivery rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={regionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                        border: 'none'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="onTime" name="On-Time" stackId="a" fill="#0A77BF" />
                    <Bar dataKey="delayed" name="Delayed" stackId="a" fill="#FC8181" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Supply Categories</CardTitle>
              <CardDescription>
                Distribution of supply types delivered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={supplyTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {supplyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                        border: 'none'
                      }}
                      formatter={(value) => [`${value}%`, 'Proportion']}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
            <CardDescription>
              Compare performance metrics across vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vendorPerformanceData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                      border: 'none'
                    }}
                    formatter={(value, name) => {
                      return [name === 'rating' ? `${value}/5` : `${value}%`, name === 'rating' ? 'Rating' : 'On-Time Delivery'];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="onTime" name="On-Time Delivery %" fill="#0A77BF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="predictions">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>AI Predictions</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="heatmaps">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Coverage Maps</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="predictions" className="mt-6">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>AI-Driven Mission Forecasts</CardTitle>
                <CardDescription>
                  Predictive analytics for mission volume and resource planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={predictionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                          border: 'none'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        name="Actual Missions"
                        stroke="#0A77BF" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        name="Predicted Missions"
                        stroke="#FC8181" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-800">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Predictions based on historical data and AI analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Risk Analysis</CardTitle>
                  <CardDescription>
                    AI-powered risk assessment for upcoming missions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-4">
                    {[
                      { id: "M-7887", name: "Emergency Food Aid - Khartoum", risk: "High", factors: ["Weather conditions", "Security concerns", "Road accessibility"] },
                      { id: "M-7888", name: "Nutrition Supplies - Juba", risk: "Medium", factors: ["Seasonal flooding", "Vendor reliability"] },
                      { id: "M-7892", name: "Food Distribution - Nairobi", risk: "Low", factors: ["Traffic congestion"] },
                      { id: "M-7891", name: "Medical Supplies - Kampala", risk: "Medium", factors: ["Road conditions", "Border delays"] },
                    ].map((item, index) => (
                      <div key={index} className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.id}: {item.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.factors.map((factor, i) => (
                                <span key={i} className="inline-flex text-xs px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full">
                                  {factor}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium 
                            ${item.risk === 'High' ? 'bg-red-100 text-red-800' : 
                            item.risk === 'Medium' ? 'bg-amber-100 text-amber-800' : 
                            'bg-green-100 text-green-800'}`}>
                            {item.risk} Risk
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>Resource Optimization</CardTitle>
                  <CardDescription>
                    AI recommendations for efficient resource allocation
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-4">
                    {[
                      { title: "Fleet Rebalancing", description: "Move 3 trucks from Southern region to Eastern region by end of week", priority: "High", saving: "15% fuel saving" },
                      { title: "Route Optimization", description: "Combine missions M-7891 and M-7886 for partial route overlap", priority: "Medium", saving: "12% time saving" },
                      { title: "Vendor Allocation", description: "Reassign Mission M-7888 to HealthFirst Logistics based on proximity", priority: "Medium", saving: "8% cost saving" },
                      { title: "Maintenance Scheduling", description: "Defer TR-1237 maintenance by 1 week to align with low demand period", priority: "Low", saving: "Avoid mission disruption" },
                    ].map((item, index) => (
                      <div key={index} className="p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium 
                            ${item.priority === 'High' ? 'bg-blue-100 text-blue-800' : 
                            item.priority === 'Medium' ? 'bg-purple-100 text-purple-800' : 
                            'bg-green-100 text-green-800'}`}>
                            {item.saving}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="heatmaps" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>Distribution Coverage Heatmap</CardTitle>
                  <CardDescription>
                    Geographical coverage of food distribution missions
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="flex items-center justify-center w-full h-80 bg-gray-100 rounded-lg">
                    <p className="text-muted-foreground">Coverage map visualization would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Analytics;
