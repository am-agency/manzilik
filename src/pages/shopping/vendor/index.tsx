/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Col, Row, Typography } from 'antd';
import { withFeature } from 'flagged';
import { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Partner } from '../../../API';
import { useProductsSearch } from '../../../app/hooks/useProductsSearch';
import { useMainContext } from '../../../app/providers/main';
import { ECOMMERCE_FEATURE, VENDOR_PAGE } from '../../../app/settings';
import { productsIcons } from '../../../assets/icons/products';
import { Container } from '../../../components/container';
import { ReviewsList } from '../../../components/reviews_list';
import Separator from '../../../components/separator';
import { UserDetailsLog } from '../../../components/user_details_log';
import { PROVIDER } from '../../../locales/strings';
import { Review } from '../../professionals/components/review';
import { ProductsHeader } from '../components/products_header';
import { ProductsList } from '../components/search_products_list';
import { getPartner } from './api';
import { useFiltersForm } from '../../../app/hooks/filters/useFiltersForm';

const VendorProfile: FunctionComponent = () => {
  const {
    requestApi,
    userState: { isAuthenticated },
  } = useMainContext();
  const { id }: { id: string } = useParams();
  const [partner, setPartner] = useState<Partner>();
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const search = useProductsSearch(id);
  const filtersForm = useFiltersForm({
    onSubmit(filtersValues) {
      search.setFilters(filtersValues);
    },
  });

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

  const getPartnerDetails = () => {
    const params = { isAuthenticated, id };
    requestApi(getPartner, params, (result: Partner, error: string) => {
      if (error) {
        return;
      }
      setPartner(result);
    });
  };

  useEffect(() => {
    getPartnerDetails();
  }, []);

  useEffect(() => {
    search.updateProducts();
  }, [search.queryString]);

  const clear = () => {
    search.clear(true);
    filtersForm.reset();
  };

  return (
    <div className="vendor-profile">
      <Container>
        <Row justify="center" className="vendor-wrapper vendor-profile_header">
          <Col span={22}>
            <Row justify="space-between" align="middle">
              <Col xl={10} lg={10} md={12} sm={24} xs={24}>
                <Row wrap={false}>
                  <div className="vendor-picture">
                    <img className="img-fit-content rounded-border" src={partner?.logo!} alt={partner?.name!} />
                  </div>
                  <Separator horizontal={14} />
                  <div className="personal-info">
                    <h1 className="vendor-name txt">
                      {t(PROVIDER)} | {partner?.name}
                    </h1>
                    <Review reviews_total={partner?.reviews_total!} reviews_count={partner?.reviews_count!} />
                    <h3 className="vendor-address txt">{partner?.address}</h3>
                  </div>
                </Row>
              </Col>
              <Col className="extra-info">
                <UserDetailsLog
                  analyticsContactName={partner?.name!}
                  renderContent={
                    <>
                      {/**will enable the url when it's done from backend */}
                      {/* <a href={'/'} target="_blank" rel="noreferrer">
                      <Button type="primary" className="website-btn">
                        {t(WEBSITE)}
                      </Button>
                    </a> */}
                      <Separator vertical={10} />
                      {partner?.email && (
                        <div>
                          <img src={productsIcons.mail} alt="email" />
                          &nbsp;&nbsp;
                          <Typography.Text className="vendor-email">{partner?.email}</Typography.Text>
                        </div>
                      )}
                    </>
                  }
                  user={{ screenName: VENDOR_PAGE, contactName: partner?.name! }}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="products-page-container no-scroll" justify="center">
          <Col span={24}>
            <ProductsHeader
              filtersCache={search.filtersCache}
              filtersForm={filtersForm}
              filtersSource={search.filtersSource as any[]}
              keywords={search.keywords}
              totalProducts={search.totalProducts}
              range={search.getRange()}
              setKeywords={search.setKeywords}
              onSubmitKeywords={search.setKeywords}
              sortMethod={search.searchOptions.sortMethod}
              onSort={search.setSortMethod}
              clear={clear}
            />
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

        <Separator vertical={40} />
        <Row>
          <Col xl={15} lg={15} md={20} sm={24} xs={24}>
            {partner?.id && (
              <ReviewsList
                updateUser={getPartnerDetails}
                userId={id}
                is_reviewable={partner?.is_reviewable!}
                reviews_total={partner?.reviews_total!}
                reviews_count={partner?.reviews_count!}
                isPartner={true}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withFeature(ECOMMERCE_FEATURE)(VendorProfile);
