import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClient } from '../../../../../../app/hooks/use_client';
import { useTranslation } from 'react-i18next';
import {
  PLEASE_ENTER_VALID_FIRST_NAME,
  PLEASE_ENTER_VALID_LAST_NAME,
  PLEASE_SELECT_CITY,
  PLEASE_SELECT_COUNTRY,
} from '../../../../../../locales/strings';
import { useCountries } from '../../../../../professionals/hooks/useCountries';
import { completeProfile } from '../../../../../profile/api';
import { useMainContext } from '../../../../../../app/providers/main';
import { EditClientProfileInput } from '../../../../../../API';

export interface PersonalProfileFields {
  first_name: string | null;
  last_name: string | null;
  countryId: string | null;
  cityId: string | null;
}

export const useCompletePersonalProfile = () => {
  const { client, initClient } = useClient();

  const { requestApi } = useMainContext();
  const { t } = useTranslation();
  const { defaultCountry } = useCountries();
  const [didSubmit, setDidSubmit] = useState(false);
  const snapshot = useRef<PersonalProfileFields>();

  const [profile, setProfile] = useState<PersonalProfileFields>({
    first_name: null,
    last_name: null,
    countryId: null,
    cityId: null,
  });

  const nonEmpty = (str: string) => {
    return str.trim().length > 0;
  };

  const isCompleteFirstName = useMemo(() => {
    return profile.first_name !== null && nonEmpty(profile.first_name);
  }, [profile.first_name]);

  const isCompleteLastName = useMemo(() => {
    return profile.last_name !== null && nonEmpty(profile.last_name);
  }, [profile.last_name]);

  const isCompleteCountry = useMemo(() => {
    return profile.countryId !== null && nonEmpty(profile.countryId);
  }, [profile.countryId]);

  const isCompleteCity = useMemo(() => {
    return profile.cityId !== null && nonEmpty(profile.cityId);
  }, [profile.cityId]);

  useEffect(() => {
    if (client) {
      setProfile((pre) => {
        const next: PersonalProfileFields = {
          ...pre,
          first_name: client.first_name as string,
          last_name: client.last_name as string,
          countryId: client.country?.id || defaultCountry?.id || null,
          cityId: client.city?.id || null,
        };
        return next;
      });
    }
  }, [client?.first_name, client?.last_name, client?.country, client?.city, client?.country, defaultCountry]);

  useEffect(() => {
    if (defaultCountry) {
      setProfile((pre) => ({ ...pre, country: defaultCountry }));
    }
  }, [defaultCountry]);

  const isCompletePersonalProfile = useMemo(() => {
    return isCompleteFirstName && isCompleteLastName && isCompleteCountry && isCompleteCity;
  }, [isCompleteFirstName, isCompleteLastName, isCompleteCountry, isCompleteCity]);

  const errors: Record<keyof PersonalProfileFields, string | null> = useMemo(() => {
    return didSubmit
      ? {
          first_name: isCompleteFirstName ? null : t(PLEASE_ENTER_VALID_FIRST_NAME),
          last_name: isCompleteLastName ? null : t(PLEASE_ENTER_VALID_LAST_NAME),
          cityId: isCompleteCity ? null : t(PLEASE_SELECT_CITY),
          countryId: isCompleteCountry ? null : t(PLEASE_SELECT_COUNTRY),
        }
      : {
          first_name: null,
          last_name: null,
          cityId: null,
          countryId: null,
        };
  }, [t, isCompleteFirstName, isCompleteLastName, isCompleteCity, isCompleteCountry, didSubmit]);

  const onSubmit = useCallback(() => {
    return new Promise<PersonalProfileFields>((resolve) => {
      setDidSubmit(true);
      if (isCompletePersonalProfile) {
        const payload: EditClientProfileInput = {
          first_name: profile.first_name as string,
          last_name: profile.last_name as string,
          country_id: profile.countryId as string,
          city_id: profile.cityId as string,
        };
        requestApi(completeProfile, payload, (result: PersonalProfileFields, err: string) => {
          if (err) {
            return;
          }
          resolve(result);
          initClient();
        });
      }
    });
  }, [isCompletePersonalProfile]);

  const submitWithoutValidation = useCallback((payload) => {
    return new Promise<PersonalProfileFields>((resolve) => {
      requestApi(completeProfile, payload, (result: PersonalProfileFields, err: string) => {
        if (err) {
          return;
        }
        resolve(result);
        initClient();
      });
    });
  }, []);

  const saveSnapshot = () => {
    snapshot.current = { ...profile };
  };

  const restoreSnapshot = () => {
    if (snapshot.current) {
      setProfile(snapshot.current);
    }
  };

  return {
    isCompletePersonalProfile,
    isCompleteFirstName,
    isCompleteLastName,
    isCompleteCountry,
    isCompleteCity,
    profile,
    setProfile,
    errors,
    submit: onSubmit,
    submitWithoutValidation,
    initClient,
    saveSnapshot,
    restoreSnapshot,
  };
};
