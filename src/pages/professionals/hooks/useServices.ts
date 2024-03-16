import { useContext, useEffect, useRef, useState } from 'react';
import { Pagination, Service } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { listServices } from '../api';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';

const DEFAULT_CONFIG: Pagination = {
  limit: 200,
};

export const useServices = (props: Pagination = DEFAULT_CONFIG) => {
  const serviceById = useRef<Map<string, Service>>(new Map());
  const { requestApi } = useMainContext();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [servicesReady, setServicesReady] = useState(false);
  const { isListServicesLoading, listOfServices } = useContext(SharedStateContext) as SharedStateInterface;

  const clearSelectedServices = () => {
    setSelectedServices([]);
  };

  const selectServicesById = (selected: string[]) => {
    const next = selected
      .map((id) => serviceById.current.get(id))
      .filter((service) => service !== undefined) as Service[];
    setSelectedServices(next);
  };

  const loadServices = () => {
    if (!isListServicesLoading!) {
      const list = listOfServices!;
      setServices(list!);
      serviceById.current = new Map(list.map((service) => [service.id, service]));
      setServicesReady(true);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const reloadServices = () => {
    serviceById.current = new Map();
    setServicesReady(false);
    setServices([]);
    setSelectedServices([]);
  };

  const deselectServiceById = (id: string) => {
    setSelectedServices((pre) => pre.filter((service) => service.id !== id));
  };

  return {
    services,
    selectServicesById,
    servicesReady,
    selectedServices,
    reloadServices,
    clearSelectedServices,
    deselectServiceById,
  };
};
