import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import Avatar from '.';
let avatar: RenderResult;

describe('Avatar  test', () => {
  beforeAll((done) => {
    avatar = render(
      <I18nextProvider i18n={i18n}>
        <Avatar />
      </I18nextProvider>
    );
    done();
  });

  it('Avatar is defined', () => {
    expect(Avatar).toBeDefined();
  });

  it('Avatar is defined', () => {
    expect(avatar).toMatchSnapshot();
  });
});
