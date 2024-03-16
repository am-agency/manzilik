import { Basket } from '../API';

export interface GlobalAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}
export interface User {
  username: string;
  email: string;
  name: string;
  family_name: string;
  first_name?: string;
  last_name: string;
  sub: string;
  picture?: string;
  isUserLoaded: boolean;
  basket?: Basket;
  type: UserRole.Professional | UserRole.HomeOwner;
}

export enum UserRole {
  Professional = 'PROFESSIONAL',
  HomeOwner = 'HOMEOWNER',
  Guest = 'GUEST',
}

export enum AppSyncAuthenticationType {
  AMAZON_COGNITO_USER_POOLS = 'AMAZON_COGNITO_USER_POOLS',
  API_KEY = 'API_KEY',
}

export const userNotConfirmedException = 'UserNotConfirmedException';
