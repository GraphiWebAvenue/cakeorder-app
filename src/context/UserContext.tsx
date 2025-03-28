import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  postalCode: string;
  setPostalCode: (code: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [postalCode, setPostalCode] = useState('');

  return (
    <UserContext.Provider value={{ postalCode, setPostalCode }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
