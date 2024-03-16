import i18n from '../../../../app/i18n';
import { AR } from '../../../../locales/constants';
import { productArabic } from './product';

export const ProductSlidersMock = () => {
  return {
    results: [
      {
        __typename: 'ProductSlider',
        title: i18n.language == AR ? 'منتجات مقترحة' : 'Suggested Products',
        products: [productArabic, productArabic, productArabic, productArabic, productArabic, productArabic],
      },
      {
        __typename: 'ProductSlider',
        title: i18n.language == AR ? 'أفضل العروض' : 'Best Offers',
        products: [productArabic, productArabic, productArabic, productArabic],
      },
      {
        __typename: 'ProductSlider',
        title: i18n.language == AR ? 'قام الناس بشراء هذه المنتجات مع منتجك' : 'People who bought this product',
        products: [productArabic, productArabic, productArabic, productArabic, productArabic],
      },
    ],
    count: 3,
  };
};
