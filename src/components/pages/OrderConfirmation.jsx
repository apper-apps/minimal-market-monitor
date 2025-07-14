import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const OrderConfirmation = ({ className }) => {
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", className)}>
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="h-16 w-16 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">Order not found</h2>
          <p className="text-secondary mb-6">We couldn't find your order information.</p>
          <Button variant="primary" asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="CheckCircle" className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">Order Confirmed!</h1>
        <p className="text-secondary">
          Thank you for your order. We've received your order and will process it shortly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Order Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Order Number:</span>
                <span className="text-primary font-medium">{order.id}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Order Date:</span>
                <span className="text-primary font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Status:</span>
                <span className="text-success font-medium capitalize">{order.status}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Estimated Delivery:</span>
                <span className="text-primary font-medium">
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Shipping Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Shipping Address</h2>
            
            <div className="text-sm text-secondary space-y-1">
              <p className="font-medium text-primary">
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
              </p>
              <p>{order.shippingInfo.address}</p>
              <p>
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
              </p>
              <p>{order.shippingInfo.country}</p>
              <p className="pt-2">{order.shippingInfo.email}</p>
              <p>{order.shippingInfo.phone}</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Order Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Items Ordered</h2>
          
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <h3 className="font-medium text-primary">{item.name}</h3>
                  <p className="text-sm text-secondary">Quantity: {item.quantity}</p>
                </div>
                <span className="font-medium text-primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Subtotal:</span>
              <span className="text-primary font-medium">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Tax:</span>
              <span className="text-primary font-medium">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Shipping:</span>
              <span className="text-success font-medium">Free</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span className="text-primary">Total:</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center space-y-4"
      >
        <p className="text-secondary">
          We'll send you a confirmation email with tracking information once your order ships.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" asChild>
            <Link to="/shop">
              <ApperIcon name="ShoppingBag" className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/">
              <ApperIcon name="Home" className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;