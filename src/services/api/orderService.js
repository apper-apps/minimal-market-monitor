import { v4 as uuidv4 } from "uuid";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const orderService = {
  createOrder: async (orderData) => {
    await delay(500);
    
    const order = {
      id: uuidv4(),
      ...orderData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Simulate potential API error
    if (Math.random() < 0.1) {
      throw new Error("Payment processing failed. Please try again.");
    }

    return order;
  },

  getOrderById: async (id) => {
    await delay(300);
    // Mock order data - in real app this would come from database
    return {
      id,
      items: [],
      total: 0,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
};