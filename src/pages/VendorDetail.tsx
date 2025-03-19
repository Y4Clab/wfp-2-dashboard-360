
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const VendorDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold mb-2">Vendor Detail: {id}</h1>
      <p className="text-muted-foreground">
        This page would display detailed information about the vendor, their history, performance metrics, and compliance status.
      </p>
    </motion.div>
  );
};

export default VendorDetail;
