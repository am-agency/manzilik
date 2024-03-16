import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumb } from 'antd';
//hooks
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { useMainContext } from '../../app/providers/main';
//strings
import { breadcrumb } from '../../API';
import { ALL_PRODUCTS } from '../../locales/strings';
import { PRODUCTS_MAIN_ROUTE } from '../../utils/routes';

export interface ProductsParams {
  primary: string;
  secondary: string;
  tertiary: string;
  product: string;
  id: string;
}

interface Props {
  base?: string;
  breadcrumbs?: (breadcrumb | null)[];
  getQueryParams?: (slug: string) => string;
}

export const BreadCrumbHeader = ({ breadcrumbs, base, getQueryParams }: Props) => {
  const { i18n } = useTranslation();

  const links = useMemo(() => {
    return (
      breadcrumbs
        ?.map((item, index) => {
          const slug = breadcrumbs
            ?.slice(0, index + 1)
            .map((item) => item?.slug)
            .join('/');
          return { title: item?.title, slug };
        })
        .map(({ title, slug }) => ({
          title: title,
          url: `${base}/${slug}${getQueryParams ? getQueryParams(slug) : ''}`,
        })) || []
    );
  }, [breadcrumbs, base]);

  return (
    <>
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          <Link to={PRODUCTS_MAIN_ROUTE}>{i18n.t(ALL_PRODUCTS)}</Link>
        </Breadcrumb.Item>
        {links.map((link) => (
          <Breadcrumb.Item key={link.url}>
            <Link to={link.url}> {link.title} </Link>
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </>
  );
};
