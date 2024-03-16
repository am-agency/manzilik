import { Pagination, ServiceInquiry } from '../../../../API';
import { requestAuthGraphqlOperationStrict } from '../../../../utils';
import {
  ServiceInquiryDetails,
  ServiceInquiryListItem,
  ServiceInquiryRejectionReason,
} from '../../../professionals/request_professional_service/types';
import * as customQueries from '../../../../custom_graphql/queries';
import * as customMutations from '../../../../custom_graphql/mutations';

interface Results<T> {
  results: T[];
}

export const listReceivedServiceInquiries = async (input: Pagination) => {
  const response = await requestAuthGraphqlOperationStrict<'listReceivedServiceInquiries', Results<ServiceInquiry>>(
    customQueries.listReceivedServiceInquiries,
    {
      input,
    }
  );
  return response.data?.listReceivedServiceInquiries;
};

export const listSentServiceInquiries = async (input: Pagination) => {
  const response = await requestAuthGraphqlOperationStrict<'listSentServiceInquiries', Results<ServiceInquiry>>(
    customQueries.listSentServiceInquiries,
    {
      input,
    }
  );
  return response.data?.listSentServiceInquiries.results;
};

export const getServiceInquiry = async (id: string) => {
  const response = await requestAuthGraphqlOperationStrict<'getServiceInquiry', ServiceInquiryDetails>(
    customQueries.getServiceInquiry,
    { id }
  );
  return response.data?.getServiceInquiry;
};

export const listServiceInquiryRejectionReason = async (input: Pagination) => {
  const response = await requestAuthGraphqlOperationStrict<
    'listServiceInquiryRejectionReason',
    Results<ServiceInquiryRejectionReason[]>
  >(customQueries.listServiceInquiryRejectionReason, { input });
  return response.data?.listServiceInquiryRejectionReason.results;
};

export interface RespondServiceInquiryInput {
  id: string;
  rejection_note?: string;
  rejection_reasons?: string[];
  response: 'ACCEPT' | 'REJECT';
}

export interface CompleteServiceInquiryInput {
  id: string;
  completed_by: string;
}
export interface CancelServiceInquiryInput {
  id: string;
  canceled_by: string;
  note: string;
}

export interface RespondServiceInquiryOutput {
  message: string;
  status: string;
}

export const respondServiceInquiry = async (input: RespondServiceInquiryInput) => {
  const response = await requestAuthGraphqlOperationStrict<'respondServiceInquiry', RespondServiceInquiryOutput>(
    customMutations.respondServiceInquiry,
    { input }
  );
  return response.data?.respondServiceInquiry;
};

export const completeServiceInquiry = async (input: CompleteServiceInquiryInput) => {
  const response = await requestAuthGraphqlOperationStrict<'completeServiceInquiry', RespondServiceInquiryOutput>(
    customMutations.completeServiceInquiry,
    { input }
  );
  return response.data?.completeServiceInquiry;
};

export const cancelServiceInquiry = async (input: CancelServiceInquiryInput) => {
  const response = await requestAuthGraphqlOperationStrict<'cancelServiceInquiry', RespondServiceInquiryOutput>(
    customMutations.cancelServiceInquiry,
    { input }
  );
  return response.data?.cancelServiceInquiry;
};
