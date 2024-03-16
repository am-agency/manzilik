import { ContactUsInput, Pagination } from '../../API';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { requestGraphqlOperation } from '../../utils';
import { ListFAQsFromApi, ContactUsInputsApi } from './types';

export const listFAQs = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(queries.listFAQs, { input })) as ListFAQsFromApi;
  return response.data.listFAQs;
};

export const sendContactForm = async (input: ContactUsInput) => {
  const response = (await requestGraphqlOperation(mutations.contactUs, { input })) as ContactUsInputsApi;
  return response.data.contactUs;
};
