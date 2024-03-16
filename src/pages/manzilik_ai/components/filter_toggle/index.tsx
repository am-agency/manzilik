import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MY_DESIGNS, NEWLY_PUBLISHED } from '../../../../locales/strings';
import { CurrentToggle } from '../..';

interface FilterToggleProps {
  onFilterToggle?: (id: string) => void;
  currentToggle?: string;
  listOfFilters?: {
    id: number;
    name: string;
    value?: string;
  }[];
}

const FilterToggle: React.FC<FilterToggleProps> = (props: FilterToggleProps) => {
  const {
    onFilterToggle,
    currentToggle,
    listOfFilters = [
      {
        id: 1,
        name: 'new',
      },
      {
        id: 2,
        name: 'old',
      },
    ],
  } = props;

  const handleToggle = (id: string) => {
    onFilterToggle!(id);
  };
  const { t } = useTranslation();

  return (
    <div className={`toggle ${currentToggle == listOfFilters[0]?.value ? 'padding-end' : 'padding-start'}`}>
      {listOfFilters.map((filter) => (
        <div
          key={filter.id}
          className={currentToggle === filter.value ? 'active' : ''}
          onClick={() => handleToggle(filter.value!)}
        >
          {filter.name}
        </div>
      ))}
    </div>
  );
};

export default FilterToggle;
