import { requestAuthGraphqlOperationStrict, requestGraphqlOperationStrict } from '../../../utils';
import { ListCategoriesOutput, ListRoomTypesOutput, ServiceInquiryInput, ServiceInquiryOutput } from './types';
import * as customMutations from '../../../custom_graphql/mutations';
import * as customQueries from '../../../custom_graphql/queries';
import { Pagination } from '../../../API';

export const listCategories = async (input: Pagination) => {
  const response = await requestGraphqlOperationStrict<'listCategories', ListCategoriesOutput>(
    customQueries.listCategories,
    {
      input,
    }
  );
  return response.data?.listCategories.results;
};

export const listRoomTypes = async (input: Pagination) => {
  const response = await requestGraphqlOperationStrict<'listRoomTypes', ListRoomTypesOutput>(
    customQueries.listRoomTypes,
    {
      input,
    }
  );
  return response.data?.listRoomTypes.results;
};

export const submitServiceInquiry = async (input: ServiceInquiryInput) => {
  const response = await requestAuthGraphqlOperationStrict<'submitServiceInquiry', ServiceInquiryOutput>(
    customMutations.submitServiceInquiry,
    {
      input,
    }
  );
  return response.data?.submitServiceInquiry;
};
