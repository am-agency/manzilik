import React from 'react';
import { I18nextProvider } from 'react-i18next';
import Home from '.';
import { render, act, RenderResult } from '@testing-library/react';
import i18n from '../../app/i18n';
import { BrowserRouter } from 'react-router-dom';
import { awsConfigure } from '../../app/config';
import * as API from './api';

let wrapper: RenderResult;

describe('ConfirmCodeComponent Test', () => {
  beforeAll((done) => {
    awsConfigure();
    wrapper = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Home />
        </I18nextProvider>
      </BrowserRouter>
    );
    done();
  });

  it('Home component should be defined', () => {
    expect(Home).toBeDefined();
  });

  it('Home Shallow rendering', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('listProjectsWithFirstIdea should be defined', () => {
    expect(API.listProjectsWithFirstIdea).toBeDefined();
  });
});
