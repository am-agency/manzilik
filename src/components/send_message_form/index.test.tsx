import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import SendMessageForm from '.';
import { BrowserRouter } from 'react-router-dom';
let sendMessageForm: RenderResult;

describe('SendMessageForm  test', () => {
  beforeAll((done) => {
    sendMessageForm = render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <SendMessageForm />
        </I18nextProvider>
      </BrowserRouter>
    );
    done();
  });

  it('SendMessageForm is defined', () => {
    expect(SendMessageForm).toBeDefined();
  });

  it('SendMessageForm is to match snapshot', () => {
    expect(sendMessageForm).toMatchSnapshot();
  });
});
