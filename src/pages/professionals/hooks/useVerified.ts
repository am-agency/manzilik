import { useState } from 'react';
import { UNVERIFIED, VERIFIED } from '../../../locales/strings';

export enum VerifiedStatus {
  VERIFIED,
  UNVERIFIED,
}

const VerifiedValueToString = new Map([
  [VerifiedStatus.VERIFIED, 'true'],
  [VerifiedStatus.UNVERIFIED, 'false'],
  [undefined, ''],
]);

const VerifiedStringToValue = new Map([
  ['true', VerifiedStatus.VERIFIED],
  ['false', VerifiedStatus.UNVERIFIED],
  ['', undefined],
]);

export const useVerified = () => {
  const [isVerified, setIsVerified] = useState<VerifiedStatus>();

  const verifiedToString = (value: VerifiedStatus | undefined) => {
    return VerifiedValueToString.get(value) as string;
  };

  const verifiedToValue = (str: string = '') => {
    return VerifiedStringToValue.get(str);
  };

  const getVerifiedLabelKey = (isVerified?: VerifiedStatus) => {
    switch (isVerified) {
      case VerifiedStatus.VERIFIED:
        return VERIFIED;
      case VerifiedStatus.UNVERIFIED:
        return UNVERIFIED;
    }
    return '';
  };

  const clearVerified = () => {
    setIsVerified(undefined);
  };

  return { isVerified, setIsVerified, verifiedToString, verifiedToValue, getVerifiedLabelKey, clearVerified };
};
