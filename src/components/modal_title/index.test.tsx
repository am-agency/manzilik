import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import { ModalTitle } from '.';
let modalTitle: RenderResult;

describe('ModalTitle  test', () => {
  beforeAll((done) => {
    modalTitle = render(
      <I18nextProvider i18n={i18n}>
        <ModalTitle title={''} icon={''} />
      </I18nextProvider>
    );
    done();
  });

  it('ModalTitle is defined', () => {
    expect(ModalTitle).toBeDefined();
  });

  it('ModalTitle is defined', () => {
    expect(modalTitle).toMatchSnapshot();
  });
});
