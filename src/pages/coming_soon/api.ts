import { AddPartnerMutation, PartnerInput } from '../../API';
import * as mutation from '../../graphql/mutations';
import { requestGraphqlOperation } from '../../utils';

export const addPartner = async (input: PartnerInput) => {
  const response = (await requestGraphqlOperation(mutation.addPartner, { input })) as {
    data: AddPartnerMutation;
  };
  return response.data.addPartner;
};
