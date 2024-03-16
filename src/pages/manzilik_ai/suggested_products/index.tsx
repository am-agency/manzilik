/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import DropdownWithSearch, { DropdownSearchOption } from '../../../components/dropdown_search';
import { getLayoutDirection } from '../../../app/layouts';
import { useTranslation } from 'react-i18next';
import { Button, Col, Row } from 'antd';
import OriginalImageComponent from './original_image_component';
import ProductCard from './product_card';
import AiHeaderImage from '../../../assets/images/ai.png';
import * as analytics from '../../../analytics';

import {
  ADD_ACCOUNT_POINTS,
  ALL_PRICES,
  ANALYZE_PRODUCTS,
  CLASSIC_VIEW,
  CLASSIFY_STORES,
  FIND_VENDOR,
  GET_IT_NOW,
  MORE,
  NOT_EXIST,
  NO_PRODUCTS_EXIST,
  PREVIEW_YOUR,
  VIEW,
} from '../../../locales/strings';
import icons from '../../../assets/icons';
import ImageLabel from './image_label';
import { useSimilarProductsService } from './useSimilarProductsService';
import { useHistory, useLocation } from 'react-router-dom';
import Loader from 'react-spinners/ClipLoader';
import { API } from 'aws-amplify';
import { graphqlAuthenticationOperation } from '../../../utils';
import { onSimilarProductUpdate } from '../../../custom_graphql/subscriptions';
import { AIPagination, AISimilarProductFeature, AISimilarProductStatus, SimilarAIProduct, Vendors } from '../../../API';
import AiLoader from '../components/ai_loader';
import PremiumBox from './premium_box';
import { RemoteConfigContext, RemoteConfigContextType } from '../../../context/remote_config_context';
import PremiumCard from './premium_card';
import ManzilikDrawer from '../../../components/manzilik_drawer';
import { useMediaQuery } from 'react-responsive';
import { AR } from '../../../locales/constants';

import EmptyState from '../../../components/empty_state_component';
import { aiIcons } from '../../../assets/icons/ai';
import UserPoints from '../components/user_points';
import LogosBox from './premium_box/logos_box';
import FlowDynamicCard from './flow_dynamic_card';
import PackageDetails from '../ai_checkout/components/package_details';
import { useClient } from '../../../app/hooks/use_client';
import {
  ObjectRecognitionContext,
  ObjectRecognitionProps,
  ObjectRecognitionProvider,
} from './object_recognation_context';

const SuggestedProducts: React.FC = () => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const { pathname } = location;
  const objectId = pathname.split('/')[3];
  const isPurchased = location.search.split('=')[1] === 'true';
  const [listSources, setListSources] = React.useState<DropdownSearchOption[]>([]);
  const [filterProducts, setFilterProducts] = React.useState<SimilarAIProduct[]>([]);
  const [listStatus, setListStatus] = React.useState<AISimilarProductStatus>(AISimilarProductStatus.PENDING);
  const [isObjectPurchased, setIsObjectPurchased] = useState<boolean>(false);
  const { isFlowOne, listVendors, refreshListVendors, listNotPremiumVendors } = useContext(
    ObjectRecognitionContext
  ) as ObjectRecognitionProps;
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });
  const history = useHistory();
  const isArabic = i18n.language === AR;
  const [pagination, setPagination] = useState<AIPagination>({
    limit: 1000,
    offset: 0,
  });
  const { client } = useClient();

  useEffect(() => {
    if (isPurchased) {
      setIsObjectPurchased(true);
    } else {
      setIsObjectPurchased(false);
    }
    // eslint-disable-next-line no-console
    console.log('isPurchased', typeof isPurchased);
  }, [isPurchased]);
  const clientPoints = useMemo(() => {
    if (client) {
      return client?.balance;
    }
  }, [client]);

  const {
    similarProductsCount,
    startSimilarProductsProcess,
    isEmpty,
    isLoading,
    similarProducts,
    loadMoreSimilarProductList,
    loadSimilarProductList,
    creditDeduction,
  } = useSimilarProductsService();

  const handleSelect = (selectedOptions: Vendors[]) => {
    if (selectedOptions.length === 0) {
      setFilterProducts(similarProducts);
      return;
    } else {
      const selectedSources = selectedOptions.map((option) => option.name);
      const filteredProducts = similarProducts.filter((product) => selectedSources.includes(product.source!));
      setFilterProducts(filteredProducts);
    }
  };
  const handleCreditDeduction = () => {
    creditDeduction(objectId, AISimilarProductFeature.SEE_MORE)
      .then((results) => {
        // eslint-disable-next-line no-console
        console.log('results', results);
        setIsDrawerOpen(false);
        loadSimilarProductList(
          pagination,
          {
            object_id: objectId,
            feature: isFlowOne ? AISimilarProductFeature.PREMIUM : AISimilarProductFeature.SEE_MORE,
          },
          false
        );
        history.push(`/manzilik-ai/suggested-products/${objectId}?isPurchased=true`);
        refreshListVendors();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('error', error);
      });
    clientPoints! > 0
      ? analytics.PublishEvent(new analytics.AnalyticsConfirmSubPointsEvent('sufficient'))
      : analytics.PublishEvent(new analytics.AnalyticsConfirmSubPointsEvent('insufficient'));
  };

  useEffect(() => {
    if (similarProducts.length > 0) {
      setFilterProducts(similarProducts);
      const sources = similarProducts.map((product) => {
        return {
          id: product.id,
          name: product.source,
        };
      });
      // filter unique sources
      const uniqueSources = sources.filter(
        (source, index, self) => index === self.findIndex((t) => t.name === source.name)
      );

      setListSources(uniqueSources as DropdownSearchOption[]);
    }
  }, [similarProducts]);

  useEffect(() => {
    startSimilarProductsProcess(objectId);
  }, [objectId]);

  useEffect(() => {
    if (listStatus == AISimilarProductStatus.SUCCESS) {
      loadSimilarProductList(
        pagination,
        {
          object_id: objectId,
          feature: isFlowOne ? AISimilarProductFeature.PREMIUM : AISimilarProductFeature.SEE_MORE,
        },
        false
      );
    }
  }, [listStatus]);

  useEffect(() => {
    if (!objectId) {
      return;
    }
    const subscription = (
      API.graphql(
        graphqlAuthenticationOperation(onSimilarProductUpdate, {
          object_id: objectId,
        })
      ) as any
    ).subscribe({
      next: (eventData: any) => {
        const similarProductNotifications = eventData.value.data.onSimilarProductUpdate;
        if (!similarProductNotifications.error) {
          setListStatus(similarProductNotifications.status);

          // eslint-disable-next-line no-console
          console.log('similarProductNotifications', similarProductNotifications);
        } else {
          console.error(similarProductNotifications.error);
        }
      },
      error: (error: never) => console.error("Can't subscribe", error),
    });

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe();
  }, [objectId]);

  const handleLoadMore = () => {
    setPagination({
      ...pagination,
      offset: pagination.offset! + pagination.limit!,
    });

    loadMoreSimilarProductList(
      {
        object_id: objectId,
      },
      pagination,
      true
    );
  };

  return (
    <div className="suggested-products-container" style={{ direction: getLayoutDirection(i18n.language) }}>
      <Row justify="center">
        <Col span={20}>
          <Row justify="center">
            <Col xl={8} lg={10} md={10} sm={24} xs={24}>
              <OriginalImageComponent />
            </Col>

            <Col xl={16} lg={14} md={14} sm={24} xs={24}>
              {/* <p className="page-title">{t(CLASSIC_VIEW)}</p> */}
              <DropdownWithSearch
                options={isObjectPurchased || !isFlowOne ? listVendors : listNotPremiumVendors}
                onSelect={handleSelect}
                inputPlaceholder={t(FIND_VENDOR)}
                dropdownTitle={t(CLASSIFY_STORES)}
                onSeeMoreClick={() => {
                  setIsDrawerOpen(true);
                  isFlowOne
                    ? analytics.PublishEvent(new analytics.AnalyticsViewManfacturerFilterEvent())
                    : analytics.PublishEvent(new analytics.AnalyticsViewHiddenFilterEvent());
                }}
                isObjectPurchased={isObjectPurchased}
              />
              <div className="products-container">
                {isLoading || listStatus === AISimilarProductStatus.PENDING ? (
                  <div className="loader">
                    <AiLoader title={t(ANALYZE_PRODUCTS)} />
                  </div>
                ) : isEmpty ? (
                  <div className="empty">
                    <EmptyState title={t(NO_PRODUCTS_EXIST)} image={aiIcons.emptyResult} />
                  </div>
                ) : (
                  <>
                    {isFlowOne && !isPurchased && (
                      <PremiumBox
                        onPremiumBoxClick={() => {
                          setIsDrawerOpen(true);
                          analytics.PublishEvent(new analytics.AnalyticsViewHiddenManfacturerEvent());
                        }}
                      />
                    )}

                    {filterProducts.map((product, index) => {
                      return (
                        <ProductCard
                          key={product.id}
                          title={product.title!}
                          subtitle={product.source! || '-'}
                          price={product.price!}
                          imageSrc={product.thumbnail!}
                          sourceLogo={product.source_icon!}
                          link={product.link!}
                        />
                      );
                    })}
                    {!isFlowOne && !isPurchased && (
                      <PremiumCard
                        onPremiumCardClick={() => {
                          setIsDrawerOpen(true);
                          analytics.PublishEvent(new analytics.AnalyticsViewHiddenProductsEvent());
                        }}
                      />
                    )}
                  </>
                )}
              </div>
              {/* {similarProducts.length > 0 && similarProductsCount >= pagination.limit! && (
                <div className="load-more-container">
                  <button className="load-more-button" onClick={handleLoadMore}>
                    {t(MORE)}
                    <img src={icons.arrowDown.icon} alt="Load More" />
                  </button>
                </div>
              )} */}
            </Col>
          </Row>
        </Col>
      </Row>

      <ManzilikDrawer
        size={isMobileView ? 365 : 482}
        open={isDrawerOpen}
        setDrawerOpen={setIsDrawerOpen}
        direction={isArabic ? 'right' : 'left'}
        className="object-recognition-wrapper"
      >
        {clientPoints! > 0 ? (
          <FlowDynamicCard setIsDrawerOpen={setIsDrawerOpen} onHandleCreditDeduction={handleCreditDeduction} />
        ) : (
          <div className="packages">
            <div className="header">
              <img src={icons.rightArrowSlim} alt="label" onClick={() => setIsDrawerOpen(false)} />
            </div>
            <div className="packages-header">
              <p className="packages-h1">{t(ADD_ACCOUNT_POINTS)}</p>
              <img src={AiHeaderImage} />
              <p className="packages-h2">{t(ALL_PRICES)}</p>
            </div>
            <PackageDetails />
          </div>
        )}
      </ManzilikDrawer>
    </div>
  );
};

export default SuggestedProducts;
