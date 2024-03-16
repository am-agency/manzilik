import { useEffect, useReducer, useState } from 'react';
import { useRecentSearchParam } from './useRecentSearchParam';
import { QueryStringKeys } from './useSearchQuery';
import { FilterKeyToFilterValues } from '../filters/types';

export enum FilterKey {
  SIZE = 'size',
  STYLE = 'style',
  COLOR = 'color',
  CATEGORY = 'category',
  MODEL = 'model',
  REGIONS = 'regions',
  VENDOR = 'vendor',
  LOCATIONS = 'locations',
  MANUFACTORY = 'manufactory',
  RATING = 'rate',
  SERVICES = 'services',
  DIMENSIONS = 'dimensions',
  IS_VERIFIED = 'is_verified',
  TYPE = 'type',
  PRICE = 'price',
}

export enum SearchFilterActionKind {
  SET_FILTERS = 'SET_FILTERS',
  SET_FILTER = 'SET_FILTER',
  REMOVE_FILTER = 'REMOVE_FILTER',
  CLEAR_FILTERS = 'CLEAR_FILTERS',
}

interface SearchFilterAction {
  type: SearchFilterActionKind;
  payload: FilterKeyToFilterValues;
}

interface SearchFilterState {
  filters: FilterKeyToFilterValues;
}

const filtersReducer = (state: SearchFilterState, action: SearchFilterAction): SearchFilterState => {
  switch (action.type) {
    case SearchFilterActionKind.SET_FILTERS:
      return { filters: { ...action.payload } };

    case SearchFilterActionKind.SET_FILTER:
      return {
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case SearchFilterActionKind.REMOVE_FILTER:
      const filters = { ...state.filters };
      for (const key of Object.keys(action.payload) as FilterKey[]) {
        const targetValues = action.payload[key];
        if (!targetValues) {
          continue;
        }
        const [first] = targetValues || [];
        if (first === '') {
          delete filters[key];
        } else if (filters[key]) {
          filters[key] = filters[key]!.filter((value) => !targetValues.includes(value));
        }
      }
      return {
        filters,
      };

    case SearchFilterActionKind.CLEAR_FILTERS:
      const reset_filters = { ...state.filters };
      for (const key of Object.keys(action.payload) as FilterKey[]) {
        const excluded = action.payload[key];
        if (!excluded) {
          delete reset_filters[key];
        }
      }
      return {
        filters: {},
      };
  }
  return state;
};

export const useSearchFilters = (filters: Record<string, string[]> = {}) => {
  const [state, dispatch] = useReducer(filtersReducer, { filters });
  const [initialFilters, setInitialFilters] = useState<FilterKeyToFilterValues>();

  const setFilters = (filters: Record<string, string[]>) => {
    dispatch({
      type: SearchFilterActionKind.SET_FILTERS,
      payload: filters,
    });
  };

  const removeFilter = (filterKey: FilterKey, value: string) => {
    dispatch({
      type: SearchFilterActionKind.REMOVE_FILTER,
      payload: {
        [filterKey]: [value],
      },
    });
  };

  const setFilter = (filterName: string, values: string[]) => {
    dispatch({
      type: SearchFilterActionKind.SET_FILTER,
      payload: {
        [filterName]: values,
      },
    });
  };

  const clearFilters = (exclude: FilterKey[] = []) => {
    const payload: Partial<Record<FilterKey, []>> = {};
    for (const item of exclude) {
      payload[item] = [];
    }
    dispatch({
      type: SearchFilterActionKind.CLEAR_FILTERS,
      payload,
    });
  };

  const decodeFilters = (encoded: string[]) => {
    const decoded: FilterKeyToFilterValues = {};
    for (const filter of encoded) {
      try {
        const [key, _values] = decodeURIComponent(filter).split(':');
        const values = _values.split(',');
        decoded[key as FilterKey] = values;
      } catch (error) {
        console.error(`[!] Invalid filter query params: ${encoded}`);
      }
    }
    return decoded;
  };

  const { updateSearchParamsFromUrl } = useRecentSearchParam(
    QueryStringKeys.FILTERS,
    (filterChange) => {
      setFilters(decodeFilters(filterChange));
    },
    (initFilters) => {
      const decoded = decodeFilters(initFilters);
      setInitialFilters(decoded);
    }
  );

  return {
    filters: state.filters,
    setFilters,
    removeFilter,
    clearFilters,
    setFilter,
    initialFilters,
    updateFiltersSearchParamsFromUrl: updateSearchParamsFromUrl,
  };
};
