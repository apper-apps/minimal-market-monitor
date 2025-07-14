import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const ProductCard = ({ product, className }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={cn("group", className)}
    >
      <Card className="overflow-hidden h-full">
        <Link to={`/product/${product.Id}`}>
          <div className="aspect-square bg-gray-100 overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-primary line-clamp-2 group-hover:text-accent transition-colors">
                {product.name}
              </h3>
              {!product.inStock && (
                <Badge variant="error" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            <p className="text-sm text-secondary mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <Button
                size="small"
                variant="accent"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default ProductCard;