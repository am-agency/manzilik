import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PriceSlider } from '../../../../components/filters/price_options';
import { FilterChangeDetail, FilterViewItem, FilterViewOption, PriceRange } from '../../../../app/hooks/filters/types';
import { FilterCheckbox } from './filter_checkbox';
import { TFiltersForm } from '../../../../app/hooks/filters/useFiltersForm';
import { FilterKey } from '../../../../app/hooks/search/useSearchFilters';

interface Props {
  selectedFilter: FilterViewItem;
  filtersForm?: TFiltersForm;
}

export const defaultPriceRange: [number, number] = [0, 10000];

export const FilterOptions = ({ selectedFilter, filtersForm }: Props) => {
  const [priceOptionValue, setPriceOptionValue] = useState<[number, number]>(defaultPriceRange);

  useEffect(() => {
    const value = filtersForm?.filterKeyToFilterValue[FilterKey.PRICE];
    if (value?.length) {
      const [min, max] = [parseInt(value[0]), parseInt(value[1])];
      if (min !== priceOptionValue[0] || max !== priceOptionValue[1]) {
        setPriceOptionValue([min, max]);
      }
    } else {
      setPriceOptionValue(defaultPriceRange);
    }
  }, [filtersForm?.filterKeyToFilterValue, selectedFilter]);

  const onChangePrice = (range: PriceRange) => {
    // TODO: debounce dispatch
    const [option] = selectedFilter.options;
    filtersForm?.setFiltersFormValue({ filterSource: selectedFilter, option, value: range });
    setPriceOptionValue(range);
  };

  const onChangeCheckbox = (change: FilterChangeDetail) => {
    filtersForm?.setFiltersFormValue(change);
  };

  if (!selectedFilter) {
    return null;
  }

  const isChecked = useCallback(
    (option: FilterViewOption) => {
      const filterValues = filtersForm?.getFilterKeyValue(selectedFilter.key);
      return filterValues ? filterValues.includes(option.title) : false;
    },
    [filtersForm?.filterKeyToFilterValue, selectedFilter]
  );

  switch (selectedFilter.type) {
    case 'price-range':
      return <PriceSlider onChange={onChangePrice} range={defaultPriceRange} value={priceOptionValue} />;

    case 'checkbox':
      return (
        <section className="checkbox-grid">
          {selectedFilter.options.map((option) => {
            return (
              <FilterCheckbox
                checked={isChecked(option)}
                key={option.title}
                onChange={onChangeCheckbox}
                option={option}
                filterSource={selectedFilter}
              />
            );
          })}
        </section>
      );

    case 'rating':
      return (
        <section className="checkbox-grid">
          {selectedFilter.options.map((option) => {
            return (
              <FilterCheckbox
                checked={isChecked(option)}
                key={option.title}
                onChange={onChangeCheckbox}
                option={option}
                filterSource={selectedFilter}
              />
            );
          })}
        </section>
      );
  }
};
