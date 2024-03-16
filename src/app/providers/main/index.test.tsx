import React from 'react';
import { MainProvider, useMainContext } from '.';
import { mockUser } from '../../../mocks/data-mock/utils';
import { UserRole } from '../../types';
import { AuthActions, confirmCodeActionCreator, loginActionCreator, logoutActionCreator } from './actions';
import { authReducer } from './auth_reducer';

describe('Actions and AuthReducer test case', () => {
  it('logout  action should return action object', () => {
    const expected = {
      type: AuthActions.LOGOUT,
    };
    const result = logoutActionCreator();
    expect(result).toEqual(expected);
  });

  describe('confirmCodeActionCreator action', () => {
    it('confirmCodeActionCreator  action should return action object', () => {
      expect(confirmCodeActionCreator()).toEqual({
        type: AuthActions.CONFIRM_CODE,
      });
    });
  });

  it('loginActionCreator  action should return action object', () => {
    expect(loginActionCreator(mockUser, UserRole.HomeOwner)).toEqual({
      type: AuthActions.LOGIN,
      payload: {
        role: 'HomeOwner',
        user: mockUser,
      },
    });
  });

  it('should return the login action payload as user object', () => {
    const action = loginActionCreator(mockUser, UserRole.HomeOwner);
    expect(
      authReducer(
        {
          user: undefined,
          isAuthenticated: false,
          isUserConfirmed: false,
          role: UserRole.Guest,
        },
        action
      ).user
    ).toEqual(action.payload.user);
  });

  it('should return user confirmed when confirmCodeAction is fired', () => {
    const action = confirmCodeActionCreator();
    expect(
      authReducer(
        {
          user: undefined,
          isAuthenticated: false,
          isUserConfirmed: false,
          role: UserRole.Guest,
        },
        action
      ).isUserConfirmed
    ).toBeTruthy();
  });

  it('should return user null and isAuthenticated as false when logoutAction is fired', () => {
    const action = logoutActionCreator();
    expect(
      authReducer(
        {
          user: mockUser,
          isAuthenticated: true,
          isUserConfirmed: true,
          role: UserRole.HomeOwner,
        },
        action
      )
    ).toEqual({
      isUserConfirmed: false,
      isAuthenticated: false,
      role: '',
      user: null,
    });
  });
});

describe('Main Provider test case', () => {
  it('MainProvider should be defined', () => {
    expect(MainProvider).toBeDefined();
  });

  it('useMainContext should be defined', () => {
    expect(useMainContext).toBeDefined();
  });
});
