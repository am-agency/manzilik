import React from 'react';
import { awsConfigure } from './config';

describe('Config Test SuitCase', () => {
  it('config should be defined', () => {
    expect(awsConfigure).toBeDefined();
  });
});
