import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import ForgetPassword from '.';
let forgetPassword: RenderResult;
import * as API from './api';

describe('ForgetPassword  test', () => {
  beforeAll((done) => {
    forgetPassword = render(
      <I18nextProvider i18n={i18n}>
        <ForgetPassword />
      </I18nextProvider>
    );
    done();
  });

  it('ForgetPassword is defined', () => {
    expect(ForgetPassword).toBeDefined();
  });

  it('ForgetPassword is defined', () => {
    expect(forgetPassword).toMatchSnapshot();
  });

  it('forgetPasswordWithCognito is defined', () => {
    expect(API.forgetPasswordWithCognito).toBeDefined();
  });
});
