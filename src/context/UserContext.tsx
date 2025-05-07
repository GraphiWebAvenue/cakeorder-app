import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// تعریف نوع کاربر
export type User = {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
};

// نوع Context برای مدیریت کاربر
export type UserContextType = {
  user: User | null;
  setUser: (newUser: User | null) => void;
  logout: () => void;
  postalCode: string;
  setPostalCode: (code: string) => void;
};

// ایجاد Context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// هوک برای استفاده از UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// کامپوننت Provider برای مدیریت وضعیت کاربر
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [postalCode, setPostalCode] = useState<string>('');

  // بارگذاری داده‌های کاربر از حافظه محلی
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      }
    };
    loadUser();
  }, []);

  // ذخیره‌سازی کاربر در حافظه محلی
  const updateUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      AsyncStorage.setItem('user', JSON.stringify(newUser));
    } else {
      AsyncStorage.removeItem('user');
    }
  };

  // متد برای خروج از حساب کاربری
  const logout = () => {
    setUser(null);
    setPostalCode('');
    AsyncStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout, postalCode, setPostalCode }}>
      {children}
    </UserContext.Provider>
  );
};
