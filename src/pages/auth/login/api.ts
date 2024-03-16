import { Auth } from 'aws-amplify';
import { LoginParams } from './types';
import { requestAuthGraphqlOperation, requestGraphqlOperation } from '../../../utils';
import * as mutations from '../../../custom_graphql/mutations';
import { Client } from '../../../API';

export enum UserType {
  HOMEOWNER = 'HOMEOWNER',
  PROFESSIONAL = 'PROFESSIONAL',
}

interface CompleteRegistrationInput {
  user_type: UserType;
}

export const loginWithCognito = async ({ username, password }: LoginParams) => {
  const user = await Auth.signIn({
    username,
    password,
  });

  return { user: { ...user, userConfirmed: user.attributes?.email_verified } };
};

export const completeClientRegistration = async (input: CompleteRegistrationInput) => {
  const response = (await requestAuthGraphqlOperation(mutations.completeRegistration, {
    input,
  })) as {
    data: {
      completeRegistration: Client;
    };
  };
  return response.data.completeRegistration;
};
