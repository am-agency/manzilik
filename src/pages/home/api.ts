import { API } from 'aws-amplify';
import * as customQueries from '../../custom_graphql/queries';

import { GetHomePageSliderFromApi, ListProjectsFromApi, PaginationWithAuth } from './types';
import { requestAuthGraphqlOperation, requestGraphqlOperation } from '../../utils';

export const listHomePageProjects = async (params: PaginationWithAuth) => {
  const gqlOperation = params.isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  delete params?.isAuthenticated;
  const response = (await gqlOperation(customQueries.listFeeds, { input: params })) as ListProjectsFromApi;
  return response.data.listFeeds;
};

export const getHomePageSlider = async () => {
  const response = (await requestGraphqlOperation(customQueries.getHomePageSlider)) as GetHomePageSliderFromApi;
  return JSON.parse(response.data.getHomePageSlider.result);
};
