import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../app/i18n';
import { render, RenderResult } from '@testing-library/react';
import DropdownPopover from './';
let dropdownPopover: RenderResult;

describe('DropdownPopover test', () => {
  beforeAll((done) => {
    dropdownPopover = render(
      <I18nextProvider i18n={i18n}>
        <DropdownPopover content={<div></div>}>
          <div />
        </DropdownPopover>
      </I18nextProvider>
    );
    done();
  });

  it('DropdownPopover is defined', () => {
    expect(DropdownPopover).toBeDefined();
  });

  it('DropdownPopover is defined', () => {
    expect(dropdownPopover).toMatchSnapshot();
  });
});
