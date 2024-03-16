import { Basket, Client, Professional } from '../../../API';
import { User, UserRole } from '../../types';
type MaybeUser = User | null;
type MaybeProfessional = Professional | null;

export interface UserState {
  user?: MaybeUser;
  client?: Client;
  professional?: MaybeProfessional;
  isAuthenticated: boolean;
  isUserConfirmed: boolean;
  role: UserRole;
  isUserLoaded: boolean;
  basket?: Basket;
}

export const initialUserState: UserState = {
  user: null,
  role: UserRole.Guest,
  professional: null,
  isAuthenticated: false,
  isUserConfirmed: false,
  isUserLoaded: false,
};
