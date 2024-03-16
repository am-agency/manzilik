import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Col, Rate, Row, Tag, Typography } from 'antd';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { StockRecord } from '../../../../API';
import i18n from '../../../../app/i18n';
import { AR } from '../../../../locales/constants';
import { BY, DISCOUNT } from '../../../../locales/strings';
import { getFloatRoundUp } from '../../../professionals/utils';
import { StatusLabel } from './status_label';
import { ProductAttributes } from './product_attributes';
import { NOT_FOUND_ROUTE, PRODUCT_ROUTE, VENDOR_ROUTE } from '../../../../utils/routes';

interface Props {
  breadcrumbLevel?: number;
  stockRecord: StockRecord;
}

const ProductCard: FunctionComponent<Props> = ({ stockRecord }: Props) => {
  const product = stockRecord?.product!;
  const { t } = useTranslation();
  const history = useHistory();

  const productUrl = useMemo(() => {
    if (stockRecord.id) {
      const ref = stockRecord.product?.breadcrumbs?.map((product) => product?.slug).join('/');
      return PRODUCT_ROUTE.replace(':id', stockRecord.id) + `ref=${ref}`;
    } else {
      return NOT_FOUND_ROUTE;
    }
  }, [product?.breadcrumbs]);

  const onVendorClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    history.push(`${VENDOR_ROUTE}/${stockRecord?.partner?.id}`);
  };

  const title = useMemo(() => {
    return product.title;
  }, [product.title, i18n.language]);

  return (
    <Link to={productUrl}>
      <section className="product-card-container rounded-border ">
        <StatusLabel labels={product?.labels!} />
        <Row align="middle" justify="center" className="clickable">
          <LazyLoadImage className="product-photo" src={product?.photo_url!} />
        </Row>
        {stockRecord.discount_value && stockRecord.discount_value > 0 ? (
          <Tag className="custom-antd-tag">{t(DISCOUNT)}</Tag>
        ) : null}
        <ProductAttributes stockRecord={stockRecord} />
        <div className="details-wrapper">
          <Typography.Paragraph className="product-name clickable" ellipsis={{ rows: 1 }}>
            {title}
          </Typography.Paragraph>
          <div onClick={onVendorClick}>
            <Typography.Paragraph className="client-name-wrapper" ellipsis={{ rows: 1 }}>
              <Typography.Text className="by">{t(BY)} </Typography.Text>
              <Typography.Text className="client-name">{stockRecord?.partner?.name}</Typography.Text>
            </Typography.Paragraph>
          </div>
          <span className="rate">
            <Rate value={stockRecord?.reviews_total!} disabled allowHalf />
            <span className="rate-number">{`(${getFloatRoundUp(stockRecord?.reviews_total!)})`}</span>
          </span>
          <Row
            style={{
              display: 'flex',
              justifyContent: i18n.language === AR ? 'flex-start' : 'unset',
              gap: '5px',
              alignItems: 'center',
            }}
          >
            {stockRecord?.discount_value && stockRecord?.discount_value > 0 ? (
              <Typography.Text
                style={{
                  textDecoration: 'line-through',
                }}
              >
                {stockRecord?.original_price}
              </Typography.Text>
            ) : null}
            <Typography.Text className="price">
              {`${stockRecord?.price}
              ${stockRecord?.currency}`}
            </Typography.Text>
            <Col span={12}>
              {product?.labels && (
                <>
                  {product.labels.map((ext, index) => (
                    <Typography.Text className="extra link clickable" key={index}>
                      {ext?.is_extra && ext?.title!}
                    </Typography.Text>
                  ))}
                </>
              )}
            </Col>
          </Row>
        </div>
      </section>
    </Link>
  );
};

export default ProductCard;
