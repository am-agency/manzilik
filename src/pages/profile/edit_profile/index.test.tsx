import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import i18n from '../../../app/i18n';
import EditProfile from './';
import { ContactInfo } from './contact_info';
import { AccountInfo } from './account_info';
import { SuccessMessage } from './components/success_message';
import { mockClient } from '../../../mocks/data-mock/utils';
import { BrowserRouter } from 'react-router-dom';
let editProfile: RenderResult;
let contactInfo: RenderResult;
let accountInfo: RenderResult;
let successMsg: RenderResult;

describe('Edit Profile  test', () => {
  beforeAll((done) => {
    editProfile = render(
      <I18nextProvider i18n={i18n}>
        <EditProfile />
      </I18nextProvider>
    );

    contactInfo = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <ContactInfo onUpdateClientInformation={jest.fn()} client={mockClient} />
        </I18nextProvider>
      </BrowserRouter>
    );

    accountInfo = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <AccountInfo onUpdateClientInformation={jest.fn()} client={mockClient} />
        </I18nextProvider>
      </BrowserRouter>
    );

    successMsg = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <SuccessMessage />
        </I18nextProvider>
      </BrowserRouter>
    );
    done();
  });

  it('ContactInfo is defined', () => {
    expect(ContactInfo).toBeDefined();
  });

  it('AccountInfo is defined', () => {
    expect(AccountInfo).toBeDefined();
  });

  it('SuccessMessage component is defined', () => {
    expect(SuccessMessage).toBeDefined();
  });

  it('EditProfile page is defined', () => {
    expect(EditProfile).toBeDefined();
  });

  it('EditProfile is to match snapshot', () => {
    expect(editProfile).toMatchSnapshot();
  });

  it('ContactInfo is to match snapshot', () => {
    expect(contactInfo).toMatchSnapshot();
  });

  it('AccountInfo is to match snapshot', () => {
    expect(accountInfo).toMatchSnapshot();
  });

  it('SuccessMessage is to match snapshot', () => {
    expect(successMsg).toMatchSnapshot();
  });
});
