import { TFunction } from 'i18next';
import { CANCELED, DELIVERED, NEW, PENDING, UNDER_PROCESSING } from '../../../locales/strings';

export const renderTagColor = (tag: string) => {
  switch (tag) {
    case 'Under processing':
      return '#f76868';
    case 'Canceled':
      return '#747474';
    case 'Delivered':
      return '#a6d082';
    case 'New':
      return '#bcb39a';
    case 'Pending':
      return 'yellow';
    default:
      break;
  }
};

// @TODO: delete it once it's handled from the backend side
export const renderTagBasedOnLanguage = (t: TFunction, tag: string) => {
  switch (tag) {
    case 'Under processing':
      return t(UNDER_PROCESSING);
    case 'Canceled':
      return t(CANCELED);
    case 'Delivered':
      return t(DELIVERED);
    case 'New':
      return t(NEW);
    case 'Pending':
      return t(PENDING);
    default:
      break;
  }
};
