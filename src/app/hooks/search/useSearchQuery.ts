import { useCallback, useEffect, useMemo } from 'react';
import { SearchOptionsState } from './useSearchOptions';

export interface SearchQueryParams {
  searchOptions: SearchOptionsState;
  categories: string[];
  filters: Record<string, string[]>;
  keywords: string;
}

export enum QueryStringKeys {
  KEYWORDS = 'q',
  CATEGORIES = 'c',
  FILTERS = 'm',
  OFFSET = 'o',
  LIMIT = 'l',
  SORT_METHOD = 's',
  INDEX = 'i',
  PARTNER = 'p',
}

interface UrlParam {
  key: string;
  value: string;
}

export const UrlQueryPair = ({ key, value }: UrlParam) => `${key}=${encodeURIComponent(value)}`;
const UrlValuePair = (key: string, value: string) => `${key}:${value}`;
export const joinUrlParams = (params: string[]) => params.join('&');

const useCategoriesQuery = (categories?: string[]) => {
  const getCategoriesParams = useCallback(
    (categories?: string[]) => {
      if (categories?.length) {
        return categories.map((category) => ({ key: QueryStringKeys.CATEGORIES, value: category }));
      }
      return [];
    },
    [categories]
  );

  const getSerializedCategoriesParams = useCallback(
    (categories?: string[]): string => {
      if (categories?.length) {
        const mostSpecific = getCategoriesParams(categories)[categories.length - 1];
        return UrlQueryPair(mostSpecific);
      }
      return '';
    },
    [categories]
  );

  const serializeCategoriesParams = useMemo(() => {
    return getSerializedCategoriesParams(categories);
  }, [categories]);

  return { getCategoriesParams, getSerializedCategoriesParams, serializeCategoriesParams };
};

const useKeywordsQuery = (keywords?: string) => {
  const getKeywordsParams = useCallback(
    (keywords?: string) => {
      if (keywords?.trim().length !== 0) {
        return [{ key: QueryStringKeys.KEYWORDS, value: keywords as string }];
      }
      return [];
    },
    [keywords]
  );

  const getSerializedKeywordsParams = useCallback(
    (keywords?: string) => {
      if (keywords?.trim().length) {
        return UrlQueryPair({ key: QueryStringKeys.KEYWORDS, value: keywords });
      }
      return '';
    },
    [keywords]
  );

  const serializedKeywordsParams = useMemo(() => {
    return getSerializedKeywordsParams(keywords);
  }, [keywords]);

  return { getKeywordsParams, getSerializedKeywordsParams, serializedKeywordsParams };
};

const useSearchOptionsParamsQuery = (searchOptions?: SearchOptionsState) => {
  const getSearchOptionsParams = useCallback(
    (searchOptions?: SearchOptionsState) => {
      if (searchOptions) {
        const _searchOptionsParams: UrlParam[] = [];
        if (Number.isInteger(searchOptions.offset)) {
          _searchOptionsParams.push({ key: QueryStringKeys.OFFSET, value: searchOptions.offset.toString() });
        }
        if (Number.isInteger(searchOptions.recordsLimit)) {
          _searchOptionsParams.push({ key: QueryStringKeys.LIMIT, value: searchOptions.recordsLimit.toString() });
        }
        if (searchOptions.sortMethod) {
          _searchOptionsParams.push({ key: QueryStringKeys.SORT_METHOD, value: searchOptions.sortMethod });
        }
        return _searchOptionsParams;
      } else {
        return [];
      }
    },
    [searchOptions]
  );

  const getSerializedSearchOptions = useCallback(
    (searchOptions?: SearchOptionsState) => {
      const params = getSearchOptionsParams(searchOptions);
      if (params.length) {
        return joinUrlParams(params.map(UrlQueryPair));
      }
      return '';
    },
    [searchOptions]
  );

  const serializedSearchOptionsParams = useMemo(() => {
    return getSerializedSearchOptions(searchOptions);
  }, [searchOptions]);

  return { getSearchOptionsParams, getSerializedSearchOptions, serializedSearchOptionsParams };
};

const useFiltersQuery = (filters?: Record<string, string[]>) => {
  const getFiltersParams = (filters?: Record<string, string[]>) => {
    if (filters) {
      return Object.entries(filters)
        .map(([key, values]) => {
          const _values = values.filter((value) => value !== '');
          if (_values.length) {
            return { key: QueryStringKeys.FILTERS, value: UrlValuePair(key, values.join(',')) };
          } else {
            return { key: QueryStringKeys.FILTERS, value: '' };
          }
        })
        .filter((param) => param.value !== '');
    }
    return [];
  };

  const getSerializedFiltersParams = useCallback(
    (filters?: Record<string, string[]>) => {
      const params = getFiltersParams(filters);
      if (params.length) {
        const filterPairs = params.map(UrlQueryPair);
        return filterPairs.length ? joinUrlParams(filterPairs) : '';
      }
      return '';
    },
    [filters]
  );

  const serializedFilterParams = useMemo(() => {
    return getSerializedFiltersParams(filters);
  }, [filters]);

  return { getSerializedFiltersParams, getFiltersParams, serializedFilterParams };
};

export const useSearchQuery = ({ categories, filters, keywords, searchOptions }: Partial<SearchQueryParams>) => {
  const { getCategoriesParams, getSerializedCategoriesParams, serializeCategoriesParams } =
    useCategoriesQuery(categories);

  const { getKeywordsParams, getSerializedKeywordsParams, serializedKeywordsParams } = useKeywordsQuery(keywords);

  const { getSearchOptionsParams, getSerializedSearchOptions, serializedSearchOptionsParams } =
    useSearchOptionsParamsQuery(searchOptions);

  const { getFiltersParams, getSerializedFiltersParams, serializedFilterParams } = useFiltersQuery(filters);

  const getQueryString = useCallback(
    (customParams: Partial<SearchQueryParams>) => {
      const search = joinUrlParams(
        [
          customParams.searchOptions
            ? getSerializedSearchOptions(customParams.searchOptions)
            : serializedSearchOptionsParams,
          customParams.keywords ? getSerializedKeywordsParams(customParams.keywords) : serializedKeywordsParams,
          customParams.categories ? getSerializedCategoriesParams(customParams.categories) : serializeCategoriesParams,
          customParams.filters ? getSerializedFiltersParams(customParams.filters) : serializedFilterParams,
        ].filter((param) => param !== '')
      );
      return search.length ? `?${search}` : '';
    },
    [serializeCategoriesParams, serializedKeywordsParams, serializedSearchOptionsParams, serializedFilterParams]
  );

  const queryString = useMemo(() => {
    return getQueryString({ categories, filters, keywords, searchOptions });
  }, [serializeCategoriesParams, serializedKeywordsParams, serializedSearchOptionsParams, serializedFilterParams]);

  return {
    queryString,
    getQueryString,
    getCategoriesParams,
    getSerializedCategoriesParams,
    serializeCategoriesParams,
    getKeywordsParams,
    getSerializedKeywordsParams,
    serializedKeywordsParams,
    getSearchOptionsParams,
    getSerializedSearchOptions,
    serializedSearchOptionsParams,
    getFiltersParams,
    getSerializedFiltersParams,
    serializedFilterParams,
  };
};
