import React, { createContext, useContext, useState, ReactNode } from 'react';

// نوع داده‌هایی که در context داریم
interface UserContextType {
  postalCode: string;
  setPostalCode: (code: string) => void;
}

// مقدار پیش‌فرض
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider که دور App قرار می‌گیره
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [postalCode, setPostalCode] = useState('');

  return (
    <UserContext.Provider value={{ postalCode, setPostalCode }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook برای استفاده از context راحت‌تر
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};