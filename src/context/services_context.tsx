import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DirectoryGigService, Service } from '../API';
import { useMainContext } from '../app/providers/main';
import { CITY, REQUEST_SERVICE, SERVICES, SERVICE_DETAILS, SERVICE_TYPE } from '../locales/strings';
import { gigsIcons } from '../assets/icons/gigs';
import { Skeleton } from 'antd';
import { ListGigsServices } from '../pages/request_gig/api';
import { SharedStateContext, SharedStateInterface } from './shared_state_context';

export interface GigsServicesInterface {
  data: Service[];
  loadingCardsArray: JSX.Element[];
  steps: { title: string; icon: string }[];
  selectedGig: DirectoryGigService | null;
  setSelectedGig: React.Dispatch<React.SetStateAction<DirectoryGigService | null>>;
  servicesReady: boolean;
  selectedServices: Service[];
  setSelectedServices: React.Dispatch<React.SetStateAction<Service[]>>;
  clearSelectedServices: () => void;
  selectServicesById: (selected: string[]) => void;
  reloadServices: () => void;
  deselectServiceById: (id: string) => void;
  isLoading?: boolean;
}

interface GigsServicesContextProviderProps {
  children: React.ReactNode;
}

const GigsServicesContext = createContext<GigsServicesInterface | undefined>(undefined);

const GigsServicesProvider = ({ children }: GigsServicesContextProviderProps) => {
  const { t, i18n } = useTranslation();
  const [data, setData] = React.useState<Service[]>([]);
  const [selectedGig, setSelectedGig] = useState<DirectoryGigService | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [servicesReady, setServicesReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const clearSelectedServices = () => {
    setSelectedServices([]);
  };

  const selectServicesById = (selected: string[]) => {
    const next = selected
      .map((id) => serviceById.current.get(id))
      .filter((service) => service !== undefined) as Service[];
    setSelectedServices(next);
  };

  const { requestApi } = useMainContext();
  const serviceById = useRef<Map<string, Service>>(new Map());

  const steps = [
    {
      title: t(SERVICES),
      icon: gigsIcons.settingsGear,
    },
    {
      title: t(CITY),
      icon: gigsIcons.pin,
    },
    {
      title: t(SERVICE_TYPE),
      icon: gigsIcons.documentCopy,
    },
    {
      title: t(SERVICE_DETAILS),
      icon: gigsIcons.info,
    },
    {
      title: t(REQUEST_SERVICE),
      icon: gigsIcons.contactless,
    },
  ];
  const loadingCardsArray = Array.from({ length: 9 }).map((_, index) => {
    return (
      <Skeleton.Button
        key={index}
        active
        size="large"
        shape="round"
        style={{
          width: '267px',
          height: '74px',
        }}
      />
    );
  });

  const fetchGigsServicesList = () => {
    setIsLoading(true);
    requestApi(ListGigsServices, { limit: 50, offset: 0 }, (response: Service[], error: unknown) => {
      if (error) {
        return;
      }
      setData(response);
      setIsLoading(false);
      serviceById.current = new Map(response.map((service) => [service.id, service]));
      setServicesReady(true);
    });
  };

  useEffect(() => {
    fetchGigsServicesList();
  }, [i18n.language]);

  const reloadServices = () => {
    serviceById.current = new Map();
    setServicesReady(false);
    setData([]);
    setSelectedServices([]);
  };

  const deselectServiceById = (id: string) => {
    setSelectedServices((pre) => pre.filter((service) => service.id !== id));
  };

  const contextValue: GigsServicesInterface = {
    data,
    loadingCardsArray,
    steps,
    selectedGig,
    setSelectedGig,
    servicesReady,
    selectedServices,
    setSelectedServices,
    clearSelectedServices,
    selectServicesById,
    reloadServices,
    deselectServiceById,
    isLoading: isLoading,
  };

  return <GigsServicesContext.Provider value={contextValue}>{children}</GigsServicesContext.Provider>;
};

export { GigsServicesContext, GigsServicesProvider };
