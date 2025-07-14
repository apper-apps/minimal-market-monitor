import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const CartItem = ({ item, className }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    updateQuantity(item.Id, newQuantity);
  };

  const handleRemove = () => {
    removeItem(item.Id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn("flex items-center gap-4 p-4 border-b border-gray-100", className)}
    >
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-primary truncate">{item.name}</h3>
        <p className="text-sm text-secondary">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          size="small"
          variant="ghost"
          onClick={() => updateQuantity(item.Id, Math.max(1, item.quantity - 1))}
        >
          <ApperIcon name="Minus" className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={item.quantity}
          onChange={handleQuantityChange}
          min="1"
          className="w-16 text-center"
        />
        <Button
          size="small"
          variant="ghost"
          onClick={() => updateQuantity(item.Id, item.quantity + 1)}
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-right">
        <p className="font-medium text-primary">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <Button
          size="small"
          variant="ghost"
          onClick={handleRemove}
          className="text-error hover:text-error/90 mt-1"
        >
          <ApperIcon name="Trash2" className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CartItem;