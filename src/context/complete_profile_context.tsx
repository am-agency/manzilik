import React, { createContext, useEffect, useState } from 'react';
import { useMainContext } from '../app/providers/main';

interface CompleteProfileProps {
  isProfessionalCompleteProfile: boolean;
  setIsProfessionalCompleteProfile?: (isCompleted: boolean) => void;
  getProfessional?: () => void;
}

interface CompleteProfileContextProviderProps {
  children: React.ReactNode;
}

const CompleteProfileContext = createContext<CompleteProfileProps | undefined>(undefined);

const CompleteProfileProvider = ({ children }: CompleteProfileContextProviderProps) => {
  const [isProfessionalCompleteProfile, setIsProfessionalCompleteProfile] = useState<boolean>(false);

  const getProfessionalFromStorage = JSON.parse(localStorage.getItem('Professional') || '{}');
  useEffect(() => {
    setIsProfessionalCompleteProfile(getProfessionalFromStorage.is_profile_completed);
  }, [getProfessionalFromStorage.is_profile_completed]);
  const contextValue: CompleteProfileProps = {
    isProfessionalCompleteProfile,
    setIsProfessionalCompleteProfile,
  };

  return <CompleteProfileContext.Provider value={contextValue}>{children}</CompleteProfileContext.Provider>;
};

export { CompleteProfileContext, CompleteProfileProvider };
