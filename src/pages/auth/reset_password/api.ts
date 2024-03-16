import { Auth } from 'aws-amplify';
import { ResetNewPassword } from './types';

export const resetNewPassword = async (values: ResetNewPassword) => {
  const result = await Auth.forgotPasswordSubmit(values.username, values.code, values.password);
  return result;
};
