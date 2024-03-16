import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import i18n from '../../../app/i18n';
import { PrivacySettings } from './';
let privacySettings: RenderResult;

describe('PrivacySettings  test', () => {
  beforeAll((done) => {
    privacySettings = render(
      <I18nextProvider i18n={i18n}>
        <PrivacySettings />
      </I18nextProvider>
    );
    done();
  });

  it('PrivacySettings is defined', () => {
    expect(PrivacySettings).toBeDefined();
  });

  it('PrivacySettings is to match snapshot', () => {
    expect(privacySettings).toMatchSnapshot();
  });
});
