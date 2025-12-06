import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  balance: number;
  addBalance: (amount: number) => void;
  spendBalance: (amount: number) => boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('russiaRublesBalance');
    return saved ? parseInt(saved, 10) : 12450;
  });

  useEffect(() => {
    localStorage.setItem('russiaRublesBalance', balance.toString());
  }, [balance]);

  const addBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const spendBalance = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  return (
    <CurrencyContext.Provider value={{ balance, addBalance, spendBalance }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
