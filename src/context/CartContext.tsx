import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// تعریف نوع آیتم سبد خرید
type CartItem = {
  id: number;
  name: string;
  portion: 'slice' | 'half' | 'whole';
  price: number;
  quantity: number;
  image_url?: string;
};

// نوع Context برای مدیریت سبد خرید
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
};

// ایجاد Context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      const savedCart = await AsyncStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };
    loadCart();
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    AsyncStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (item: CartItem) => {
    saveCart([...cartItems, item]);
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
