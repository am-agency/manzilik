import { useEffect, useMemo, useState } from 'react';
import { Country, Pagination } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { listCountries } from '../../profile/api';

const DEFAULT_CONFIG: Pagination = {
  limit: 10,
  offset: 0,
};

export const useCountries = (props: Pagination = DEFAULT_CONFIG) => {
  const { requestApi } = useMainContext();
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesReady, setCountriesReady] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  const loadCountries = async () => {
    requestApi(listCountries, props, (data: Country[], error: string) => {
      if (!error) {
        setCountries(data);
        setCountriesReady(true);
      }
    });
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const defaultCountry = useMemo(() => {
    return countries.find((country) => country.is_default);
  }, [countries]);

  return { countries, defaultCountry, countriesReady, selectedCountries, setSelectedCountries };
};
