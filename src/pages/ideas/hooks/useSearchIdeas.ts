import { useEffect, useMemo, useState } from 'react';
import { useSearchCategories } from '../../../app/hooks/search/useSearchCategories';
import { useSearchFilters } from '../../../app/hooks/search/useSearchFilters';
import { useSearchKeywords } from '../../../app/hooks/search/useSearchKeywords';
import { useSearchOptions } from '../../../app/hooks/search/useSearchOptions';
import { QueryStringKeys, useSearchQuery } from '../../../app/hooks/search/useSearchQuery';
import { EntityTags } from '../../../components/idea/types';
import { useFiltersSource } from '../../../app/hooks/filters/useFiltersSource';
import { useMainContext } from '../../../app/providers/main';
import { search, searchProjects } from '../api';
import {
  Idea,
  Project,
  ProjectSearchFilterName,
  ProjectSearchFilterValue,
  SearchData,
  SearchSortBy,
} from '../../../API';

export const useSearchIdeas = () => {
  const { requestApi } = useMainContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [totoalProjects, setTotalProjects] = useState(0);
  const { searchOptions, setOffset, setRecordsLimit, setSortMethod, getCurrentPage } = useSearchOptions();
  const { setFilters, filters, clearFilters, removeFilter, initialFilters } = useSearchFilters();
  const { categories, setCategories, deleteCategories } = useSearchCategories();
  const { filtersSource, setFiltersSourceString, filtersCache } = useFiltersSource();
  const { keywords, setKeywords } = useSearchKeywords();
  const { queryString, getQueryString } = useSearchQuery({
    searchOptions,
    filters,
    keywords,
    categories,
  });
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);

  const getQueryPayload = () => {
    const queryPayload = {
      [QueryStringKeys.FILTERS]: JSON.stringify(filters),
      [QueryStringKeys.SORT_METHOD]: searchOptions.sortMethod,
      [QueryStringKeys.OFFSET]: searchOptions.offset,
      [QueryStringKeys.LIMIT]: searchOptions.recordsLimit,
      [QueryStringKeys.INDEX]: EntityTags.PROJECTS,
      [QueryStringKeys.CATEGORIES]: categories.join(','),
      [QueryStringKeys.KEYWORDS]: keywords,
    };

    const filtersArray = Object.keys(filters).map((key) => {
      const filter = filters[key as keyof typeof filters];
      return {
        name: key,
        values: filter,
      };
    });
    const filterArrayFromEmpty = filtersArray.filter((filter) => filter?.values?.length! > 0);

    const payload = {
      text: keywords,
      pagination: {
        offset: searchOptions.offset,
        limit: searchOptions.recordsLimit,
      },
      sortBy: searchOptions.sortMethod ? searchOptions.sortMethod : SearchSortBy.MostRecent,
      categories: categories ? categories : '',
      filters: filters ? filterArrayFromEmpty : '',
    };

    return payload;
  };

  const clear = () => {
    setOffset(0);
    clearFilters();
    setCategories([]);
    setKeywords('');
  };

  const updateProjects = () => {
    setIsIdeaLoading(true);
    requestApi(
      searchProjects,
      getQueryPayload(),
      (response: { results: Project[]; count: number; filters: ProjectSearchFilterName[] }, error: string) => {
        if (error) {
          return;
        }
        setIsIdeaLoading(false);
        const { results, count, filters } = response;

        setProjects(results);
        // convert filters array of objects to object of Objects

        setFiltersSourceString(filters);
        setTotalProjects(count);
      }
    );
  };
  const filtersReady = useMemo(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  return {
    clear,
    filters,
    updateProjects,
    totoalProjects,
    projects,
    searchOptions,
    getCurrentPage,
    getQueryPayload,
    queryString,
    getQueryString,
    setOffset,
    setRecordsLimit,
    setSortMethod,
    setFilters,
    setKeywords,
    keywords,
    setCategories,
    categories,
    deleteCategories,
    removeFilter,
    filtersSource,
    setFiltersSourceString,
    isIdeaLoading,
    filtersCache,
    initialFilters,
    filtersReady,
  };
};
