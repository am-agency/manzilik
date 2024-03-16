import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, RenderResult } from '@testing-library/react';
import { DefaultLayout } from './default_layout';
import i18n from '../i18n';
import { BrowserRouter } from 'react-router-dom';
import { LoginLayout } from './login_layout';
import RightSidebarLayout from './right_sidebar';
let defaultLayout: RenderResult;
let loginLayout: RenderResult;
let rightSidebar: RenderResult;

describe('DefaultLayout  test', () => {
  beforeAll((done) => {
    defaultLayout = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <DefaultLayout>
            <div></div>
          </DefaultLayout>
        </I18nextProvider>
      </BrowserRouter>
    );
    loginLayout = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <LoginLayout>
            <div></div>
          </LoginLayout>
        </I18nextProvider>
      </BrowserRouter>
    );
    rightSidebar = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <RightSidebarLayout>
            <div></div>
          </RightSidebarLayout>
        </I18nextProvider>
      </BrowserRouter>
    );
    done();
  });

  it('DefaultLayout is defined', () => {
    expect(DefaultLayout).toBeDefined();
  });

  it('DefaultLayout is to match snapshot', () => {
    expect(defaultLayout).toMatchSnapshot();
  });

  it('LoginLayout is defined', () => {
    expect(loginLayout).toMatchSnapshot();
  });
  it('LoginLayout is defined', () => {
    expect(LoginLayout).toBeDefined();
  });

  it('RightSidebarLayout is defined', () => {
    expect(RightSidebarLayout).toBeDefined();
  });

  it('RightSideBarLayout is defined', () => {
    expect(rightSidebar).toMatchSnapshot();
  });
});
