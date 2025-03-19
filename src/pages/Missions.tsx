
import { motion } from "framer-motion";

const Missions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-2">Mission Management</h1>
      <p className="text-muted-foreground">
        This page would display all missions, their status, assigned resources, and key metrics.
      </p>
    </motion.div>
  );
};

export default Missions;
