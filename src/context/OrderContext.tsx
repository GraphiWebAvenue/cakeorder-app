import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OrderDetails = {
  method: 'pickup' | 'delivery';
  delivery_date?: string;
  delivery_time?: string;
  postal_code: string;
  branch_id?: number;
  province?: string;
  city?: string;
  street_address?: string;
  house_number?: string;
  extra_details?: string;
};

type OrderContextType = {
  orderDetails: OrderDetails | null;
  setOrderDetails: (details: OrderDetails) => void;
  clearOrderDetails: () => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      const savedOrder = await AsyncStorage.getItem('orderDetails');
      if (savedOrder) {
        setOrderDetails(JSON.parse(savedOrder));
      }
    };
    loadOrder();
  }, []);

  const saveOrder = (details: OrderDetails) => {
    setOrderDetails(details);
    AsyncStorage.setItem('orderDetails', JSON.stringify(details));
  };

  const clearOrderDetails = () => {
    setOrderDetails(null);
    AsyncStorage.removeItem('orderDetails');
  };

  return (
    <OrderContext.Provider value={{ orderDetails, setOrderDetails: saveOrder, clearOrderDetails }}>
      {children}
    </OrderContext.Provider>
  );
};
