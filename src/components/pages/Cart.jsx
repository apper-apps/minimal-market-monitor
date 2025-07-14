import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const Cart = ({ className }) => {
  const { items, clearCart, getSubtotal, getTax, getTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", className)}>
        <Empty 
          title="Your cart is empty"
          message="Add some products to your cart and they'll appear here."
          actionLabel="Start Shopping"
          actionPath="/shop"
          icon="ShoppingCart"
        />
      </div>
    );
  }

  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
        <Button
          variant="outline"
          size="medium"
          onClick={clearCart}
          className="text-error hover:text-error/90"
        >
          <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItem key={item.Id} item={item} />
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Subtotal ({items.length} items)</span>
                <span className="text-primary font-medium">
                  ${getSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Tax</span>
                <span className="text-primary font-medium">
                  ${getTax().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Shipping</span>
                <span className="text-success font-medium">Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-primary">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="large"
                className="w-full"
                asChild
              >
                <Link to="/checkout">
                  <ApperIcon name="CreditCard" className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </Link>
              </Button>
              <Button
                variant="outline"
                size="large"
                className="w-full"
                asChild
              >
                <Link to="/shop">
                  <ApperIcon name="ShoppingBag" className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-center gap-2 text-sm text-secondary">
                <ApperIcon name="Shield" className="h-4 w-4 text-success" />
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;