import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import Logo from '.';
import { BrowserRouter } from 'react-router-dom';
let logo: RenderResult;

describe('Logo Component test', () => {
  beforeAll((done) => {
    logo = render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>
    );
    done();
  });

  it('Logo is defined', () => {
    expect(Logo).toBeDefined();
  });

  it('Logo is defined', () => {
    expect(logo).toMatchSnapshot();
  });
});
