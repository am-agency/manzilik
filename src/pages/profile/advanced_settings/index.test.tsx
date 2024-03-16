import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import { AdvancedSettings } from '.';
import i18n from '../../../app/i18n';
import { AdvancedPrivacySettingFields } from './components/advanced_privacy_setting_fields';
import { EmailSubscriptionsCheckboxFields } from './components/email_subscriptions_checkbox_fields';
import { MyProfilePageSettingFields } from './components/myprofile_page_setting_fields';
import { UserActivityNotifications } from './components/user_notifications_fields';
let advancedSettings: RenderResult;

describe('AdvancedSettings  test', () => {
  beforeAll((done) => {
    advancedSettings = render(
      <I18nextProvider i18n={i18n}>
        <AdvancedSettings />
      </I18nextProvider>
    );
    done();
  });

  it('AdvancedSettings is defined', () => {
    expect(AdvancedSettings).toBeDefined();
  });

  it('AdvancedPrivacySettingFields component is defined', () => {
    expect(AdvancedPrivacySettingFields).toBeDefined();
  });

  it('EmailSubscriptionsCheckboxFields component is defined', () => {
    expect(EmailSubscriptionsCheckboxFields).toBeDefined();
  });

  it('MyProfilePageSettingFields component is defined', () => {
    expect(MyProfilePageSettingFields).toBeDefined();
  });

  it('UserActivityNotifications component is defined', () => {
    expect(UserActivityNotifications).toBeDefined();
  });

  it('AdvancedSettings is defined', () => {
    expect(AdvancedSettings).toBeDefined();
  });

  it('AdvancedSettings is to match snapshot', () => {
    expect(advancedSettings).toMatchSnapshot();
  });
});
