import React, { createContext, useEffect, useState } from 'react';

interface PreviousHistoryProps {
  previousHistoryLink: string;
  setPreviousHistoryLink?: (link: string) => void;
}

interface PreviousHistoryContextProviderProps {
  children: React.ReactNode;
}

const PreviousHistoryContext = createContext<PreviousHistoryProps | undefined>(undefined);

const PreviousHistoryProvider = ({ children }: PreviousHistoryContextProviderProps) => {
  const [previousHistoryLink, setPreviousHistoryLink] = useState<string>('');
  const contextValue: PreviousHistoryProps = {
    previousHistoryLink,
    setPreviousHistoryLink,
  };

  return <PreviousHistoryContext.Provider value={contextValue}>{children}</PreviousHistoryContext.Provider>;
};

export { PreviousHistoryContext, PreviousHistoryProvider };
