import { Row, Select, Typography } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { SortMethod } from '../../../../app/hooks/search/useSearchOptions';
import { getLayoutDirection } from '../../../../app/layouts';
import { VERIFIED_FIRST, SORT_BY, JOIN_DATE, SELECT_SORT_METHOD } from '../../../../locales/strings';
import { HIGHER_RATING } from '../../../../locales/strings';

interface Props {
  onSortchange: (value: SortMethod) => void;
  sortedValue: SortMethod;
}

export const ProfessionalSort: FunctionComponent<Props> = ({ onSortchange, sortedValue }: Props) => {
  const { t, i18n } = useTranslation();

  const sortOptions = [
    { title: t(SELECT_SORT_METHOD), value: SortMethod.DEFAULT },
    { title: t(VERIFIED_FIRST), value: SortMethod.VERIFIED },
    { title: t(JOIN_DATE), value: SortMethod.RECENTLY_JOINED },
    { title: t(HIGHER_RATING), value: SortMethod.HIGHER_RATE },
  ];

  return (
    <Row align="middle" className="sort-container sort-wrapper">
      <Typography.Text className="select-label">{t(SORT_BY)}</Typography.Text>
      <div className="location">
        <Select
          bordered={false}
          dropdownClassName={`${getLayoutDirection(i18n.language)} sort-dropdown`}
          onChange={onSortchange}
          value={sortedValue}
          defaultValue={sortOptions[0].value}
        >
          {sortOptions.slice(1).map((opt) => {
            return (
              <Select.Option key={opt.value} value={opt.value}>
                {t(opt.title)}
              </Select.Option>
            );
          })}
        </Select>
      </div>
    </Row>
  );
};
