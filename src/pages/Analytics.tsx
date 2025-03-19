
import { motion } from "framer-motion";

const Analytics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
      <p className="text-muted-foreground">
        This page would display comprehensive analytics and insights about WFP operations, including trends, forecasts, and performance metrics.
      </p>
    </motion.div>
  );
};

export default Analytics;
