import React, { createContext, useContext, useEffect, useState } from 'react';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import fireBaseApp from '../app/firebase_config';

// Define the shape of your context state
interface RemoteConfigValues {
  [key: string]: string | boolean | number | undefined;
}

export interface RemoteConfigContextType {
  values: RemoteConfigValues;
}

// Create a context with a default empty state
export const RemoteConfigContext = createContext<RemoteConfigContextType | undefined>(undefined);

// Provider component
export const RemoteConfigProvider: React.FC = ({ children }) => {
  const [values, setValues] = useState<RemoteConfigValues>({});

  useEffect(() => {
    const remoteConfig = getRemoteConfig(fireBaseApp);
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 3600000, // Adjust based on your needs
      fetchTimeoutMillis: 60000, // Add the missing fetchTimeoutMillis property
    };

    fetchAndActivate(remoteConfig)
      .then(() => {
        const newValues: RemoteConfigValues = {
          // Define your remote config values here
          // For example:
          MANZILIK_OBJECT_RECOGNITION: getValue(remoteConfig, 'MANZILIK_OBJECT_RECOGNITION').asNumber(),
        };
        setValues(newValues);
        // eslint-disable-next-line no-console
        console.log('Remote config values:', newValues);
      })
      .catch((error) => console.error('Error fetching remote config', error));
  }, []);

  return <RemoteConfigContext.Provider value={{ values }}>{children}</RemoteConfigContext.Provider>;
};
