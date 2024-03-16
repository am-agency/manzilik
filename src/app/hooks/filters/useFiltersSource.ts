import { useFiltersSourceParser } from './useFiltersParser';
import { useStaticFiltersSource } from './useStaticFilters';

export const useFiltersSource = () => {
  const { getStaticPriceFilter, getStaticReviewFilter } = useStaticFiltersSource();
  const { filtersSource, setFiltersSourceString, filtersCache } = useFiltersSourceParser([
    getStaticPriceFilter(),
    getStaticReviewFilter(),
  ]);

  return { filtersSource, setFiltersSourceString, filtersCache };
};
