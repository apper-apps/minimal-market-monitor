import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const Checkout = ({ className }) => {
  const navigate = useNavigate();
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    sameAsShipping: true
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: "Shipping", icon: "Truck" },
    { number: 2, title: "Payment", icon: "CreditCard" },
    { number: 3, title: "Review", icon: "CheckCircle" }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      // Shipping validation
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
    }
    
    if (step === 2) {
      // Payment validation
      if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
      if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv) newErrors.cvv = "CVV is required";
      if (!formData.cardName) newErrors.cardName = "Name on card is required";
      
      if (!formData.sameAsShipping) {
        if (!formData.billingAddress) newErrors.billingAddress = "Billing address is required";
        if (!formData.billingCity) newErrors.billingCity = "Billing city is required";
        if (!formData.billingState) newErrors.billingState = "Billing state is required";
        if (!formData.billingZipCode) newErrors.billingZipCode = "Billing ZIP code is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    try {
      setLoading(true);
      
      const orderData = {
        items: items.map(item => ({
          productId: item.Id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: getSubtotal(),
        tax: getTax(),
        total: getTotal(),
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentInfo: {
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          expiryDate: formData.expiryDate,
          cardName: formData.cardName
        }
      };

      const order = await orderService.createOrder(orderData);
      
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/order-confirmation", { state: { order } });
    } catch (err) {
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", className)}>
        <div className="text-center">
          <ApperIcon name="ShoppingCart" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">Your cart is empty</h2>
          <p className="text-secondary mb-6">Add some items to your cart before checking out.</p>
          <Button variant="primary" onClick={() => navigate("/shop")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
      <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep >= step.number
                    ? "bg-accent text-white"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {currentStep > step.number ? (
                  <ApperIcon name="Check" className="h-5 w-5" />
                ) : (
                  <ApperIcon name={step.icon} className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3 min-w-0">
                <p className={cn(
                  "text-sm font-medium",
                  currentStep >= step.number ? "text-accent" : "text-gray-400"
                )}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 ml-4 mr-4",
                  currentStep > step.number ? "bg-accent" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-primary mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={errors.firstName}
                    required
                  />
                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={errors.lastName}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    required
                  />
                </div>

                <FormField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                    required
                  />
                  <FormField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={errors.state}
                    required
                  />
                  <FormField
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    error={errors.zipCode}
                    required
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-primary mb-4">Payment Information</h2>
                
                <FormField
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  error={errors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Expiry Date"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    error={errors.expiryDate}
                    required
                  />
                  <FormField
                    label="CVV"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    error={errors.cvv}
                    required
                  />
                </div>

                <FormField
                  label="Name on Card"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  error={errors.cardName}
                  required
                />

                <div className="border-t pt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onChange={handleInputChange}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span className="ml-2 text-sm text-secondary">
                      Billing address same as shipping address
                    </span>
                  </label>
                </div>

                {!formData.sameAsShipping && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-primary">Billing Address</h3>
                    <FormField
                      label="Billing Address"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      error={errors.billingAddress}
                      required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        label="City"
                        name="billingCity"
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        error={errors.billingCity}
                        required
                      />
                      <FormField
                        label="State"
                        name="billingState"
                        value={formData.billingState}
                        onChange={handleInputChange}
                        error={errors.billingState}
                        required
                      />
                      <FormField
                        label="ZIP Code"
                        name="billingZipCode"
                        value={formData.billingZipCode}
                        onChange={handleInputChange}
                        error={errors.billingZipCode}
                        required
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-primary mb-4">Review Your Order</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-primary mb-2">Shipping Address</h3>
                    <div className="text-sm text-secondary">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.address}</p>
                      <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-primary mb-2">Payment Method</h3>
                    <div className="text-sm text-secondary">
                      <p>Card ending in {formData.cardNumber.slice(-4)}</p>
                      <p>{formData.cardName}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ApperIcon name="ChevronLeft" className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              {currentStep < 3 ? (
                <Button variant="primary" onClick={handleNext}>
                  Next
                  <ApperIcon name="ChevronRight" className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="CreditCard" className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-primary mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.Id} className="flex justify-between text-sm">
                  <span className="text-secondary">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-primary font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Subtotal</span>
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
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-primary">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-secondary">
              <ApperIcon name="Shield" className="h-4 w-4 text-success" />
              <span>Secure checkout with SSL encryption</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;