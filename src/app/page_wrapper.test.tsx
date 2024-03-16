import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import PageWrapper from './page_wrapper';
import i18n from './i18n';
import { BrowserRouter } from 'react-router-dom';
import { LayoutTypes } from './layouts';
let pageWrapper: RenderResult;

describe('PageWrapper  test', () => {
  beforeAll((done) => {
    pageWrapper = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <PageWrapper exact path={['/something']} Component={() => <div />} layout={LayoutTypes.LOGIN}></PageWrapper>
        </I18nextProvider>
      </BrowserRouter>
    );
    done();
  });

  it('PageWrapper renders correctly', () => {
    expect(PageWrapper).toMatchSnapshot();
  });

  it('PageWrapper is defined', () => {
    expect(pageWrapper).toBeDefined();
  });
});
