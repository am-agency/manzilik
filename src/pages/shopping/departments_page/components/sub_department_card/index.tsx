import React, { useMemo } from 'react';
import { Typography } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Department } from '../../../../../API';
import i18n from '../../../../../app/i18n';
import { getLayoutDirection } from '../../../../../app/layouts';
import { PRODUCTS_MAIN_ROUTE } from '../../../../../utils/routes';
import { Link } from 'react-router-dom';
import { QueryStringKeys } from '../../../../../app/hooks/search/useSearchQuery';
import { getDefaultSearchOptionsQueryParams } from '../../../../../app/hooks/search/useSearchOptions';

interface Props {
  sub_department: Department;
}

export const SubDepartmentCard = ({ sub_department }: Props) => {
  const url = useMemo(() => {
    const breadcrumb = sub_department.breadcrumbs!;
    return `${PRODUCTS_MAIN_ROUTE}/${breadcrumb.map((breadcrumb) => breadcrumb?.slug).join('/')}?${
      QueryStringKeys.CATEGORIES
    }=${sub_department.slug!}&${getDefaultSearchOptionsQueryParams()}`;
  }, [sub_department.breadcrumbs]);

  return (
    <Link to={url}>
      <div className="department-category-card clickable">
        <div className="img-wrapper">
          <LazyLoadImage src={sub_department?.photo_url!} className={getLayoutDirection(i18n.language)} />
        </div>
        <div className={`card-head ${getLayoutDirection(i18n.language)}`}>
          <h4>{sub_department.title}</h4>
          <Typography.Paragraph ellipsis={{ rows: 1 }}>
            {/* <p>{sub_department.products_count}</p> */}
          </Typography.Paragraph>
        </div>
      </div>
    </Link>
  );
};
