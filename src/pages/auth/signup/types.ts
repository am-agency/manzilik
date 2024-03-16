import { CognitoUser } from '@aws-amplify/auth';

export interface UserAttributes {
  sub: string;
  email: string;
  email_verified: string;
  name: string;
  updated_at: string;
  'custom:user_group': string;
}

export interface CognitoUserExt extends CognitoUser {
  attributes: UserAttributes;
}

export interface SignupParams {
  username: string;
  password?: string;
  role?: string;
}
