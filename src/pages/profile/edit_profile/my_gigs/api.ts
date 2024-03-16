import { GigSuggestionInput, ListProfessionalGigsQuery, Pagination } from '../../../../API';
import { requestAuthGraphqlOperationStrict, requestGraphqlOperation } from '../../../../utils';
import * as customQueries from '../../../../custom_graphql/queries';
import * as customMutations from '../../../../custom_graphql/mutations';

import { GigItemOutput, GigItemInput } from './types';

export const ListProfessionalGigs = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listProfessionalGigs, { input })) as {
    data: ListProfessionalGigsQuery;
  };

  return response.data?.ListProfessionalGigs;
};

export const listGigsTitleSuggestions = async (input: GigSuggestionInput) => {
  const response = await requestAuthGraphqlOperationStrict(customQueries.listGigsTitleSuggestions, { input });

  return response.data?.listGigsTitleSuggestions;
};

export const submitGigService = async (input: GigItemInput) => {
  const response = await requestAuthGraphqlOperationStrict<'submitGigService', GigItemOutput>(
    customMutations.submitAddGigService,
    {
      input,
    }
  );
  return response.data;
};

export const updateGigService = async (input: GigItemInput) => {
  const response = await requestAuthGraphqlOperationStrict<'updateGigService', GigItemOutput>(
    customMutations.submitEditGigService,
    {
      input,
    }
  );
  return response.data;
};
