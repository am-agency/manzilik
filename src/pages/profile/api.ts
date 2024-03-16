import { API } from 'aws-amplify';
import * as queries from '../../graphql/queries';
import * as customQueries from '../../custom_graphql/queries';

import * as mutations from '../../graphql/mutations';
import { graphqlAuthenticationOperation, requestAuthGraphqlOperation, requestGraphqlOperation } from '../../utils';
import {
  AddAddressMutation,
  ClientAddressInput,
  DeleteAddressMutation,
  EditClientProfileInput,
  GetAuthenticatedProfessionalQuery,
  GetOrderByIdQuery,
  GetOrderByNumberQuery,
  ListMyOrdersQuery,
  ListNeighborhoodsQuery,
  ListOrderProductsGroupedByPartnerQuery,
  ListOrderProductsQuery,
  OrderListInput,
  Pagination,
  UpdateAddressMutation,
} from '../../API';
import { GetClientFromApi, ListCitiesFromApi, ListCountriesFromApi, UpdateAccountInformationFromApi } from './types';

export const updateAccountInformation = async (values: EditClientProfileInput) => {
  const accountInformation = (await API.graphql(
    graphqlAuthenticationOperation(mutations.editProfile, {
      input: values,
    })
  )) as UpdateAccountInformationFromApi;
  return accountInformation.data.editProfile;
};

export const completeProfile = async (values: EditClientProfileInput) => {
  const accountInformation = (await API.graphql(
    graphqlAuthenticationOperation(mutations.editProfile, {
      input: values,
    })
  )) as UpdateAccountInformationFromApi;
  return accountInformation.data.editProfile;
};

export const getClient = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.getAuthenticatedClient, {
    input,
  })) as GetClientFromApi;
  return response.data.getAuthenticatedClient;
};

export const getClientAddresses = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.getClientAddresses, {
    input,
  })) as GetClientFromApi;
  return response.data.getAuthenticatedClient;
};

export const getAuthenticatedProfessional = async () => {
  const response = (await requestAuthGraphqlOperation(customQueries.getAuthenticatedProfessional)) as {
    data: GetAuthenticatedProfessionalQuery;
  };
  return response.data.getAuthenticatedProfessional;
};

export const listCountries = async (input: Pagination) => {
  const countries = (await requestGraphqlOperation(queries.listCountries, { input })) as ListCountriesFromApi;
  return countries.data.listCountries?.results;
};

export const listCities = async (input: Pagination) => {
  const cities = (await requestGraphqlOperation(queries.listCities, { input })) as ListCitiesFromApi;
  return cities.data.listCities?.results;
};

export const addAddress = async (input: ClientAddressInput) => {
  const cities = (await requestAuthGraphqlOperation(mutations.addAddress, { input })) as { data: AddAddressMutation };
  return cities.data.addAddress;
};

export const updateAddress = async (input: ClientAddressInput) => {
  const cities = (await requestAuthGraphqlOperation(mutations.updateAddress, { input })) as {
    data: UpdateAddressMutation;
  };
  return cities.data.updateAddress;
};

export const getNeighborhoods = async (input: Pagination) => {
  const cities = (await requestGraphqlOperation(queries.listNeighborhoods, { input })) as {
    data: ListNeighborhoodsQuery;
  };
  return cities.data.listNeighborhoods;
};

export const deleteAddress = async (id: string) => {
  const cities = (await requestAuthGraphqlOperation(mutations.deleteAddress, id)) as {
    data: DeleteAddressMutation;
  };
  return cities.data.deleteAddress;
};

export const getMyOrders = async (input: OrderListInput) => {
  const result = (await requestAuthGraphqlOperation(customQueries.listMyOrders, { input })) as {
    data: ListMyOrdersQuery;
  };
  return result.data.listMyOrders;
};

export const getOrderById = async (id: string) => {
  const result = (await requestAuthGraphqlOperation(customQueries.getOrderById, id)) as {
    data: GetOrderByIdQuery;
  };
  return result.data.getOrderById;
};

export const listOrderProducts = async (input: Pagination) => {
  const result = (await requestAuthGraphqlOperation(customQueries.listOrderProductsGroupedByPartner, { input })) as {
    data: ListOrderProductsGroupedByPartnerQuery;
  };
  return result.data.listOrderProductsGroupedByPartner;
};

export const getOrderByNumber = async (id: string) => {
  const result = (await requestAuthGraphqlOperation(customQueries.getOrderByNumber, id)) as {
    data: GetOrderByNumberQuery;
  };
  return result.data.getOrderByNumber;
};

export const getClientDraftServiceInquiry = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.getClientDraftService, {
    input,
  })) as GetClientFromApi;
  return response.data.getAuthenticatedClient;
};
