import * as API from './api';

describe('Profile module  test', () => {
  it('getCities is defined', () => {
    expect(API.getCities).toBeDefined();
  });

  it('getClient is defined', () => {
    expect(API.getClient).toBeDefined();
  });

  it('getCountries is defined', () => {
    expect(API.getCountries).toBeDefined();
  });

  it('updateAccountInformation is defined', () => {
    expect(API.updateAccountInformation).toBeDefined();
  });
});
