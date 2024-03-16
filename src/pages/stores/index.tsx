import { Col, Input, Row, Select, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Brand, SearchData } from '../../API';
import { FilterKey } from '../../app/hooks/search/useSearchFilters';
import { getLayoutDirection } from '../../app/layouts';
import { useMainContext } from '../../app/providers/main';
import icons from '../../assets/icons';
import { Container } from '../../components/container';
import { MetaTags } from '../../components/meta_tags';
import { PaginationList } from '../../components/pagination_list/pagination_list';
import Separator from '../../components/separator';
import * as analytics from '../../analytics';

import {
  BRANDS,
  CHOOSE_BRAND_TYPE,
  CLEAR_ALL,
  FIND_STORE,
  HOME_PAGE_SEO_DESCRIPTION,
  MANZILIK,
  TYPE,
} from '../../locales/strings';
import { getPaginationOffset, throttle } from '../../utils';
import { BRANDS_ROUTE } from '../../utils/routes';
import { search } from '../ideas/api';
import StoreItem from './components/store_item';
import { useSearchBrands } from './hooks/useSearchBrands';
import { TagsList } from './tags_list';
import { BrandType, TagsState } from './types';

interface InputEvent {
  currentTarget: { value: string };
}
const Stores = () => {
  const { t, i18n } = useTranslation();
  const searchBrands = useSearchBrands();
  const langDirection = getLayoutDirection(i18n.language);
  const { requestApi } = useMainContext();
  const [keywords, setKeywords] = useState<string>();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsCount, setBrandsCount] = useState(0);
  const history = useHistory();
  const [tagsState, setTagsList] = useState<TagsState>({
    storeTags: [],
    hasTags: false,
  });

  const onTagClose = () => {
    setTagsList({ storeTags: [], hasTags: false });
  };

  const onKeywordChange = (event: InputEvent) => {
    setKeywords(event.currentTarget.value);
  };

  const onSubmitKeyowrd = () => {
    searchBrands.setKeywords(keywords || '');
    if (keywords) {
      analytics.PublishEvent(new analytics.AnalyticsSearchEvent(keywords));
    }
  };

  useEffect(() => {
    setKeywords(searchBrands.initKeywords);
  }, [searchBrands.initKeywords]);

  const onTypeInputChange = (value: string) => {
    searchBrands.setOffset(0);
    searchBrands.setFilter(FilterKey.TYPE, [value]);
    if (value == TYPE) {
      searchBrands.removeFilter(FilterKey.TYPE, '');
    }
  };

  const getBrands = () => {
    requestApi(
      search,
      searchBrands.getQueryPayload(),
      (response: { results: SearchData[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        const { results, count } = response;
        const data = results
          .map((result) => (result.data ? JSON.parse(result.data) : null))
          .filter((item) => item !== null);
        setBrands(data);
        setBrandsCount(count);
      }
    );
  };

  useEffect(() => {
    getBrands();
  }, [i18n.language, searchBrands.queryString]);

  const onPageChange = (page: number) => {
    const offset = getPaginationOffset(page, searchBrands.searchOptions.recordsLimit);
    searchBrands.setOffset(offset);
  };

  useEffect(() => {
    const url = `${BRANDS_ROUTE}${searchBrands.queryString}`;
    history.replace(url);
  }, [searchBrands.queryString]);

  const brandsTypeFilterValue = useMemo(() => {
    const [value] = searchBrands.filters[FilterKey.TYPE] || [];
    return value;
  }, [searchBrands.filters]);

  return (
    <>
      <MetaTags title={`${t(MANZILIK)} | ${t(BRANDS)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      <div className="professional select-wrapper">
        <div className="filters-wrapper">
          <Container>
            <Row>
              <Col xl={4} lg={4} md={24} sm={24} xs={24}>
                <Select
                  placeholder={t(CHOOSE_BRAND_TYPE)}
                  showSearch
                  showArrow
                  onChange={onTypeInputChange}
                  maxTagCount={0}
                  optionFilterProp={'label'}
                  value={brandsTypeFilterValue}
                >
                  <Select.Option value={TYPE} className={langDirection}>
                    {t(CHOOSE_BRAND_TYPE)}
                  </Select.Option>
                  <Select.Option value={BrandType.LOCAL} label={t(BrandType.LOCAL)} className={langDirection}>
                    {t(BrandType.LOCAL)}
                  </Select.Option>
                  <Select.Option value={BrandType.GLOBAL} label={t(BrandType.GLOBAL)} className={langDirection}>
                    {t(BrandType.GLOBAL)}
                  </Select.Option>
                </Select>
              </Col>
              <Separator horizontal={14} />
              <Col xl={6} lg={6} md={24} sm={24} xs={24}>
                <Input
                  placeholder={t(FIND_STORE)}
                  prefix={<img src={icons.search.icon} />}
                  onPressEnter={onSubmitKeyowrd}
                  onChange={onKeywordChange}
                  value={keywords}
                />
              </Col>
            </Row>
            {tagsState.hasTags && <Separator vertical={10} />}
            <Row align="middle">
              <TagsList tags={tagsState.storeTags} onTagClose={onTagClose} />
              {tagsState.hasTags && (
                <Typography.Text className="clear-all clickable">
                  <div className="inner-content" onClick={onTagClose}>
                    {t(CLEAR_ALL)}
                  </div>
                </Typography.Text>
              )}
            </Row>
          </Container>
        </div>

        <Container>
          <section className="stores-list">
            <PaginationList
              currentPage={searchBrands.getCurrentPage()}
              pageSize={searchBrands.searchOptions.recordsLimit}
              total={brandsCount}
              dataSource={brands}
              renderItem={(item: unknown) => <StoreItem key={(item as Brand).id} item={item as Brand} />}
              onPageChange={onPageChange}
            />
          </section>
        </Container>
      </div>
    </>
  );
};

export default Stores;
