import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import * as api from './api';
import Login from '.';
import { mockUser } from '../../../mocks/data-mock/utils';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { LoginForm } from './components/login_form';

let login: RenderResult;
let loginForm: RenderResult;

describe('Login Module test suitCase', () => {
  beforeAll((done) => {
    const history = createMemoryHistory();
    login = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <Login />
        </I18nextProvider>
      </Router>
    );
    loginForm = render(
      <Router history={history}>
        <I18nextProvider i18n={i18n}>
          <LoginForm
            onFinish={jest.fn}
            setShowConfirm={jest.fn}
            onGoogleLoginHandler={jest.fn}
            onFacebookLoginHandler={jest.fn}
            showConfirm={true}
          />
        </I18nextProvider>
      </Router>
    );
    done();
  });

  it('Login page to be defined', () => {
    expect(Login).toBeDefined();
  });

  it('Login page to be match snapshot', () => {
    expect(Login).toMatchSnapshot();
  });

  it('loginWithCognito is defined', () => {
    expect(api.loginWithCognito).toBeDefined();
  });

  it('loginWithCognito is to be called', async () => {
    const spy = jest.spyOn(api, 'loginWithCognito');
    try {
      await api.loginWithCognito({ username: mockUser.email, password: 'password' });
    } catch (error) {}
    expect(spy).toHaveBeenCalled();
  });

  it('Login Form component is defined', () => {
    expect(LoginForm).toBeDefined();
  });

  it('Login Form component is defined', () => {
    expect(LoginForm).toBeDefined();
  });

  it('LoginForm component is to contain ', () => {
    expect(loginForm).toMatchSnapshot();
  });
});
