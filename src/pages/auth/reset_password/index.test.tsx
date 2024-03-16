import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '.';
import i18n from '../../../app/i18n';
import * as API from './api';
import { ResetPasswordForm } from './components/reset_password_form';

let resetPassword: RenderResult;

describe('Reset Password test suitcase', () => {
  beforeAll((done) => {
    resetPassword = render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ResetPassword />
        </BrowserRouter>
      </I18nextProvider>
    );
    done();
  });
  it('ResetPasswordForm component to be defined', () => {
    expect(ResetPasswordForm).toBeDefined();
  });

  it('resetPassword component to be defined', () => {
    expect(ResetPassword).toBeDefined();
  });

  it('ResetPassword component to be match snapshot', () => {
    expect(resetPassword).toMatchSnapshot();
  });

  it('resetNewPassword function to be defined', () => {
    expect(API.resetNewPassword).toBeDefined();
  });
});
