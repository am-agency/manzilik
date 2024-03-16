/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useState } from 'react';
import { FiltersDataSource, FiltersViewSource, FilterObject, FilterViewItem } from './types';
import { FilterKey } from '../search/useSearchFilters';
import { ProjectSearchFilterName, ProjectSearchFilterValue } from '../../../API';

const filterTitleToFilterKeyMap: Record<string, FilterKey> = {
  size: FilterKey.SIZE,
  المساحة: FilterKey.SIZE,
  color: FilterKey.COLOR,
  اللون: FilterKey.COLOR,
  style: FilterKey.STYLE,
  الستايل: FilterKey.STYLE,
  category: FilterKey.CATEGORY,
  التصنيف: FilterKey.CATEGORY,
  dimensions: FilterKey.DIMENSIONS,
  الأبعاد: FilterKey.DIMENSIONS,
  manufactory: FilterKey.MANUFACTORY,
  'العلامة التجارية': FilterKey.MANUFACTORY,
  model: FilterKey.MODEL,
  الموديل: FilterKey.MODEL,
  vendor: FilterKey.VENDOR,
  البائع: FilterKey.VENDOR,
};

export type FiltersCache = Map<any, any>;

export const useFiltersSourceParser = (staticFilters: FiltersViewSource = []) => {
  const filtersCache = useRef<FiltersCache>(new Map());
  const [filtersSourceString, setFiltersSourceString] = useState<ProjectSearchFilterName[]>();

  const getFilterType = (filter: ProjectSearchFilterValue): FilterViewItem['type'] => {
    switch (filter.title) {
      default:
        return 'checkbox';
    }
  };

  const filtersSource = useMemo(() => {
    if (!filtersSourceString) {
      return [];
    }
    const parsed: ProjectSearchFilterName[] = filtersSourceString;
    const dynamicFilters = parsed.map((filter) => {
      const type = 'checkbox';
      const key = filterTitleToFilterKeyMap[filter?.title!];
      if (!key) {
        // if you hit this condition, pleased consider adding new type value to filter filterTitleToFilterKeyMap
        filterTitleToFilterKeyMap[filter?.title!] = filter.title as FilterKey;
        console.warn('[added] unregistered filter key: ' + key);
      }
      const filterViewItem = {
        title: filter?.title!,
        type,
        key: filter?.title!,
        data: filter?.results!,
        options: filter?.results?.map((item) => ({
          ...item,
          type,
          filter,
        })),
      };
      return filterViewItem;
    });
    const list = [...dynamicFilters, ...staticFilters];
    for (const filterSource of list) {
      filtersCache.current.set(filterSource.key, filterSource);
    }
    return list;
  }, [filtersSourceString]);

  return { filtersSource, setFiltersSourceString, filtersCache: filtersCache.current };
};
