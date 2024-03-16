/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Col, Row } from 'antd';
import { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { useProductsSearch } from '../../../app/hooks/useProductsSearch';
import Separator from '../../../components/separator';
import { ProductsHeader } from '../components/products_header';
import { ProductsSubDepartmentsCards } from '../components/products_sub_departments_cards';
import { ProductsList } from '../components/search_products_list';
import { MetaTags } from '../../../components/meta_tags';
import { MANZILIK, SHOPPING, HOME_PAGE_SEO_DESCRIPTION } from '../../../locales/strings';
import { useFiltersForm } from '../../../app/hooks/filters/useFiltersForm';
import * as analytics from '../../../analytics';

const SubDepartmentPage: FunctionComponent = () => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  const search = useProductsSearch();
  const filtersForm = useFiltersForm({
    onSubmit(filtersValues) {
      search.setFilters(filtersValues);
    },
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (search.initialFilters && search.filtersSource.length) {
      filtersForm.initForm(search.initialFilters);
    }
  }, [search.initialFilters, search.filtersSource]);

  useEffect(() => {
    if (search.queryString) {
      history.replace(pathname + search.queryString);
    }
  }, [search.queryString]);

  useEffect(() => {
    if (search.keywords.length === 0 && search.categories.length === 0) {
      return; // skip generic requests
    } else {
      search.updateProducts();
    }
  }, [search.queryString, i18n.language]);

  const onSearch = (keywords: string) => {
    analytics.PublishEvent(new analytics.AnalyticsSearchEvent(keywords));
    search.setKeywords(keywords);
  };

  const clear = () => {
    search.clear(true);
    filtersForm.reset();
  };

  return (
    <Row className="products-page-container no-scroll" justify="center">
      <MetaTags title={`${t(MANZILIK)} | ${t(SHOPPING)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      <Col span={20}>
        <ProductsSubDepartmentsCards categories={search.categories} />
        <ProductsHeader
          filtersCache={search.filtersCache}
          filtersForm={filtersForm}
          filtersSource={search.filtersSource as any}
          keywords={search.keywords}
          totalProducts={search.totalProducts}
          range={search.getRange()}
          setKeywords={search.setKeywords}
          onSubmitKeywords={onSearch}
          sortMethod={search.searchOptions.sortMethod}
          onSort={search.setSortMethod}
          clear={clear}
        />
        <Separator vertical={6} />
        <ProductsList
          loading={search.loading}
          pageSize={search.searchOptions.recordsLimit}
          stockRecords={search.products}
          totalProducts={search.totalProducts}
          currentPage={search.getCurrentPage()}
          onPageChange={search.onPageChange}
        />
      </Col>
    </Row>
  );
};

export default SubDepartmentPage;
