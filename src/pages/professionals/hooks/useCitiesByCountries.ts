import { useEffect, useRef, useState } from 'react';
import { City, Country, Pagination } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { listCitiesByCountry } from '../api';

const DEFAULT_CONFIG: Pagination = {
  limit: 50,
  offset: 0,
};

interface CountryCities {
  country: Country;
  cities: City[];
}

export const useCitiesByCountries = (selectedCountries: Country[], props: Pagination = DEFAULT_CONFIG) => {
  const cityById = useRef<Map<string, City>>();
  const { requestApi } = useMainContext();
  const [cities, setCities] = useState<CountryCities[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [citiesReady, setCitiesReady] = useState(false);
  const [query, setQuery] = useState('');

  const clearSelectedCities = () => {
    setSelectedCities([]);
  };

  const selectCitiesById = (selected: string[]) => {
    const next = selected.map((id) => cityById.current?.get(id)).filter((city) => city !== undefined) as City[];
    setSelectedCities(next);
  };

  useEffect(() => {
    cityById.current = new Map(cities.flatMap((regionCity) => regionCity.cities.map((city) => [city.id, city])));
  }, [cities]);

  const loadCountryCities = (country: Country) => {
    const input = {
      ...props,
      resourceId: country.id,
      extra: selectedCountries.map((country) => country.id).join(),
    };
    if (query) {
      input.query = query;
    }
    requestApi(listCitiesByCountry, input, ({ results }: { results: City[] }, error: string) => {
      if (!error) {
        setCities((pre) => {
          const next = pre.filter((item) => item.country.id !== country.id);
          next.push({ country, cities: results });
          return next;
        });
        setCitiesReady(true);
      }
    });
  };

  const reload = () => {
    for (const country of selectedCountries) {
      loadCountryCities(country);
    }
  };

  useEffect(() => {
    reload();
  }, [selectedCountries, query]);

  const reloadCities = () => {
    cityById.current = new Map();
    setCitiesReady(false);
    setSelectedCities([]);
    setCities([]);
  };

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
    findCities: setQuery,
  };
};
