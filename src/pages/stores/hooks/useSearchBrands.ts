import { useEffect } from 'react';
import { useSearchCategories } from '../../../app/hooks/search/useSearchCategories';
import { FilterKey, useSearchFilters } from '../../../app/hooks/search/useSearchFilters';
import { useSearchKeywords } from '../../../app/hooks/search/useSearchKeywords';
import { useSearchOptions } from '../../../app/hooks/search/useSearchOptions';
import { QueryStringKeys, useSearchQuery } from '../../../app/hooks/search/useSearchQuery';
import { EntityTags } from '../../../components/idea/types';

export const useSearchBrands = () => {
  const { keywords, initKeywords, setKeywords } = useSearchKeywords();
  const { setCategories, categories, clearCategories } = useSearchCategories();
  const { searchOptions, setOffset, setRecordsLimit, setSortMethod, getCurrentPage } = useSearchOptions();
  const { setFilters, filters, setFilter, clearFilters, removeFilter, initialFilters } = useSearchFilters();
  const { queryString } = useSearchQuery({
    searchOptions,
    filters,
    keywords,
    categories,
  });

  const getQueryPayload = () => {
    const brandsFilters: Record<string, string> = {};
    const [brandsTypeFilterValue] = filters[FilterKey.TYPE] || [];
    if (brandsTypeFilterValue) {
      brandsFilters[FilterKey.TYPE] = brandsTypeFilterValue;
    }
    const queryPayload = {
      [QueryStringKeys.KEYWORDS]: keywords,
      [QueryStringKeys.FILTERS]: JSON.stringify(brandsFilters),
      [QueryStringKeys.SORT_METHOD]: searchOptions.sortMethod,
      [QueryStringKeys.OFFSET]: searchOptions.offset,
      [QueryStringKeys.LIMIT]: searchOptions.recordsLimit,
      [QueryStringKeys.INDEX]: EntityTags.BRANDS,
    };
    return queryPayload;
  };

  const clear = () => {
    setKeywords('');
    setOffset(0);
    clearCategories();
    clearFilters();
  };

  return {
    clear,
    filters,
    setFilter,
    setKeywords,
    searchOptions,
    getCurrentPage,
    getQueryPayload,
    queryString,
    setOffset,
    setRecordsLimit,
    setSortMethod,
    setFilters,
    setCategories,
    categories,
    keywords,
    initKeywords,
    removeFilter,
    initialFilters,
  };
};
