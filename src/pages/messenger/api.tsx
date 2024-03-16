import * as mutations from '../../custom_graphql/mutations';
import { SendBirdChatGroupInput } from '../../API';
import { requestAuthGraphqlOperation } from '../../utils';
import { CreateSendBirdChatGroupApiSchema } from './types';

export const createSendBirdChatGroup = async (values: SendBirdChatGroupInput) => {
  const chat = (await requestAuthGraphqlOperation(mutations.createSendBirdChatGroup, {
    input: values,
  })) as CreateSendBirdChatGroupApiSchema;
  return chat?.data?.createSendBirdChatGroup;
};
