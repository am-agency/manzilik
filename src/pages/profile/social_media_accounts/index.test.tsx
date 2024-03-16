import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import i18n from '../../../app/i18n';
import SocialMediaAccount from './';
let social_media_accounts: RenderResult;

describe('SocialMediaAccount  test', () => {
  beforeAll((done) => {
    social_media_accounts = render(
      <I18nextProvider i18n={i18n}>
        <SocialMediaAccount />
      </I18nextProvider>
    );
    done();
  });

  it('SocialMediaAccount is defined', () => {
    expect(SocialMediaAccount).toBeDefined();
  });

  it('SocialMediaAccount is to match snapshot', () => {
    expect(social_media_accounts).toMatchSnapshot();
  });
});
