import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const CartSidebar = ({ className }) => {
  const { items, isOpen, setIsOpen, getSubtotal, clearCart } = useCart();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={cn("fixed inset-0 z-50", className)}>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleOverlayClick}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-primary">
                Shopping Cart ({items.length})
              </h2>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsOpen(false)}
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ApperIcon name="ShoppingCart" className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-primary mb-2">Your cart is empty</h3>
                  <p className="text-secondary mb-4">Add some products to get started</p>
                  <Button
                    variant="primary"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-0">
                  {items.map((item) => (
                    <CartItem key={item.Id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-primary">
                    Subtotal: ${getSubtotal().toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={clearCart}
                    className="text-error hover:text-error/90"
                  >
                    Clear Cart
                  </Button>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="primary"
                    size="large"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link to="/checkout">Checkout</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="large"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link to="/cart">View Cart</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;