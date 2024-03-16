import {
  AutoCompleteInput,
  AutoCompleteQuery,
  Idea,
  Pagination,
  Project,
  SearchFilterInput,
  SearchInput,
  SearchSortBy,
} from '../../API';
import * as queries from '../../graphql/queries';
import * as customQueries from '../../custom_graphql/queries';
import { requestGraphqlOperation } from '../../utils';
import {
  GetSearchIdeasFromApi,
  GetFiltersFromApi,
  ListCategoriesFromApi,
  GetCategoryFromApi,
  ListRelatedStockRecordsFromApi,
  ListRelatedStockRecordsResponse,
} from './types';

export const search = async (input: SearchInput) => {
  const response = (await requestGraphqlOperation(queries.search, { input })) as GetSearchIdeasFromApi;
  return response.data.search;
};
export const searchProjects = async (input: {
  text: string;
  pagination: Pagination;
  sortBy?: SearchSortBy;
  filters: [SearchFilterInput];
  categories: [string];
}) => {
  const { text, pagination, sortBy, filters, categories } = input;
  const response = (await requestGraphqlOperation(customQueries.searchProjects, {
    text,
    pagination,
    sortBy,
    filters,
    categories,
  })) as {
    data: {
      searchProjects: {
        count: number;
        results: [Project];
      };
    };
  };

  return response.data?.searchProjects;
};

export const listFilters = async () => {
  const response = (await requestGraphqlOperation(queries.listFilters)) as GetFiltersFromApi;
  return JSON.parse(response.data.listFilters.filters!);
};

export const listCategories = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listCategories, { input })) as ListCategoriesFromApi;
  return response.data.listCategories;
};

export const getCategory = async (id: string) => {
  const response = (await requestGraphqlOperation(customQueries.getCategory, id)) as GetCategoryFromApi;
  return response.data.getCategory;
};

export const getAutoComplete = async (input: AutoCompleteInput) => {
  const response = (await requestGraphqlOperation(queries.autoComplete, { input })) as { data: AutoCompleteQuery };
  return response.data.autoComplete;
};

export const listRelatedStockRecords = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listRelatedStockRecords, {
    input,
  })) as ListRelatedStockRecordsResponse;
  return response.data.listRelatedStockRecords;
};
