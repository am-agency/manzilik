import { Basket, Client } from '../../../API';
import { User, UserRole } from '../../types';

export enum AuthActions {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CONFIRM_CODE = 'CONFIRM_CODE',
  SET_CLIENT = 'SET_CLIENT',
  SET_CLIENT_BASKET = 'SET_CLIENT_BASKET',
}

export const loginActionCreator = (user: User, role: UserRole) => ({
  type: AuthActions.LOGIN,
  payload: {
    user,
    role,
  },
});

export const setClientBasketActionCreator = (basket: Basket) => {
  return {
    type: AuthActions.SET_CLIENT_BASKET,
    payload: {
      basket,
    },
  };
};

export const confirmCodeActionCreator = () => ({
  type: AuthActions.CONFIRM_CODE,
});

export const logoutActionCreator = () => ({
  type: AuthActions.LOGOUT,
});

export const setClientActionCreator = (client: Client) => ({
  type: AuthActions.SET_CLIENT,
  payload: { client },
});
