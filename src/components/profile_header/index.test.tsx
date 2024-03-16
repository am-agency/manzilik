import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import { ProfileHeader } from '.';
import { mockClient } from '../../mocks/data-mock/utils';
import { getUserName } from '../../utils';
import { BrowserRouter } from 'react-router-dom';
let profileHeader: RenderResult;

describe('ProfileHeader  test', () => {
  beforeAll((done) => {
    profileHeader = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <ProfileHeader client={getUserName(mockClient)} />
        </I18nextProvider>
      </BrowserRouter>
    );
    done();
  });

  it('ProfileHeader is defined', () => {
    expect(ProfileHeader).toBeDefined();
  });

  it('ProfileHeader is defined', () => {
    expect(profileHeader).toMatchSnapshot();
  });
});
