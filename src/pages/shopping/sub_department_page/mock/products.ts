import { Product } from '../../../../API';
import { AR } from '../../../../locales/constants';

export const mockProducts = (language: string): Product[] => {
  const isArabic = language === AR;
  const translatedNew = isArabic ? 'جديد' : 'new';
  return [
    {
      __typename: 'Product',
      title: isArabic ? 'كرسي' : 'Chair',
      photo_url: 'https://st.hzcdn.com/fimgs/afb17759087e71c1_1143-w300-h300-b1-p10--.jpg',
      manufactory: {
        __typename: 'Manufactory',
        name: 'Abeer Alshaer',
      },
      // extra: ['colors'],
      labels: [
        {
          __typename: 'Label',
          // color: '#73af00',
          title: translatedNew,
        },
      ],
    },
    {
      __typename: 'Product',
      title: isArabic ? 'كرسي' : 'Chair',
      photo_url: 'https://st.hzcdn.com/fimgs/df11b1160f93163e_4562-w200-h200-b1-p0--.jpg',
      manufactory: {
        __typename: 'Manufactory',
        name: 'Abeer Alshaer',
      },
      // extra: ['colors'],
      labels: [
        {
          __typename: 'Label',
          // color: '#73af00',
          title: translatedNew,
        },
      ],
    },
    {
      __typename: 'Product',
      title: isArabic ? 'كرسي' : 'Chair',
      photo_url: 'https://st.hzcdn.com/fimgs/df11b1160f93163e_4562-w200-h200-b1-p0--.jpg',
      manufactory: {
        __typename: 'Manufactory',
        name: 'Abeer Alshaer',
      },
      // extra: ['colors'],
      labels: [
        {
          __typename: 'Label',
          // color: '#73af00',
          title: translatedNew,
        },
      ],
    },
    {
      __typename: 'Product',
      title: isArabic ? 'كرسي' : 'Chair',
      photo_url: 'https://st.hzcdn.com/fimgs/df11b1160f93163e_4562-w200-h200-b1-p0--.jpg',
      manufactory: {
        __typename: 'Manufactory',
        name: 'Abeer Alshaer',
      },
      // extra: ['colors'],
      labels: [
        {
          __typename: 'Label',
          // color: '#73af00',
          title: translatedNew,
        },
      ],
    },
    {
      __typename: 'Product',
      title: isArabic ? 'كرسي' : 'Chair',
      photo_url: 'https://st.hzcdn.com/fimgs/df11b1160f93163e_4562-w200-h200-b1-p0--.jpg',
      manufactory: {
        __typename: 'Manufactory',
        name: 'Abeer Alshaer',
      },
      // extra: ['colors'],
      labels: [
        {
          __typename: 'Label',
          // color: '#73af00',
          title: translatedNew,
        },
      ],
    },
    {
      __typename: 'Product',
      title: isArabic ? 'كرسي' : 'Chair',
      photo_url: 'https://st.hzcdn.com/fimgs/df11b1160f93163e_4562-w200-h200-b1-p0--.jpg',
      manufactory: {
        __typename: 'Manufactory',
        name: 'Abeer Alshaer',
      },
      // extra: ['colors'],
      labels: [
        {
          __typename: 'Label',
          // color: '#73af00',
          title: translatedNew,
        },
      ],
    },
    {
      __typename: 'Product',
      title: isArabic ? 'كرسي' : 'Chair',
      photo_url: 'https://st.hzcdn.com/fimgs/df11b1160f93163e_4562-w200-h200-b1-p0--.jpg',
      manufactory: {
        __typename: 'Manufactory',
        name: 'Abeer Alshaer',
      },
      // extra: ['colors'],
      labels: [
        {
          __typename: 'Label',
          // color: '#73af00',
          title: translatedNew,
        },
      ],
    },
    {
      __typename: 'Product',
      title: isArabic ? 'كرسي' : 'Chair',
      photo_url: 'https://st.hzcdn.com/fimgs/df11b1160f93163e_4562-w200-h200-b1-p0--.jpg',
      manufactory: {
        __typename: 'Manufactory',
        name: 'Abeer Alshaer',
      },
      // extra: ['colors'],
      labels: [
        {
          __typename: 'Label',
          // color: '#73af00',
          title: translatedNew,
        },
      ],
    },
  ];
};
