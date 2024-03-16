import { useEffect, useRef, useState } from 'react';
import { City, Pagination, Region } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { listCitiesByRegion } from '../api';

const DEFAULT_CONFIG: Pagination = {
  limit: 50,
  offset: 0,
};

interface RegionCities {
  region: Region;
  cities: City[];
}

export const useCitiesByRegions = (selectedRegions: Region[], props: Pagination = DEFAULT_CONFIG) => {
  const cityById = useRef<Map<string, City>>();
  const { requestApi } = useMainContext();
  const [cities, setCities] = useState<RegionCities[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [citiesReady, setCitiesReady] = useState(false);

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

  const loadRegionCities = (region: Region) => {
    requestApi(
      listCitiesByRegion,
      {
        ...props,
        resourceId: region.id,
        extra: selectedRegions.join(),
      },
      ({ results }: { results: City[] }, error: string) => {
        if (!error) {
          setCities([{ region, cities: results }]);
          setCitiesReady(true);
        }
      }
    );
  };

  useEffect(() => {
    for (const region of selectedRegions) {
      loadRegionCities(region);
    }
  }, [selectedRegions]);

  const reloadCities = () => {
    cityById.current = new Map();
    setCitiesReady(false);
    setSelectedCities([]);
    setCities([]);
  };

  const deselectCityById = (id: string) => {
    setSelectedCities((pre) => pre.filter((city) => city.id !== id));
  };

  return { selectCitiesById, selectedCities, cities, reloadCities, clearSelectedCities, deselectCityById, citiesReady };
};
