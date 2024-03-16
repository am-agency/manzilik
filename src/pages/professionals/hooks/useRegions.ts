import { useEffect, useRef, useState } from 'react';
import { Pagination, Region } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { listRegionsByCountry } from '../api';
import { useCountries } from './useCountries';

const DEFAULT_CONFIG: Pagination = {
  limit: 50,
  offset: 0,
};

export const useRegions = (props: Pagination = DEFAULT_CONFIG) => {
  const regionByIdMap = useRef<Map<string, Region>>(new Map());
  const { requestApi } = useMainContext();
  const { defaultCountry } = useCountries();
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [regionsReady, setRegionsReady] = useState(false);

  const clearSelectedRegions = () => {
    setSelectedRegions([]);
  };

  const getRegionById = (regionId: string) => {
    return regionByIdMap.current.get(regionId);
  };

  const selectRegionsById = (selected: string[]) => {
    const next = selected
      .map((regionId) => regionByIdMap.current?.get(regionId))
      .filter((region) => region !== undefined) as Region[];
    setSelectedRegions(next);
  };

  const deselectRegionById = (id: string) => {
    setSelectedRegions((pre) => pre.filter((region) => region.id !== id));
  };

  const loadRegions = () => {
    const resourceId = defaultCountry?.id;
    if (!resourceId) {
      return;
    }
    requestApi(listRegionsByCountry, { ...props, resourceId }, ({ results }: { results: Region[] }, error: string) => {
      if (!error) {
        setRegions(results);
        regionByIdMap.current = new Map(results.map((region) => [region.id, region]));
        setRegionsReady(true);
      }
    });
  };

  useEffect(() => {
    loadRegions();
  }, [defaultCountry]);

  const reloadRegions = () => {
    regionByIdMap.current = new Map();
    setRegions([]);
    setSelectedRegions([]);
    setRegionsReady(false);
    loadRegions();
  };

  return {
    selectedRegions,
    selectRegionsById,
    regionsReady,
    regions,
    reloadRegions,
    getRegionById,
    clearSelectedRegions,
    deselectRegionById,
  };
};
