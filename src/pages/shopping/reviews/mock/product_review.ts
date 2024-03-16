import { ProductReview } from '../../../../API';
import { AR } from '../../../../locales/constants';
import sofaPic from '../../../../assets/backgrounds/sofa.svg';

export const productReviewMock = (language: string): ProductReview[] => {
  const isArabic = language === AR;
  return [
    {
      __typename: 'ProductReview',
      id: '1',
      stockrecord: '5',
      created_at: '19 Jan 2021',
      client: {
        __typename: 'Client',
        id: '1',
        first_name: 'Salam',
        last_name: 'Dalloul',
        profile_image: 'https://joeschmoe.io/api/v1/random',
      },
    },
    {
      __typename: 'ProductReview',
      id: '2',
      stockrecord: '',
      created_at: '19 Jan 2021',
      client: {
        __typename: 'Client',
        id: '1',
        first_name: 'Salam',
        last_name: 'Dalloul',
        profile_image: 'https://joeschmoe.io/api/v1/random',
      },
      body: ' ',
    },
    {
      __typename: 'ProductReview',
      id: '3',
      stockrecord: '5',
      created_at: '19 Jan 2021',
      client: {
        __typename: 'Client',
        id: '1',
        first_name: 'Salam',
        last_name: 'Dalloul',
        profile_image: 'https://joeschmoe.io/api/v1/random',
      },
      body: ' ',
    },
    {
      __typename: 'ProductReview',
      id: '4',
      created_at: '19 Jan 2021',
      stockrecord: '5',
      client: {
        __typename: 'Client',
        id: '1',
        first_name: 'Salam',
        last_name: 'Dalloul',
        profile_image: 'https://joeschmoe.io/api/v1/random',
      },
      body: ' ',
    },
  ];
};
