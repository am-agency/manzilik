import React, { createContext, useContext, useEffect, useState } from 'react';
import { AIVendorsFilter, Vendors } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { listAIVendors } from '../api';
import { useLocation } from 'react-router-dom';
import { RemoteConfigContext, RemoteConfigContextType } from '../../../context/remote_config_context';

export interface ObjectRecognitionProps {
  listPremiumVendors: Vendors[];
  listVendors: Vendors[];
  isVendorsLoading: boolean;
  isFlowOne: boolean;
  listNotPremiumVendors: Vendors[];
  refreshListVendors: () => void;
}

interface ObjectRecognationContextProviderProps {
  children: React.ReactNode;
}

const ObjectRecognitionContext = createContext<ObjectRecognitionProps | undefined>(undefined);

const ObjectRecognitionProvider = ({ children }: ObjectRecognationContextProviderProps) => {
  const location = useLocation();
  const { pathname } = location;
  const objectId = pathname.split('/')[3];

  const { values } = useContext(RemoteConfigContext) as RemoteConfigContextType;
  const objectRecognitionRemoteConfig = values.MANZILIK_OBJECT_RECOGNITION;

  const [isFlowOne, setIsFlowOne] = useState(false);

  const [listPremiumVendors, setListPremiumVendors] = useState([] as Vendors[]);
  const [listNotPremiumVendors, setListNotPremiumVendors] = useState([] as Vendors[]);

  const [listVendors, setListVendors] = useState({
    data: [] as Vendors[],
    loading: false,
  });

  useEffect(() => {
    if (objectRecognitionRemoteConfig == 1) {
      setIsFlowOne(true);
    } else {
      setIsFlowOne(false);
    }
  }, [objectRecognitionRemoteConfig, isFlowOne]);
  const { requestApi } = useMainContext();

  const loadVendorsList = (filters?: AIVendorsFilter) => {
    setListVendors({
      ...listVendors,
      loading: true,
    });
    requestApi(
      listAIVendors,
      {
        filters: filters || {},
      },
      (
        results: {
          data: {
            listAIVendors: Vendors[];
          };
        },
        error: string
      ) => {
        if (error) {
          return;
        }
        setListVendors({
          data: results.data.listAIVendors,
          loading: false,
        });
        setListPremiumVendors(results.data.listAIVendors.filter((vendor) => vendor.is_premium) as Vendors[]);
        setListNotPremiumVendors(results.data.listAIVendors.filter((vendor) => !vendor.is_premium) as Vendors[]);
      }
    );
  };

  useEffect(() => {
    loadVendorsList({
      object_id: objectId,
    });
  }, [objectId]);

  const refreshListVendors = () => {
    loadVendorsList({
      object_id: objectId,
    });
  };

  const contextValue: ObjectRecognitionProps = {
    listPremiumVendors,
    listVendors: listVendors.data,
    isVendorsLoading: listVendors.loading,
    isFlowOne,
    listNotPremiumVendors,
    refreshListVendors,
  };

  return <ObjectRecognitionContext.Provider value={contextValue}>{children}</ObjectRecognitionContext.Provider>;
};

export { ObjectRecognitionContext, ObjectRecognitionProvider };
