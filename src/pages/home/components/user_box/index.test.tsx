import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import UserBox from '.';
import i18n from '../../../../app/i18n';
let userbox: RenderResult;

describe('UserBox  test', () => {
  beforeAll((done) => {
    userbox = render(
      <I18nextProvider i18n={i18n}>
        <UserBox />
      </I18nextProvider>
    );
    done();
  });

  it('UserBox is defined', () => {
    expect(UserBox).toBeDefined();
  });

  it('UserBox is defined', () => {
    expect(userbox).toMatchSnapshot();
  });
});
