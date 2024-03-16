import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import SignupWelcome from '.';
import i18n from '../../../../app/i18n';
let singup_welcome: RenderResult;

describe('SignupWelcome  test', () => {
  beforeAll((done) => {
    singup_welcome = render(
      <I18nextProvider i18n={i18n}>
        <SignupWelcome />
      </I18nextProvider>
    );
    done();
  });

  it('SignupWelcome is defined', () => {
    expect(SignupWelcome).toBeDefined();
  });

  it('SignupWelcome is defined', () => {
    expect(singup_welcome).toMatchSnapshot();
  });
});
