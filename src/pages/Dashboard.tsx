
import { motion } from "framer-motion";
import { 
  AlertCircle, 
  BarChart3, 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  Truck, 
  TruckIcon, 
  Users 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for charts
const areaData = [
  { name: "Jan", missions: 24, trucks: 18 },
  { name: "Feb", missions: 28, trucks: 22 },
  { name: "Mar", missions: 32, trucks: 25 },
  { name: "Apr", missions: 36, trucks: 30 },
  { name: "May", missions: 30, trucks: 25 },
  { name: "Jun", missions: 28, trucks: 24 },
  { name: "Jul", missions: 34, trucks: 28 },
];

const barData = [
  { name: "Region A", planned: 12, active: 8, completed: 20 },
  { name: "Region B", planned: 8, active: 4, completed: 15 },
  { name: "Region C", planned: 6, active: 6, completed: 12 },
  { name: "Region D", planned: 4, active: 2, completed: 10 },
];

const pieData = [
  { name: "Food", value: 45 },
  { name: "Medical", value: 25 },
  { name: "Shelter", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#0A77BF", "#5FB3E4", "#075A89", "#AECBD3"];

const Dashboard = () => {
  const stats = [
    { 
      title: "Active Missions", 
      value: "14", 
      change: "+2 from last week", 
      positive: true,
      icon: <CalendarClock className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    { 
      title: "Trucks Deployed", 
      value: "32", 
      change: "+5 from last week", 
      positive: true,
      icon: <Truck className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    { 
      title: "Active Vendors", 
      value: "18", 
      change: "No change", 
      positive: null,
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    { 
      title: "Supplies Delivered", 
      value: "3.2K", 
      change: "+12% from last month", 
      positive: true,
      icon: <PackageCheck className="h-5 w-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
  ];

  const recentMissions = [
    { 
      id: "M-7892", 
      name: "Food Distribution - Nairobi", 
      status: "active", 
      vendor: "Global Food Solutions", 
      date: "Today, 10:30 AM",
      progress: 65
    },
    { 
      id: "M-7891", 
      name: "Medical Supplies - Kampala", 
      status: "active", 
      vendor: "MedTech Logistics", 
      date: "Today, 9:15 AM",
      progress: 42
    },
    { 
      id: "M-7890", 
      name: "Shelter Materials - Mogadishu", 
      status: "completed", 
      vendor: "BuildEx Construction", 
      date: "Yesterday, 4:45 PM",
      progress: 100
    },
    { 
      id: "M-7889", 
      name: "Water Purification - Addis Ababa", 
      status: "completed", 
      vendor: "Pure Water Inc.", 
      date: "Yesterday, 2:30 PM",
      progress: 100
    },
  ];

  const alerts = [
    { 
      id: 1, 
      type: "warning", 
      message: "Truck TR-5678 delayed at checkpoint", 
      time: "10 minutes ago" 
    },
    { 
      id: 2, 
      type: "success", 
      message: "Mission M-7890 successfully completed", 
      time: "30 minutes ago" 
    },
    { 
      id: 3, 
      type: "warning", 
      message: "Low fuel alert for Truck TR-1234", 
      time: "45 minutes ago" 
    },
    { 
      id: 4, 
      type: "info", 
      message: "Vendor certification about to expire", 
      time: "1 hour ago" 
    },
  ];

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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, here's what's happening with your operations today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} ${stat.color} p-2 rounded-full`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.positive === true ? 'text-green-600' : stat.positive === false ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={item} className="md:col-span-2">
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle>Mission & Fleet Activity</CardTitle>
              <CardDescription>
                Overview of mission counts and truck activity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={areaData}
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
                    <Area
                      type="monotone"
                      dataKey="missions"
                      stroke="#0A77BF"
                      fill="#0A77BF"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="trucks"
                      stroke="#5FB3E4"
                      fill="#5FB3E4"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle>Missions by Region</CardTitle>
              <CardDescription>
                Distribution of mission status across regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
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
                    <Bar dataKey="planned" fill="#0A77BF" />
                    <Bar dataKey="active" fill="#5FB3E4" />
                    <Bar dataKey="completed" fill="#075A89" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle>Supply Categories</CardTitle>
              <CardDescription>
                Distribution of supply types delivered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Missions & Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Missions */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Missions</span>
                <TruckIcon className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                Latest mission activities and status updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMissions.map((mission) => (
                  <div key={mission.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                      ${mission.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      {mission.status === 'active' ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {mission.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {mission.vendor} • {mission.date}
                      </p>
                      
                      {mission.status === 'active' && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${mission.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${mission.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {mission.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Alerts</span>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                System notifications and important updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center 
                      ${alert.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                        alert.type === 'success' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'}`}>
                      {alert.type === 'warning' ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : alert.type === 'success' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
