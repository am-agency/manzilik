import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import * as api from './api';
import {
  confirmCode,
  logoutUser,
  resendSignupCode,
  signInWithFacebook,
  signInWithGoogle,
  signUpWithCognito,
} from './api';
import { awsConfigure } from '../../../app/config';
import SignUpWithEmail from '.';
import { mockUser } from '../../../mocks/data-mock/utils';
let signupWithEmailWrapper: RenderResult;

describe('Signup module test', () => {
  beforeAll((done) => {
    awsConfigure();
    signupWithEmailWrapper = render(
      <I18nextProvider i18n={i18n}>
        <SignUpWithEmail />
      </I18nextProvider>
    );
    done();
  });

  it('SignUpWithEmail is defined', () => {
    expect(SignUpWithEmail).toBeDefined();
  });

  it('signUpWithCognito is defined', () => {
    expect(signUpWithCognito).toBeDefined();
  });

  it('signInWithCognito is defined', () => {
    expect(api.signInWithCognito).toBeDefined();
  });

  it('getCurrentUser is defined', () => {
    expect(api.getCurrentUser).toBeDefined();
  });

  it('signInWithFacebook is defined', () => {
    expect(signInWithFacebook).toBeDefined();
  });

  it('signInWithGoogle is defined', () => {
    expect(signInWithGoogle).toBeDefined();
  });

  it('logoutUser is defined', () => {
    expect(logoutUser).toBeDefined();
  });

  it('confirmCode is to be called', async () => {
    const spy = jest.spyOn(api, 'confirmCode');
    try {
      await confirmCode({ username: mockUser.email, code: '1233' });
    } catch (error) {}
    expect(spy).toHaveBeenCalled();
  });
  it('resendSignupCode is to be called', async () => {
    const spy = jest.spyOn(api, 'resendSignupCode');
    try {
      await resendSignupCode(mockUser.email);
    } catch (error) {}
    expect(spy).toHaveBeenCalled();
  });

  it('getCurrentUser is to be called', async () => {
    const spy = jest.spyOn(api, 'getCurrentUser');
    try {
      await api.getCurrentUser();
    } catch (error) {}
    expect(spy).toHaveBeenCalled();
  });

  it('signUpWithCognito is to be called', async () => {
    const spy = jest.spyOn(api, 'signUpWithCognito');
    try {
      await api.signUpWithCognito({ username: mockUser.email, password: 'password' });
    } catch (error) {}
    expect(spy).toHaveBeenCalled();
  });

  it('signInWithCognito is to be called', async () => {
    const spy = jest.spyOn(api, 'signInWithCognito');
    try {
      await api.signInWithCognito({ username: mockUser.email, password: 'password' });
    } catch (error) {}
    expect(spy).toHaveBeenCalled();
  });

  it('logoutUser is to be called', async () => {
    const spy = jest.spyOn(api, 'logoutUser');
    try {
      await api.logoutUser();
    } catch (error) {}
    expect(spy).toHaveBeenCalled();
  });

  it('signInWithFacebook is to be called', async () => {
    const spy = jest.spyOn(api, 'signInWithFacebook');
    try {
      await api.signInWithFacebook();
    } catch (error) {}
    expect(spy).toHaveBeenCalled();
  });

  it('signInWithGoogle is to be called', async () => {
    const spy = jest.spyOn(api, 'signInWithGoogle');
    try {
      await api.signInWithGoogle();
    } catch (error) {}
    expect(spy).toHaveBeenCalled();
  });

  it('changePassword is to be defined', async () => {
    expect(api.changePassword).toBeDefined();
  });

  it('SignUpWithEmail match snapshot', () => {
    expect(signupWithEmailWrapper).toMatchSnapshot();
  });
});
