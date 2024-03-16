import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMainContext } from '../../app/providers/main';
import { listRfq } from './api';
import { QuotationList, SendQuotationInput, ServiceInquiry, ServiceInquiryList } from '../../API';
import i18n from '../../app/i18n';

export interface RfqProps {
  profSelectedServicesFilter: string[];
  setProfSelectedServicesFilter: (ids: string[]) => void;
  profSelectedCitiesFilter: string[];
  setProfSelectedCitiesFilter: (ids: string[]) => void;
  selectedRfq?: ServiceInquiry | null;
  setSelectedRfq: (rfq: ServiceInquiry | null) => void;
  quotationForm?: SendQuotationInput | null;
  setQuotationForm: (quotationForm: SendQuotationInput | null) => void;
  isFormReady: boolean;
}

interface RfqContextProviderProps {
  children: React.ReactNode;
}

const RfqContext = createContext<RfqProps | undefined>(undefined);

const RfqProvider = ({ children }: RfqContextProviderProps) => {
  const [profSelectedServicesFilter, setProfSelectedServicesFilter] = useState<string[]>([]);
  const [profSelectedCitiesFilter, setProfSelectedCitiesFilter] = useState<string[]>([]);
  const [selectedRfq, setSelectedRfq] = useState<ServiceInquiry | null>(null);
  const [quotationForm, setQuotationForm] = useState<SendQuotationInput | null>(null);
  const [isFormReady, setIsFormReady] = useState<boolean>(false);

  const isFormValid = () => {
    if (!quotationForm) {
      return false;
    }
    if (!quotationForm.budget_limits) {
      return false;
    }
    if (!quotationForm.execution_time) {
      return false;
    }
    if (!quotationForm.description) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (quotationForm) {
      setIsFormReady(isFormValid());
    }
  }, [quotationForm]);

  const contextValue: RfqProps = {
    profSelectedServicesFilter,
    setProfSelectedServicesFilter,
    profSelectedCitiesFilter,
    setProfSelectedCitiesFilter,
    selectedRfq,
    setSelectedRfq,
    quotationForm,
    setQuotationForm,
    isFormReady,
  };

  return <RfqContext.Provider value={contextValue}>{children}</RfqContext.Provider>;
};

export { RfqContext, RfqProvider };
