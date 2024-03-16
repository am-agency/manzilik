import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import { Container } from './';
let container: RenderResult;

describe('Container  test', () => {
  beforeAll((done) => {
    container = render(
      <I18nextProvider i18n={i18n}>
        <Container>
          <div />
        </Container>
      </I18nextProvider>
    );
    done();
  });

  it('Container is defined', () => {
    expect(Container).toBeDefined();
  });

  it('Container is defined', () => {
    expect(container).toMatchSnapshot();
  });
});
