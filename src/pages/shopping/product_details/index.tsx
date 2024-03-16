/* eslint-disable no-console */
import React, { useMemo } from 'react';
import { Col, Image, Row } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router';

// utils
import { getLayoutDirection } from '../../../app/layouts';
import { PRODUCTS_MAIN_ROUTE } from '../../../utils/routes';

// hooks
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../app/providers/main';
import { useModal } from '../../../app/providers/modal';

// components
import { BreadCrumbHeader, ProductsParams } from '../../../components/bread_crumbs_header';
import { Container } from '../../../components/container';
import { ModalTitle } from '../../../components/modal_title';
import Separator from '../../../components/separator';
import { Slider } from '../../../components/slider';
import { Reviews } from '../reviews';
import { ProductActions } from './components/product_actions';
import { ProductDetailsSection } from './components/product_details_section';
import ProductSliders from './components/product_sliders';
import { ProductTabs } from './components/product_tabs';
import { QuantityForm } from './components/quantity_form';

// language
import { ADD_QUANTITY, PREVIEW, SUBMIT } from '../../../locales/strings';

// api
import { withFeature } from 'flagged';
import { StockRecord } from '../../../API';
import { LOADING_UPLOADING_PRODUCT } from '../../../app/providers/main/loading_constants';
import { ECOMMERCE_FEATURE } from '../../../app/settings';
import CardsGridSkeleton, { CardsSkeleton } from '../../../components/skeletons/cards_grid_skeleton';
import { getStockRecord } from './api';
import { AttributeName, SelectedAttributes, useProductAttributes } from './hooks/useProductAttributes';
import { QueryStringKeys } from '../../../app/hooks/search/useSearchQuery';

const ProductDetails: FunctionComponent = () => {
  const [stockRecord, setStockRecord] = useState<StockRecord>();
  const [mainPhotoUrl, setMainPhotoUrl] = useState<string>(stockRecord?.product?.photo_url!);
  const [quantity, setQuantity] = useState<string>('1');
  const { i18n, t } = useTranslation();
  const { requestApi, loadingMap } = useMainContext();
  const history = useHistory();
  const { showModal, form } = useModal();
  const url: ProductsParams = useParams();
  const { selectedAttribute, setSelectedAttribute, attributes } = useProductAttributes({ stockRecord });
  const [isStockRecordLoading, setIsStockRecordLoading] = useState<boolean>(false);

  const location = useLocation();

  const getProductUrlByStockRecordId = (id: string) => {
    const newUrl = (location.pathname = `/product/${id}`);
    return newUrl;
  };

  const onSelectAttribute = (selected: SelectedAttributes) => {
    setSelectedAttribute((pre) => ({ ...pre, ...selected }));
    let stockRecordId = selected?.color?.stockRecord?.id;

    if (AttributeName.Color.toLowerCase() in selected) {
      const matchedDimensions = selected.color?.relatedAttributes.find(
        (attr) => attr.value === selectedAttribute?.dimensions?.value
      );
      if (matchedDimensions) {
        stockRecordId = matchedDimensions.stockRecord.id;
      }
    }
    if (AttributeName.Dimensions.toLowerCase() in selected) {
      stockRecordId = selected.dimensions?.stockRecord.id;
    }

    if (stockRecordId) {
      history.push(getProductUrlByStockRecordId(stockRecordId));
      getProductDetails(stockRecordId);
    }
  };

  const getProductDetails = (id: string) => {
    setIsStockRecordLoading(true);
    requestApi(
      getStockRecord,
      { id },
      (response: StockRecord, error: string) => {
        if (error) {
          return;
        }
        setIsStockRecordLoading(false);
        setStockRecord(response);
        setMainPhotoUrl(response.product!.photo_url!);
      },
      LOADING_UPLOADING_PRODUCT
    );
  };

  const onClickItem = (photoUrl: string) => {
    setMainPhotoUrl(photoUrl);
  };

  const onFinish = ({ itemNumber }: { itemNumber: string }) => {
    setQuantity(itemNumber);
  };

  const onSelectQuantity = (value: string, itemsLeft: number) => {
    if (value == '10') {
      showModal(
        <ModalTitle title={t(ADD_QUANTITY)} />,
        <QuantityForm onFinish={onFinish} form={form!} itemsLeft={itemsLeft} />,
        'modal-wrapper',
        t(SUBMIT)
      );
    } else {
      setQuantity(value);
    }
  };
  useEffect(() => {
    if (url.id) {
      getProductDetails(url.id);
    }
  }, [i18n.language, url.id]);

  const breadcrumb = useMemo(() => {
    return stockRecord?.product?.breadcrumbs || [];
  }, [stockRecord]);

  const getQueryParams = (slug: string) => {
    const [mostSpecific] = slug.split('/').slice(-1);
    return `?${QueryStringKeys.CATEGORIES}=${mostSpecific}`;
  };

  return (
    <Container>
      <Separator vertical={10} />
      <BreadCrumbHeader breadcrumbs={breadcrumb} base={PRODUCTS_MAIN_ROUTE} getQueryParams={getQueryParams} />
      <Separator vertical={10} />
      <div className="product-details">
        <Row gutter={24}>
          <Col xl={15} lg={15} md={24} sm={24} xs={24}>
            {stockRecord && (
              <Row justify="center" align="middle" className="product-photo-wrapper img-zoom-wrapper">
                <Image preview={{ mask: t(PREVIEW) }} className="img-fit-content" src={mainPhotoUrl} />
                <ProductActions url={url} />
              </Row>
            )}
            <Slider
              slidesToScroll={{ xl: 5, lg: 5, md: 2, sm: 1 }}
              slidesToShow={{ xl: 5, lg: 5, md: 2, sm: 1 }}
              listLength={stockRecord?.product?.images?.length}
            >
              {stockRecord?.product?.images?.map((elm) => {
                return (
                  <div
                    key={elm?.id}
                    className={`img-wrapper ${getLayoutDirection(i18n.language)}`}
                    onClick={() => onClickItem(elm?.original!)}
                  >
                    <img className="img-fit-content" src={elm?.original!} />
                  </div>
                );
              })}
            </Slider>
            <Separator vertical={15} />
            <div>{loadingMap[LOADING_UPLOADING_PRODUCT] && <CardsSkeleton cardsCount={1} colSpan={{ xl: 24 }} />}</div>
          </Col>
          <Col xl={8} lg={8} md={24} sm={24} xs={24}>
            {stockRecord && (
              <ProductDetailsSection
                id={url.product}
                attributes={attributes}
                quantity={quantity}
                onSelectQuantity={onSelectQuantity}
                selectedAttribute={selectedAttribute}
                onSelectAttribute={onSelectAttribute}
                reviewRate={stockRecord.reviews_total}
              />
            )}
            <div>{loadingMap[LOADING_UPLOADING_PRODUCT] && <CardsSkeleton cardsCount={1} colSpan={{ xl: 24 }} />}</div>
          </Col>
        </Row>
        <Row gutter={24} className="product-tabs">
          <Col span={24}>
            <ProductTabs stockRecord={stockRecord!} selectedAttributes={selectedAttribute} />
            <Separator vertical={15} />
          </Col>
        </Row>
        {/* <Divider type="horizontal" /> */}

        <div className="product-sliders">
          {stockRecord?.product?.slug && (
            <ProductSliders paginationProps={{ resourceId: stockRecord?.product?.slug }} />
          )}
        </div>

        {stockRecord && (
          <Row justify="start" align="middle">
            <Col span={24}>
              <Reviews stockRecord={stockRecord} />
            </Col>
          </Row>
        )}
      </div>
    </Container>
  );
};

export default withFeature(ECOMMERCE_FEATURE)(ProductDetails);
