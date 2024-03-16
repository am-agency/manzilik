import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import { LanguageSwitch } from '.';
let languageSwitch: RenderResult;

describe('LanguageSwitch  test', () => {
  beforeAll((done) => {
    languageSwitch = render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitch onLanguageChange={jest.fn} />
      </I18nextProvider>
    );
    done();
  });

  it('LanguageSwitch is defined', () => {
    expect(LanguageSwitch).toBeDefined();
  });

  it('LanguageSwitch is defined', () => {
    expect(languageSwitch).toMatchSnapshot();
  });
});
