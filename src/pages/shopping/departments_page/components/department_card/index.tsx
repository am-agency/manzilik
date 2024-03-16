import React from 'react';
import { Button, Typography } from 'antd';
import { getLayoutDirection } from '../../../../../app/layouts';
import { useTranslation } from 'react-i18next';
import { EXPLORE_PRODUCTS } from '../../../../../locales/strings';
import { Link } from 'react-router-dom';
import { Department } from '../../../../../API';
import { QueryStringKeys } from '../../../../../app/hooks/search/useSearchQuery';
import { getDefaultSearchOptionsQueryParams } from '../../../../../app/hooks/search/useSearchOptions';

interface Props {
  department: Department;
  index: number;
}

export const DepartmentCard = ({ department }: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="department-card blue-background">
      <div className="img-wrapper">
        <img src={department?.photo_url!} className={getLayoutDirection(i18n.language)} />
      </div>
      <div className="card-head">
        <h4>{department.title}</h4>
        <p>
          <Typography.Paragraph ellipsis={{ rows: 1 }}>{department.description}</Typography.Paragraph>
        </p>
        <Link
          className="explore-button"
          to={`/products/${department.slug}?${
            QueryStringKeys.CATEGORIES
          }=${department.slug!}&${getDefaultSearchOptionsQueryParams()}`}
        >
          <Button className="custom-antd-btn">{t(EXPLORE_PRODUCTS)}</Button>
        </Link>
      </div>
    </div>
  );
};
