import { requestAuthGraphqlOperation } from '../../utils';
import * as customQueries from '../../custom_graphql/queries';
import { Pagination } from '../../API';
import { GetClientFromApi } from '../../pages/profile/types';

export const getClientBadges = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listBadges, {
    input,
  })) as GetClientFromApi;
  return response.data;
};
