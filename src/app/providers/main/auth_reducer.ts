import Logger from 'js-logger';
import { UserState, initialUserState } from '../user';
import { GlobalAction, UserRole } from '../../types';
import { AuthActions } from './actions';

/**
 * user reducer
 * @param state UserState
 * @param action GlobalAction
 */
export const authReducer = (state: UserState = initialUserState, action: GlobalAction) => {
  Logger.debug('auth_reducer', action);
  switch (action.type) {
    case AuthActions.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        isUserConfirmed: action?.payload?.user?.userConfirmed,
        isAuthenticated: true,
        isUserLoaded: true,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        role: UserRole.Guest,
        isAuthenticated: false,
        isUserConfirmed: false,
        isUserLoaded: true,
        client: null,
      };
    case AuthActions.CONFIRM_CODE:
      return {
        ...state,
        isUserConfirmed: true,
      };
    case AuthActions.SET_CLIENT:
      return {
        ...state,
        client: action.payload.client,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case AuthActions.SET_CLIENT_BASKET:
      return {
        ...state,
        basket: action.payload.basket,
      };
    default:
      return state;
  }
};
