import { requestAuthGraphqlOperation, requestGraphqlOperation } from '../../utils';
import * as customQueries from '../../custom_graphql/queries';

import {
  GetClientApi,
  ListClientFolloweesByIdApi,
  ListClientFollowersByIdApi,
  ListClientIdeasByClientIdApi,
} from './types';
import { Pagination } from '../../API';
import { PaginationWithAuth } from '../home/types';

export const getClientIdeasList = async (params: { values: Pagination; user: boolean }) => {
  const request = params.user ? requestAuthGraphqlOperation : requestGraphqlOperation;

  const response = (await request(customQueries.listClientIdeasByClientId, {
    input: params.values,
  })) as ListClientIdeasByClientIdApi;
  return response.data.listClientIdeasByClientId;
};

export const getClient = async ({ values, user }: { values: { id: string }; user: boolean }) => {
  const request = user ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const response = (await request(customQueries.getClient, { id: values.id })) as GetClientApi;
  return response.data.getClient;
};

export const getClientFollowers = async (params: PaginationWithAuth) => {
  const request = params.isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  delete params?.isAuthenticated;
  const response = (await request(customQueries.listFollowersByClientId, {
    input: params,
  })) as ListClientFollowersByIdApi;
  return response.data.listFollowersByClientId;
};

export const getClientFollowees = async (params: PaginationWithAuth) => {
  const request = params.isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  delete params?.isAuthenticated;
  const response = (await request(customQueries.listFolloweesByClientId, {
    input: params,
  })) as ListClientFolloweesByIdApi;
  return response.data.listFolloweesByClientId;
};
