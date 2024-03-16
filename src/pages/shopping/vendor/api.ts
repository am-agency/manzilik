import { GetPartnerQuery } from '../../../API';
import * as customQueries from '../../../custom_graphql/queries';
import { requestAuthGraphqlOperation, requestGraphqlOperation } from '../../../utils';

export const getPartner = async (params: { id: string; isAuthenticated: boolean }) => {
  const { id, isAuthenticated } = params;
  const query = isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const response = (await query(customQueries.getPartner, { id })) as {
    data: GetPartnerQuery;
  };
  return response.data.getPartner;
};
