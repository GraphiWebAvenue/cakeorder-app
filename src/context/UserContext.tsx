import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// نوع اطلاعات کاربر
export type User = {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
};

// نوع مقادیر کانتکست
export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  postalCode: string;
  setPostalCode: (code: string) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [postalCode, setPostalCode] = useState('');

  // Load user from storage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUserState(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
      }
    };
    loadUser();
  }, []);

  const setUser = async (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem('user');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, postalCode, setPostalCode, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
