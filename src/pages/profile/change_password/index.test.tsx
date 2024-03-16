import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import i18n from '../../../app/i18n';
import ChangePassword from './';
import { BrowserRouter } from 'react-router-dom';
let changePassword: RenderResult;

describe('ChangePassword  test', () => {
  beforeAll((done) => {
    changePassword = render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ChangePassword />
        </BrowserRouter>
      </I18nextProvider>
    );
    done();
  });

  it('ChangePassword is defined', () => {
    expect(ChangePassword).toBeDefined();
  });

  it('ChangePassword is to match snapshot', () => {
    expect(changePassword).toMatchSnapshot();
  });
});
