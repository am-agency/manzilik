import { Select } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { SortMethod } from '../../../../app/hooks/search/useSearchOptions';
import { getLayoutDirection } from '../../../../app/layouts';
import { HIGHTEST_PRICE, LATEST, LOWEST_PRICE, OLDEST, SORTED_BY } from '../../../../locales/strings';

interface Props {
  onSortchange?: (value: SortMethod) => void;
  sortedValue?: SortMethod;
}

export const ProductsSort: FunctionComponent<Props> = ({ onSortchange, sortedValue }: Props) => {
  const { t, i18n } = useTranslation();

  const sortOptions = [
    { title: t(HIGHTEST_PRICE), value: SortMethod.HIGHEST_PRICE },
    { title: t(LOWEST_PRICE), value: SortMethod.LOWEST_PRICE },
    { title: t(LATEST), value: SortMethod.NEWEST },
    { title: t(OLDEST), value: SortMethod.OLDEST },
  ];

  return (
    <span>
      {t(SORTED_BY)}
      <Select
        value={sortedValue || SortMethod.NEWEST}
        className="sort-products-filter"
        onChange={onSortchange}
        dropdownClassName={`sort-comment-filter ${getLayoutDirection(i18n.language)}`}
      >
        {sortOptions.map((option, index) => (
          <Select.Option key={index} value={option.value}>
            {option.title}
          </Select.Option>
        ))}
      </Select>
    </span>
  );
};
