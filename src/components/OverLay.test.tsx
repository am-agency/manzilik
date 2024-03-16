import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import OverLay from './OverLay';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../app/i18n';
let overlay: RenderResult;

describe('OverLay  test', () => {
  beforeAll((done) => {
    overlay = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <OverLay>
            <div />
          </OverLay>
        </I18nextProvider>
      </BrowserRouter>
    );
    done();
  });

  it('OverLay is defined', () => {
    expect(OverLay).toBeDefined();
  });

  it('OverLay is defined', () => {
    expect(overlay).toMatchSnapshot();
  });
});
