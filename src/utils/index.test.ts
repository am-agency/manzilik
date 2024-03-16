import React from 'react';
import {
  checkRedirectSource,
  checkValidImageUrl,
  getUrlPictureFromS3,
  getUserName,
  graphqlAuthenticationOperation,
  graphqlOperation,
  setRedirectFrom,
  uploadFilesOnS3,
} from '.';
import { awsConfig } from '../app/config';
import ar from '../locales/ar';
import en from '../locales/en';
import { mockFileList, mockUser } from '../mocks/data-mock/utils';

jest.mock('aws-amplify');
const mockPictureUrls = [
  {
    bucket: 'mazel-hackathon',
    key: undefined,
    region: 'eu-central-1',
  },
  {
    bucket: 'mazel-hackathon',
    key: undefined,
    region: 'eu-central-1',
  },
];

let redirectFrom: string | null = null;
const localStorageMock = {
  getItem: () => redirectFrom,
  setItem: (item: string, val: string) => {
    redirectFrom = val;
  },
  removeItem: () => {
    redirectFrom = null;
  },
  length: 100,
  key: () => 'mock_storage',
  clear: jest.fn(),
};
describe('Test utils Functions', () => {
  beforeEach(() => {
    redirectFrom = null;
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    window.localStorage.__proto__.setItem = jest.fn(localStorageMock.setItem);
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(localStorageMock.getItem);
  });

  it('Test getUserName should be defined', () => {
    expect(getUserName).toBeDefined();
  });

  it('Test getUserName Function', () => {
    expect(getUserName(mockUser)).toEqual(mockUser.first_name + ' ' + mockUser.last_name);
  });

  it('graphqlOperation function should be defined', () => {
    expect(graphqlOperation).toBeDefined();
  });

  it('graphqlAuthenticationOperation function should be defined', () => {
    expect(graphqlAuthenticationOperation).toBeDefined();
  });

  it('getUrlPictureFromS3 function should be defined', () => {
    expect(getUrlPictureFromS3).toBeDefined();
  });

  it('getUrlPictureFromS3 function should return url if s3Info is passed as params', () => {
    expect(
      getUrlPictureFromS3({
        bucket: 'bucket',
        region: 'region',
        key: 'key',
      })
    ).toEqual('https://bucket.s3.region.amazonaws.com/public/key');
  });

  it('getUrlPictureFromS3 function should return `default_path` if params are null', () => {
    expect(getUrlPictureFromS3()).toEqual('default_path');
  });

  it('uploadFilesOnS3 function should be defined', () => {
    expect(uploadFilesOnS3).toBeDefined();
  });

  it('uploadFilesOnS3 function should be defined', () => {
    try {
      uploadFilesOnS3(mockFileList).then((urls) => {
        expect(urls).toEqual(mockPictureUrls);
      });
    } catch (error) {}
  });

  it('checkRedirectSource function should be defined', () => {
    expect(checkRedirectSource).toBeDefined();
  });

  it('redirectFrom function should be defined', () => {
    expect(setRedirectFrom('redirect-from-test')).toEqual(undefined);
  });

  it('checkRedirectSource function should be defined', () => {
    setRedirectFrom('redirect-from-test');
    expect(checkRedirectSource()).toEqual('redirect-from-test');
  });
});

describe('checkValidImageUrl', () => {
  it('checkValidImageUrl function should be defined', () => {
    expect(checkValidImageUrl).toBeDefined();
  });

  it('checkValidImageUrl for random strings that are not img paths to be false', () => {
    expect(checkValidImageUrl('null')).toEqual(false);
    expect(checkValidImageUrl('/a/s.PNG')).toEqual(false);
    expect(checkValidImageUrl('http://test.com/haha.jPeg')).toEqual(false);
  });

  it('checkValidImageUrl for urls to be true', () => {
    expect(checkValidImageUrl('test.png')).toEqual(true);
    expect(checkValidImageUrl('test.gif')).toEqual(true);
    expect(checkValidImageUrl('path/test.gif')).toEqual(true);
    expect(checkValidImageUrl('http://loler.com/path/test.gif')).toEqual(true);
  });
});
