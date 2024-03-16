import { Product } from '../../API';

export const getCardClassNameBasedOnIndex = (index: number) => {
  if (index % 3 == 1) {
    return 'blue-background';
  } else if (index % 3 == 2) {
    return 'gray-background';
  } else {
    return 'gold-background';
  }
};

export const getProductCategories = (product: Product) => {
  const categories = product?.categories;
  if (!Array.isArray(categories)) {
    return '';
  }
  return categories.map((c) => c?.title).join(', ');
};
