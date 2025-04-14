import React, { createContext, useState, useContext, ReactNode } from 'react';

// نوع هر آیتم در سبد خرید
interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  portion: 'slice' | 'half' | 'whole';
}

// نوع context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number, portion: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

// ایجاد کانتکست
export const CartContext = createContext<CartContextType | undefined>(undefined);

// کامپوننت Provider برای استفاده در App.tsx
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.portion === item.portion
      );
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id && i.portion === item.portion
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (itemId: number, portion: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === itemId && item.portion === portion))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook برای استفاده راحت در کامپوننت‌ها
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
