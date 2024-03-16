import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import { CropImage } from './';
let cropImage: RenderResult;

describe('CropImage  test', () => {
  beforeAll((done) => {
    cropImage = render(
      <I18nextProvider i18n={i18n}>
        <CropImage />
      </I18nextProvider>
    );
    done();
  });

  it('CropImage is defined', () => {
    expect(CropImage).toBeDefined();
  });

  it('CropImage is defined', () => {
    expect(cropImage).toMatchSnapshot();
  });
});
