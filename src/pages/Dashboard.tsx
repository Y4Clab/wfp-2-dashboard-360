import { motion } from "framer-motion";
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  Truck, 
  Users 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";

// Import our new components
import LiveTrackingMap from "@/components/dashboard/LiveTrackingMap";
import DeliverySummary from "@/components/dashboard/DeliverySummary";
import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics";
import IncidentReports from "@/components/dashboard/IncidentReports";
import AIPredictiveAnalysis from "@/components/dashboard/AIPredictiveAnalysis";
import { getMissions } from "@/features/missions/services/missionService";
import { useState } from "react";
import { useEffect } from "react";
import { Mission } from "@/features/missions/types/mission.types";
import { useVendors } from "@/features/vendors/hooks/useVendors";
import { useTracks } from "@/features/trucks/hooks/useTracks";

const Dashboard = () => {
  const { user } = useAuth();
  const isVendor = user?.user_role.role_name === 'vendor';
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: vendors } = useVendors();
  const { trucks , loadTrucks} = useTracks();
  useEffect(() => {
    loadTrucks();
  }, [loadTrucks]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const missions = await getMissions();
        setMissions(missions);
      } catch (error) {
        console.error('Error fetching missions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  // Calculate mission counts
  const activeMissions = missions.filter(mission => mission.status.toLowerCase() === 'active').length;
  const completedMissions = missions.filter(mission => mission.status.toLowerCase() === 'completed').length;

  const vendorStats = [
    {
      title: "Active Missions",
      value: activeMissions.toString(),
      change: "+2 from last week",
      positive: true,
      icon: <Clock className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/dashboard/vendor/missions?status=active"
    },
    {
      title: "Completed Missions",
      value: completedMissions.toString(),
      change: "+18 this month",
      positive: true,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/dashboard/vendor/missions?status=completed"
    },
    {
      title: "Trucks",
      value: trucks.length.toString(),
      change: "+12% from last month",
      positive: true,
      icon: <Truck className="h-5 w-5" />,
      color: "text-amber-600",
      bgColor: "bg-red-100",
      link: "/dashboard/trucks"
    },
    {
      title: "Supplies Delivered",
      value: "1,234",
      change: "+12% from last month",
      positive: true,
      icon: <PackageCheck className="h-5 w-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      link: "/dashboard/analytics"
    },
  ];
  
  const adminStats = [
    { 
      title: "Active Missions", 
      value: activeMissions.toString(),
      change: "+2 from last week", 
      positive: true,
      icon: <Clock className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      link: "/dashboard/missions?status=active"
    },
    { 
      title: "Vendors", 
      value: vendors?.length.toString() || "0",
      change: "+5 from last month", 
      positive: true,
      icon: <Users className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      link: "/dashboard/vendors"
    },
    { 
      title: "Completed Missions", 
      value: completedMissions.toString(), 
      change: "+18 this month", 
      positive: true,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "/dashboard/missions?status=completed"
    },
    { 
      title: "Supplies Delivered", 
      value: "1,234", 
      change: "+12% from last month", 
      positive: true,
      icon: <PackageCheck className="h-5 w-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      link: "/dashboard/analytics"
    },
  ];

  // Get the appropriate stats based on user role
  const stats = isVendor ? vendorStats : adminStats;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {isVendor ? 'Vendor Dashboard' : 'Operations Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {isVendor 
              ? 'Welcome back! Here\'s an overview of your delivery missions today.'
              : 'Welcome back! Here\'s an overview of your WFP operations today.'
            }
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link to="/dashboard/missions/new">
            <Button>
              Create Mission
            </Button>
          </Link>
          {!isVendor && (
            <Link to="/dashboard/vendors/new">
              <Button variant="outline">
                Add Vendor
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Link to={stat.link}>
              <Card className="hover-scale hover:shadow-md transition-all">
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
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Components */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={item} className="md:col-span-2">
          <LiveTrackingMap />
        </motion.div>

        <motion.div variants={item} className="md:col-span-2">
          <DeliverySummary />
        </motion.div>

        {!isVendor && (
          <>
            <motion.div variants={item}>
              <PerformanceMetrics />
            </motion.div>

            <motion.div variants={item}>
              <IncidentReports />
            </motion.div>

            <motion.div variants={item} className="md:col-span-2">
              <AIPredictiveAnalysis />
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
