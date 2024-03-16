import { ProductAttribute } from '../../../API';

export const getColorOrSize = (attributes: (ProductAttribute | null)[], value: string) => {
  const result = attributes?.filter((elm) => elm?.value == value);
  return result && result[0]?.name;
};
