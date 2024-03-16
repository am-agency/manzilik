import React, { FunctionComponent, useMemo } from 'react';
import { Row, Typography } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { NOT_FOUND_ROUTE, PRODUCTS_MAIN_ROUTE } from '../../../../../utils/routes';
import { QueryStringKeys } from '../../../../../app/hooks/search/useSearchQuery';
import { TDepartment } from '../sub_departments_list';
interface Props {
  parentUrl?: string;
  selectedDepartmentUrl: string;
  setSelectedDepartmentUrl: (url: string) => void;
  subDepartment: TDepartment | null;
}

export const SubDepartmentCard: FunctionComponent<Props> = ({
  parentUrl,
  subDepartment,
  selectedDepartmentUrl,
  setSelectedDepartmentUrl,
}: Props) => {
  const params = useParams<Record<string, string>>();
  if (!subDepartment) {
    return null;
  }

  const segments = useMemo(() => {
    return subDepartment.breadcrumbs?.map((department) => department?.slug) || [];
  }, [subDepartment.breadcrumbs]);

  const path = useMemo(() => {
    return segments.join('/') || NOT_FOUND_ROUTE;
  }, [segments]);

  const currentUrlParams = useMemo(() => {
    const _params = [];
    let i = 0;
    while (params[i]) {
      _params.push(params[i]);
      i++;
    }
    return _params;
  }, [params]);

  const selectedDepartment = useMemo(() => {
    return path === currentUrlParams.join('/');
  }, [path, currentUrlParams]);

  const url = useMemo(() => {
    const category = segments[segments.length - 1];
    const search = category ? `?${QueryStringKeys.CATEGORIES}=${category}&${QueryStringKeys.OFFSET}=0` : '';
    return `${PRODUCTS_MAIN_ROUTE}/${path}${search}`;
  }, [path]);

  const selected = useMemo(() => {
    if (selectedDepartmentUrl) {
      return parentUrl === selectedDepartmentUrl;
    }
    return false;
  }, [selectedDepartmentUrl, segments]);

  return (
    <>
      {selected ? (
        <>
          <Link to={url}>
            <section className="product-category-card-container clickable">
              <Row align="middle" justify="center">
                <img className="category-photo" src={subDepartment?.photo_url!} />
              </Row>
              <div className="category-name-wrapper">
                <Typography.Paragraph ellipsis={{ rows: 2 }}>
                  <Typography.Text className="category-name">
                    {subDepartment.title} {selectedDepartment}
                  </Typography.Text>
                </Typography.Paragraph>
              </div>
            </section>
          </Link>
        </>
      ) : null}

      {subDepartment.sub_departments?.map((deepDepartment) => (
        <SubDepartmentCard
          key={deepDepartment.id}
          parentUrl={path}
          subDepartment={deepDepartment}
          selectedDepartmentUrl={selectedDepartmentUrl}
          setSelectedDepartmentUrl={setSelectedDepartmentUrl}
        />
      ))}
    </>
  );
};
