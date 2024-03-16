import { Auth } from 'aws-amplify';
import { ForgetPasswordProps } from './types';

export const forgetPasswordWithCognito = async ({ username }: ForgetPasswordProps) => {
  const result = await Auth.forgotPassword(username);
  return result;
};
