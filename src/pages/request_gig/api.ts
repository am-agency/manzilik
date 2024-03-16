import {
  GetGigServiceDetailsQuery,
  ListGigServiceInput,
  ListGigServicesQuery,
  ListSimilarGigServicesQuery,
  ListSimilarInput,
  Pagination,
  ProfessionalGigsList,
  ServiceList,
} from '../../API';
import { requestGraphqlOperation } from '../../utils';
import * as customQueries from '../../custom_graphql/queries';
import * as queries from '../../graphql/queries';

export interface ListGigsServicesFromApi {
  data: { listServices: ServiceList };
}

export interface ListGigsServicesItemFromApi {
  data: { ListGigServices: ProfessionalGigsList };
}

export const ListGigsServices = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listGigsServices, {
    input,
  })) as ListGigsServicesFromApi;
  return response.data?.listServices?.results;
};

export const ListGigsServicesItem = async (input: ListGigServiceInput) => {
  const response = (await requestGraphqlOperation(customQueries.listGigsServicesItem, {
    input,
  })) as ListGigsServicesItemFromApi;
  return response.data?.ListGigServices;
};

export const GetGigServiceDetails = async (id: string) => {
  const response = (await requestGraphqlOperation(customQueries.getGigServiceDetails, id)) as {
    data: GetGigServiceDetailsQuery;
  };

  return response?.data?.getGigServiceDetails;
};

export const listSimilarGigs = async (input: ListSimilarInput) => {
  const response = (await requestGraphqlOperation(queries.ListSimilarGigServices, {
    input: {
      ...input,
      id: '',
    },
  })) as {
    data: ListSimilarGigServicesQuery;
  };

  return response.data.ListSimilarGigServices;
};
