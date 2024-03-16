import { useSearchCategories } from '../../../app/hooks/search/useSearchCategories';
import { FilterKey, useSearchFilters } from '../../../app/hooks/search/useSearchFilters';
import { useSearchKeywords } from '../../../app/hooks/search/useSearchKeywords';
import { useSearchOptions } from '../../../app/hooks/search/useSearchOptions';
import { QueryStringKeys, useSearchQuery } from '../../../app/hooks/search/useSearchQuery';
import { EntityTags } from '../../../components/idea/types';

type FiltersPayload = Record<FilterKey, string[] | boolean>;

export const useSearchProfessionals = () => {
  const { keywords, setKeywords, updateKeywordsSearchParamsFromUrl } = useSearchKeywords();
  const { setCategories, categories, clearCategories, updateCategoriesSearchParamsFromUrl } = useSearchCategories();
  const { searchOptions, setOffset, setRecordsLimit, setSortMethod, getCurrentPage, updateSearchOptionsFromUrl } =
    useSearchOptions();

  const {
    setFilters,
    filters,
    setFilter,
    clearFilters,
    removeFilter,
    initialFilters,
    updateFiltersSearchParamsFromUrl,
  } = useSearchFilters();

  const { queryString } = useSearchQuery({
    searchOptions,
    filters,
    keywords,
    categories,
  });

  const updateSearchParamsFromUrl = () => {
    updateCategoriesSearchParamsFromUrl();
    updateKeywordsSearchParamsFromUrl();
    updateSearchOptionsFromUrl();
    updateFiltersSearchParamsFromUrl();
  };

  const getQueryPayload = (filtersPayload: Partial<FiltersPayload>) => {
    const filtersParams = { ...filtersPayload } as Partial<FiltersPayload>;
    if (filtersParams.is_verified === false) {
      delete filtersParams.is_verified;
    }
    const queryPayload = {
      [QueryStringKeys.KEYWORDS]: keywords,
      [QueryStringKeys.FILTERS]: JSON.stringify(filtersPayload),
      [QueryStringKeys.SORT_METHOD]: searchOptions.sortMethod,
      [QueryStringKeys.OFFSET]: searchOptions.offset,
      [QueryStringKeys.LIMIT]: searchOptions.recordsLimit,
      [QueryStringKeys.INDEX]: EntityTags.PROFESSIONALS,
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
    removeFilter,
    initialFilters,
    updateSearchParamsFromUrl,
  };
};
