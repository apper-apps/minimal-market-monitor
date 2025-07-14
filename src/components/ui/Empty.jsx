import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className, 
  title = "No items found", 
  message = "Try adjusting your search or filter criteria.",
  actionLabel = "Browse All Products",
  actionPath = "/shop",
  icon = "Search"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col items-center justify-center p-8 text-center", className)}
    >
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-accent" />
      </div>
      <h3 className="text-lg font-medium text-primary mb-2">{title}</h3>
      <p className="text-secondary mb-6 max-w-md">{message}</p>
      <Button variant="primary" asChild>
        <Link to={actionPath}>
          {actionLabel}
        </Link>
      </Button>
    </motion.div>
  );
};

export default Empty;