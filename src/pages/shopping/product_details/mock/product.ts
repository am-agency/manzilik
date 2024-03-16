import { Product } from '../../../../API';
import sofaPic from '../../../../assets/backgrounds/sofa.svg';

export const productArabic: Product = {
  __typename: 'Product',
  title: 'كرسي بذراعين من القماش الحديث',
  description:
    'هذه هي أحدث إضافة لدينا وبالتأكيد واحدة من المفضلة لدينا. إنه أيضًا أول حوض لدينا مقطوع من كتل الكوارتز ، وهو أصعب من الجرانيت الأسود. وبفضل موجاته البلورية البيضاء ، فهو رائع بكل بساطة. هذه أحدث إضافة لدينا وبالتأكيد واحدة من المفضلة لدينا. إنه أيضًا أول حوض لدينا مقطوع من كتل الكوارتز ، وهو أصعب من الجرانيت الأسود. وبفضل موجاته البلورية البيضاء ، إنه ببساطة رائع.',
  photo_url: sofaPic,
  images: [
    {
      __typename: 'Image',
      original:
        'https://cdn.shopify.com/s/files/1/1094/9426/collections/nellie-sofa-2s-front-1200x800.jpg?v=1537856229',
      is_default: true,
    },
    {
      __typename: 'Image',
      original:
        'https://cdn.shopify.com/s/files/1/1094/9426/collections/nellie-sofa-2s-front-1200x800.jpg?v=1537856229',
    },
    {
      __typename: 'Image',
      original: sofaPic,
    },
  ],
  manufactory: { __typename: 'Manufactory', name: 'shahenaz Monia' },
  labels: [{ __typename: 'Label', color: '#464674', title: 'تخفيض' }],
  attributes: [],
};

export const productEnglish: Product = {
  __typename: 'Product',
  title: 'Chair',
  description: 'Great, simple Chair',
  photo_url: sofaPic,
  images: [
    {
      __typename: 'Image',
      original:
        'https://cdn.shopify.com/s/files/1/1094/9426/collections/nellie-sofa-2s-front-1200x800.jpg?v=1537856229',
      is_default: true,
    },
    {
      __typename: 'Image',
      original:
        'https://cdn.shopify.com/s/files/1/1094/9426/collections/nellie-sofa-2s-front-1200x800.jpg?v=1537856229',
    },
    {
      __typename: 'Image',
      original: sofaPic,
    },
  ],
  manufactory: { __typename: 'Manufactory', name: 'shahenaz Monia' },
  labels: [{ __typename: 'Label', color: '#464674', title: 'تخفيض' }],
  // shipping_days: { from: 3, to: 5 },
  attributes: [],
  offer: { __typename: 'Offer', value: '100' },
};
