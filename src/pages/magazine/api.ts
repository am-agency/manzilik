import * as queries from '../../graphql/queries';
import * as customQueries from '../../custom_graphql/queries';

import { requestAuthGraphqlOperation, requestGraphqlOperation } from '../../utils';
import {
  FindRelated,
  FindRelatedQuery,
  GetMagazineQuery,
  GetTVQuery,
  ListCategoriesWithSubCategoriesQuery,
  ListMagazinesQuery,
  ListRecentMagazinesQuery,
  ListTVsQuery,
  Pagination,
} from '../../API';

export const listTVs = async (params: { input: Pagination; isAuthenticated: boolean }) => {
  const { input, isAuthenticated } = params;
  const gqlOperation = isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const response = (await gqlOperation(customQueries.listTVs, { input })) as {
    data: ListTVsQuery;
  };
  return { tvList: response.data.listTVs?.results, count: response.data.listTVs?.count };
};

export const getTVDetails = async (params: { id: string; isAuthenticated: boolean }) => {
  const { id, isAuthenticated } = params;
  const gqlOperation = isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const response = (await gqlOperation(customQueries.getTV, { id })) as { data: GetTVQuery };
  return response.data.getTV;
};

export const listMagazines = async (params: { input: Pagination; isAuthenticated: boolean }) => {
  const gqlOperation = params.isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const {
    data: { listMagazines },
  } = (await gqlOperation(customQueries.listMagazines, { input: params.input })) as {
    data: ListMagazinesQuery;
  };
  return {
    magazines: listMagazines?.results,
    count: listMagazines?.count,
  };
};

export const getMagazineDetailsFromApi = async (params: { id: Pagination; isAuthenticated: boolean }) => {
  const gqlOperation = params.isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const response = (await gqlOperation(customQueries.getMagazine, { id: params.id })) as {
    data: GetMagazineQuery;
  };
  return response.data.getMagazine;
};

export const getRelatedStories = async (params: FindRelated) => {
  const response = (await requestGraphqlOperation(queries.findRelated, { input: params })) as {
    data: FindRelatedQuery;
  };
  return response.data.findRelated.results;
};

export const listMagazinesCategories = async () => {
  const response = (await requestGraphqlOperation(customQueries.listCategoriesWithSubCategories)) as {
    data: ListCategoriesWithSubCategoriesQuery;
  };
  return response.data.listCategoriesWithSubCategories?.result;
};

export const listRecentMagazines = async (id: string) => {
  const response = (await requestGraphqlOperation(customQueries.listRecentMagazines, { input: id })) as {
    data: ListRecentMagazinesQuery;
  };
  return response.data.listRecentMagazines?.results;
};
