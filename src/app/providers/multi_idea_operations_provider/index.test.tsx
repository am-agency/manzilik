import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { render, RenderResult } from '@testing-library/react';
import { MultiIdeasOperationsProvider } from '.';
let MultiIdeaOperationProviderComponent: RenderResult;

const DummyComponent = () => <div />;
describe('MultiIdeasOperationsProvider  test', () => {
  beforeAll((done) => {
    MultiIdeaOperationProviderComponent = render(
      <I18nextProvider i18n={i18n}>
        <MultiIdeasOperationsProvider>
          <DummyComponent />
        </MultiIdeasOperationsProvider>
      </I18nextProvider>
    );
    done();
  });

  it('MultiIdeasOperationsProvider is defined', () => {
    expect(MultiIdeasOperationsProvider).toBeDefined();
  });

  it('MultiIdeasOperationsProvider is defined', () => {
    expect(MultiIdeaOperationProviderComponent).toMatchSnapshot();
  });
});
