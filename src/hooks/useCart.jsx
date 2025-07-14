import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.Id === product.Id);
      if (existingItem) {
        const updatedItems = currentItems.map(item =>
          item.Id === product.Id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Added ${quantity} more ${product.name} to cart`);
        return updatedItems;
      } else {
        const newItem = { ...product, quantity };
        toast.success(`Added ${product.name} to cart`);
        return [...currentItems, newItem];
      }
    });
  };

  const removeItem = (productId) => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.Id === productId);
      if (item) {
        toast.info(`Removed ${item.name} from cart`);
      }
      return currentItems.filter(item => item.Id !== productId);
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.Id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info("Cart cleared");
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const value = {
    items,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
    getTax,
    getTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};