import React, { createContext, useEffect, useState } from 'react';
import { GigsRequestSteps } from '../pages/request_gig/types';
import { GigService, Service } from '../API';
import { useTranslation } from 'react-i18next';

interface GigsStepsContextProps {
  currentStep: number;
  updateStep: (newStep: number) => void;
  selectedService?: Service;
  setSelectedService?: (service: Service) => void;
  selectedCityId?: string | null;
  setSelectedCityId?: (cityId: string | null) => void;
  isCitySelected?: boolean;
  setIsCitySelected?: (isCitySelected: boolean) => void;
  setSelectedServiceItem?: (service: GigService | null) => void;
  selectedServiceItem?: GigService | null;
  setFilteredServices?: (services: GigService[]) => void;
  filteredServices?: GigService[];
  redirectionLink?: string;
  setRedirectionLink?: (link: string) => void;
  selectedCityName?: string | null;
  setSelectedCityName?: (cityName: string | null) => void;
}

interface GigsStepsContextProviderProps {
  children: React.ReactNode;
}

const GigsStepsContext = createContext<GigsStepsContextProps | undefined>(undefined);

const GigsStepsProvider = ({ children }: GigsStepsContextProviderProps) => {
  const [currentStep, setCurrentStep] = useState<GigsRequestSteps>(0);
  const [selectedService, setSelectedService] = useState<Service>();
  const [selectedServiceItem, setSelectedServiceItem] = useState<GigService | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [isCitySelected, setIsCitySelected] = useState<boolean>(false);
  const [filteredServices, setFilteredServices] = useState<GigService[]>([]);
  const [redirectionLink, setRedirectionLink] = useState<string>('');
  const { i18n } = useTranslation();

  useEffect(() => {
    if (selectedCityId) {
      const selectedCity = selectedServiceItem?.cities?.find((city) => city?.id === selectedCityId);
      if (selectedCity) {
        setSelectedCityName(selectedCity?.name!);
      }
    }
  }, [selectedCityId, selectedServiceItem]);
  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
  };

  useEffect(() => {
    if (selectedService) {
      setSelectedService(selectedService);
    }
  }, [i18n.language, selectedService]);

  const contextValue: GigsStepsContextProps = {
    currentStep,
    updateStep,
    selectedService,
    setSelectedService,
    selectedCityId,
    setSelectedCityId,
    isCitySelected,
    setIsCitySelected,
    selectedServiceItem,
    setSelectedServiceItem,
    filteredServices,
    setFilteredServices,
    redirectionLink,
    setRedirectionLink,
    selectedCityName,
    setSelectedCityName,
  };

  return <GigsStepsContext.Provider value={contextValue}>{children}</GigsStepsContext.Provider>;
};

export { GigsStepsContext, GigsStepsProvider };
