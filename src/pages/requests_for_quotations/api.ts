import { requestAuthGraphqlOperation, requestAuthGraphqlOperationStrict, requestGraphqlOperation } from '../../utils';
import * as customQueries from '../../custom_graphql/queries';
import * as customMutations from '../../custom_graphql/mutations';
import { ListQuotationInput, QuotationList, SendRFQInput } from './types';
import {
  AcceptQuotationInput,
  ListRFQInput,
  Quotation,
  SendQuotationInput,
  ServiceInquiry,
  ServiceInquiryList,
} from '../../API';

// Queries
interface Results<T> {
  results: T[];
}

export const listMyQuotations = async (input: ListQuotationInput) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listMyQuotations, {
    input,
  })) as {
    data?: {
      ListMyQuotations: QuotationList;
    };
  };
  return response.data?.ListMyQuotations;
};

export const listRfq = async (input: ListRFQInput) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listRfq, {
    input,
  })) as ServiceInquiryList;

  return response;
};

// Mutations
export const sendRFQ = async (input: SendRFQInput) => {
  const response = (await requestAuthGraphqlOperation(customMutations.sendRFQ, {
    input,
  })) as ServiceInquiry;
  return response;
};

export const sendQuotation = async (input: SendQuotationInput) => {
  const response = (await requestAuthGraphqlOperation(customMutations.sendQuotation, {
    input,
  })) as Quotation;
  return response;
};

export const acceptQuotation = async (input: AcceptQuotationInput) => {
  const response = (await requestAuthGraphqlOperation(customMutations.acceptQuotation, {
    input,
  })) as Quotation;
  return response;
};
