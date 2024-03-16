import { Pagination } from '../../../API';
import * as queries from '../../../graphql/queries';
import * as customQueries from '../../../custom_graphql/queries';
import { requestGraphqlOperation } from '../../../utils';
import { GetBannerDetails, ListDepartmentsFromApi, ListHomePageSpecialStockRecords } from './types';

export const listDepartments = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listDepartments, { input })) as ListDepartmentsFromApi;
  return response.data.listDepartments;
};

export const getBannerDetails = async () => {
  const response = (await requestGraphqlOperation(queries.getBannerDetails)) as GetBannerDetails;
  return response.data.getBannerDetails;
};

export const listHomePageSpecialStockRecords = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listHomePageSpecialStockRecords, {
    input: { ...input, platform: 'Web' },
  })) as ListHomePageSpecialStockRecords;
  return response.data.listHomePageSpecialStockRecords;
};
