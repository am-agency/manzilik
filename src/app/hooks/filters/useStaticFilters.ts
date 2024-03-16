import { useTranslation } from 'react-i18next';
import { FilterObject, FilterOptionType, FilterViewItem } from './types';
import { useMemo } from 'react';
import { FilterKey } from '../search/useSearchFilters';
import { PRICE } from '../../../locales/strings';

const useStaticPriceFilter = () => {
  const { t } = useTranslation();

  const type: FilterOptionType = 'price-range';

  const filterData: FilterObject = useMemo(
    () => ({
      title: t(PRICE),
      data: [
        {
          title: t(PRICE),
          count: -1,
        },
      ],
    }),
    []
  );

  const getStaticPriceFilter = (): FilterViewItem => {
    return {
      ...filterData,
      key: FilterKey.PRICE,
      type,
      options: filterData.data.map((item) => ({ ...item, type, filter: filterData })),
    };
  };

  return { getStaticPriceFilter };
};

const useStaticReviewFilter = () => {
  const { t } = useTranslation();

  const type: FilterOptionType = 'rating';

  const filterData: FilterObject = useMemo(
    () => ({
      title: t('rating'),
      data: [
        {
          title: '1',
          count: -1,
        },
        {
          title: '2',
          count: -1,
        },
        {
          title: '3',
          count: -1,
        },
        {
          title: '4',
          count: -1,
        },
      ],
    }),
    []
  );

  const getStaticReviewFilter = (): FilterViewItem => {
    return {
      ...filterData,
      key: FilterKey.RATING,
      type,
      options: filterData.data.map((item) => ({ ...item, type, filter: filterData })),
    };
  };

  return { getStaticReviewFilter };
};

export const useStaticFiltersSource = () => {
  const { getStaticPriceFilter } = useStaticPriceFilter();
  const { getStaticReviewFilter } = useStaticReviewFilter();
  return { getStaticPriceFilter, getStaticReviewFilter };
};
