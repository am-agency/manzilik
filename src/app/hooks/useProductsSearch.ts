/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ProjectSearchFilterName, SearchData, StockRecord } from '../../API';
import { search } from '../../pages/ideas/api';
import { getPaginationOffset } from '../../utils';
import { useMainContext } from '../providers/main';
import { STOCKRECORDS } from '../settings';
import { useSearchCategories } from './search/useSearchCategories';
import { FilterKey, useSearchFilters } from './search/useSearchFilters';
import { useSearchKeywords } from './search/useSearchKeywords';
import { useSearchOptions } from './search/useSearchOptions';
import { QueryStringKeys, useSearchQuery } from './search/useSearchQuery';
import { useFiltersSource } from './filters/useFiltersSource';

export const useProductsSearch = (partnerId?: string) => {
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchData, setSearchData] = useState<SearchData[]>([]);
  const { requestApi } = useMainContext();
  const { keywords, setKeywords } = useSearchKeywords();
  const { setCategories, categories, clearCategories } = useSearchCategories();
  const { searchOptions, setOffset, setRecordsLimit, setSortMethod, getCurrentPage } = useSearchOptions();
  const { setFilters, filters, setFilter, clearFilters, removeFilter, initialFilters } = useSearchFilters();
  const { filtersSource, setFiltersSourceString, filtersCache } = useFiltersSource();
  const { queryString } = useSearchQuery({
    searchOptions,
    filters,
    keywords,
    categories,
  });

  const getQueryPayload = () => {
    const payload = {
      [QueryStringKeys.KEYWORDS]: keywords,
      [QueryStringKeys.CATEGORIES]: categories[categories.length - 1],
      [QueryStringKeys.FILTERS]: JSON.stringify(filters),
      [QueryStringKeys.SORT_METHOD]: searchOptions.sortMethod,
      [QueryStringKeys.OFFSET]: searchOptions.offset,
      [QueryStringKeys.LIMIT]: searchOptions.recordsLimit,
      [QueryStringKeys.INDEX]: STOCKRECORDS,
      [QueryStringKeys.PARTNER]: partnerId,
    };
    if (!partnerId) {
      delete payload[QueryStringKeys.PARTNER];
    }
    return payload;
  };

  const clear = (execludeCategories?: boolean) => {
    setKeywords('');
    setOffset(0);
    if (!execludeCategories) {
      clearCategories();
    }
    clearFilters();
  };

  const updateProducts = () => {
    setLoading(true);
    requestApi(
      search,
      getQueryPayload(),
      (response: { results: SearchData[]; count: number; filters: string }, error: string) => {
        if (error) {
          setLoading(false);
          return;
        }
        const { results, filters, count } = response;
        setSearchData([...results]);
        setTotalProducts(count);
        setFiltersSourceString(filters as any);
        setLoading(false);
      }
    );
  };

  const getRange = () => {
    return [searchOptions.offset + 1, searchOptions.offset + searchOptions.recordsLimit];
  };

  const products = useMemo(() => {
    return searchData.map((item) => JSON.parse(item.data as unknown as string) as StockRecord);
  }, [searchData]);

  const onPageChange = useCallback(
    (page: number) => {
      setOffset(getPaginationOffset(page, searchOptions.recordsLimit));
    },
    [searchOptions.recordsLimit]
  );

  return {
    loading,
    totalProducts,
    products,
    getRange,
    searchData,
    onPageChange,
    filtersSource,
    updateProducts,
    clear,
    filters,
    setFilter,
    setKeywords,
    searchOptions,
    getCurrentPage,
    queryString,
    setOffset,
    setRecordsLimit,
    setSortMethod,
    setFilters,
    setCategories,
    categories,
    keywords,
    removeFilter,
    initialFilters,
    filtersCache,
  };
};
