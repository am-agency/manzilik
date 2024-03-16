import { useEffect, useRef, useState } from 'react';
import { City, Pagination, Region } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { listCitiesByRegion } from '../api';
import { toArrayOrEmpty } from '../../idea/utils';
import { listCities } from '../../profile/api';
import { debounceFunction } from '../../../utils';
import i18n from '../../../app/i18n';

export const useCitiesByCountry = () => {
  const { requestApi } = useMainContext();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [citiesReady, setCitiesReady] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const resourceId = 'a8358a7e-4fae-4fbe-8e48-ecefccf440b8';

  const clearSelectedCities = () => {
    setSelectedCities([]);
  };

  const selectCitiesById = (selected: string[]) => {
    const selectedCities = cities.filter((city) => selected.includes(city.id));
    setSelectedCities(selectedCities);
  };

  const listCitiesOfCountry = (query?: string, limit: number = 100, offset: number = 0) => {
    if (!resourceId) {
      return;
    } else {
      setIsSearching(true);
      requestApi(listCities, { resourceId, offset, limit, query }, (response: City[], error: string) => {
        if (error) {
          return;
        }
        setIsSearching(false);
        setCities(toArrayOrEmpty(response));
      });
    }
  };

  useEffect(() => {
    listCitiesOfCountry();
  }, [i18n.language]);

  const reloadCities = () => {
    setCitiesReady(false);
    setSelectedCities([]);
    setCities([]);
  };

  const debouncedSearch = debounceFunction((value: string) => {
    if (value.length === 0) {
      listCitiesOfCountry();
    } else {
      listCitiesOfCountry(value);
    }
  }, 500);

  const deselectCityById = (id: string) => {
    setSelectedCities((pre) => pre.filter((city) => city.id !== id));
  };

  return {
    selectCitiesById,
    selectedCities,
    cities,
    reloadCities,
    clearSelectedCities,
    deselectCityById,
    citiesReady,
    debouncedSearch,
    listCitiesOfCountry,
  };
};
