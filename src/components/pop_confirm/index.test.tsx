import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import { PopConfirm } from '.';
let popConfirm: RenderResult;

describe('PopConfirm  test', () => {
  beforeAll((done) => {
    popConfirm = render(
      <I18nextProvider i18n={i18n}>
        <PopConfirm okText="" cancelText="" actionText="" onConfirm={jest.fn} title="" />
      </I18nextProvider>
    );
    done();
  });

  it('PopConfirm is defined', () => {
    expect(PopConfirm).toBeDefined();
  });

  it('PopConfirm is defined', () => {
    expect(popConfirm).toMatchSnapshot();
  });
});
