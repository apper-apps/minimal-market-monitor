import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "products" }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );

  const SkeletonDetails = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );

  if (type === "product-details") {
    return (
      <div className={cn("p-8", className)}>
        <SkeletonDetails />
      </div>
    );
  }

  return (
    <div className={cn("p-8", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <SkeletonCard />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;