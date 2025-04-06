
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const MissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-2">Mission Detail: {id}</h1>
      <p className="text-muted-foreground">
        This page would display detailed information about the mission, including real-time tracking, resource allocation, and status updates.
      </p>
    </motion.div>
  );
};

export default MissionDetail;
