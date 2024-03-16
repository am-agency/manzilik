import { Select } from 'antd';
import { RefSelectProps } from 'antd/lib/select';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterKeyToFilterValues, FilterViewItem } from '../../app/hooks/filters/types';
import { TFiltersForm } from '../../app/hooks/filters/useFiltersForm';
import { getLayoutDirection } from '../../app/layouts';
import { FilterOptions } from '../../pages/ideas/ideas_filter/filters_form/filters_options';

interface Props {
  filtersForm: TFiltersForm;
  filterSource: FilterViewItem;
}

export const FilterSelect = ({ filterSource, filtersForm }: Props) => {
  const selectRef = useRef<RefSelectProps | null>(null);

  const {
    i18n: { language },
  } = useTranslation();

  const onBlur = (e: React.FocusEvent<HTMLElement, Element>) => {
    const isOpen = e.currentTarget.classList.contains('ant-select-open');
    if (!isOpen) {
      filtersForm.submit();
    }
    return true;
  };

  return (
    <Select
      className={`first-select ${getLayoutDirection(language)}`}
      mode="multiple"
      showArrow
      ref={(ref) => (selectRef.current = ref)}
      showSearch={false}
      dropdownClassName={`select-dropdown filters-select ${getLayoutDirection(language)}`}
      value={filterSource.title}
      virtual={false}
      dropdownRender={() => <FilterOptions selectedFilter={filterSource} filtersForm={filtersForm} />}
      onBlur={onBlur}
    />
  );
};
