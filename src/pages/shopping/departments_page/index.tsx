import React, { useEffect, useState } from 'react';
import { withFeature } from 'flagged';
import { Container } from '../../../components/container';
import Separator from '../../../components/separator';
import { BannerSection } from './components/banner';
import { useTranslation } from 'react-i18next';
import { DepartmentSection } from './components/department_section';
import { Input, Typography } from 'antd';
import DepartmentsProductsList from './components/departments_products_list';
import {
  EXPLORE_MORE_FAV_PRODUCTS,
  HOME_PAGE_SEO_DESCRIPTION,
  MANZILIK,
  SHOPPING,
  SHOP_SEARCH,
  SHOP_SEARCH_HEADING,
  SHOP_SEARCH_SUBHEADING,
} from '../../../locales/strings';
import { useMainContext } from '../../../app/providers/main';
import { getBannerDetails, listDepartments } from './api';
import { Banner, Department } from '../../../API';
import { ECOMMERCE_FEATURE } from '../../../app/settings';
import { CardsSkeleton } from '../../../components/skeletons/cards_grid_skeleton';
import { LOADING_UPLOADING_PRODUCT } from '../../../app/providers/main/loading_constants';
import { MetaTags } from '../../../components/meta_tags';
import { useHistory } from 'react-router-dom';
import { useSearchQuery } from '../../../app/hooks/search/useSearchQuery';
import { PRODUCTS_SEARCH_ROUTE } from '../../../utils/routes';
import * as analytics from '../../../analytics';
import icons from '../../../assets/icons';

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [banner, setBanner] = useState<Banner>();
  const { i18n, t } = useTranslation();
  const { requestApi, loadingMap } = useMainContext();
  const [inputKeyword, setInputKeyword] = useState('');
  const history = useHistory();
  const query = useSearchQuery({});

  const getDepartments = () => {
    requestApi(
      listDepartments,
      { limit: 50, offset: 0 },
      (response: { results: Department[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        const { results, count } = response;
        setDepartments(results);
      },
      LOADING_UPLOADING_PRODUCT
    );
  };

  const getBanner = () => {
    requestApi(getBannerDetails, {}, (response: Banner, error: string) => {
      if (error) {
        return;
      }
      setBanner(response);
    });
  };

  useEffect(() => {
    getDepartments();
    getBanner();
  }, [i18n.language]);

  const onSubmitKeyword = (keyword: string) => {
    analytics.PublishEvent(new analytics.AnalyticsSearchEvent(keyword));
    const search = query.getQueryString({ keywords: keyword });
    history.push(`${PRODUCTS_SEARCH_ROUTE}${search}`);
  };

  return (
    <Container>
      <MetaTags title={`${t(MANZILIK)} | ${t(SHOPPING)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      <div className="departments-page">
        <section className="shopping-search-box">
          <Typography.Text className="heading">{t(SHOP_SEARCH_HEADING)}</Typography.Text>
          <Typography.Title className="sub-heading">{t(SHOP_SEARCH_SUBHEADING)}</Typography.Title>
          <section className="search-input-container">
            <Input
              className="search-input"
              placeholder={t(SHOP_SEARCH)}
              prefix={<img src={icons.search.icon} />}
              onPressEnter={() => onSubmitKeyword(inputKeyword)}
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
            />
            <Separator horizontal={14} />
          </section>
        </section>
        <Separator vertical={15} />
        {departments
          .filter((elm) => elm.sub_departments?.length !== 0)
          .slice(0, 3)
          .map((department, index) => (
            <div key={index}>
              <DepartmentSection department={department} index={index} />
            </div>
          ))}
        <div>
          {loadingMap[LOADING_UPLOADING_PRODUCT] && (
            <CardsSkeleton cardsCount={4} colSpan={{ xl: 6, lg: 6, md: 6, sm: 24, xs: 24 }} />
          )}
        </div>
        {banner && <BannerSection banner={banner} />}

        <Separator vertical={25} />

        {departments
          .filter((elm) => elm.sub_departments?.length !== 0)
          .slice(3, departments.length)
          .map((department, index) => (
            <div key={index}>
              <DepartmentSection department={department} index={index} />
            </div>
          ))}

        <Typography.Text className="title">{t(EXPLORE_MORE_FAV_PRODUCTS)} </Typography.Text>
        <Separator vertical={20} />
        <DepartmentsProductsList hasLanguageChangedContent={true} />
      </div>
    </Container>
  );
};

export default withFeature(ECOMMERCE_FEATURE)(Departments);
