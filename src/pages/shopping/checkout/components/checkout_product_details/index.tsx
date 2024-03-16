import React, { FunctionComponent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row, Typography, Steps, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { breadcrumb, Product, StockRecord } from '../../../../../API';
import { COLOR, SIZE_OR_WEIGHT } from '../../../../../locales/strings';
import { useMainContext } from '../../../../../app/providers/main';
import { getStockRecord } from '../../../product_details/api';

interface Props {
  product: Product;
  grayImage?: boolean;
  stockRecordId?: string | null | undefined;
}

export const CheckoutProductDetails: FunctionComponent<Props> = ({ product, grayImage, stockRecordId }: Props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const [breadcrumb, setBreadcrumb] = useState<(breadcrumb | null)[] | null | undefined>();
  useEffect(() => {
    (async () => {
      requestApi(getStockRecord, { id: stockRecordId }, (response: StockRecord, error: string) => {
        if (error) {
          return;
        }
        setBreadcrumb(response.product?.breadcrumbs);
      });
    })();
  }, []);

  const onLinkClick = () => {
    if (breadcrumb?.length) {
      history.push(
        `/products/${breadcrumb[0]?.slug}/${breadcrumb[1]?.slug}/${breadcrumb[2]?.slug}/${breadcrumb[3]?.slug}/${stockRecordId}`
      );
    }
  };

  return (
    <Row
      gutter={[0, 10]}
      className="checkout-product-details"
      role="button"
      onClick={onLinkClick}
      style={{ cursor: 'pointer' }}
      align="middle"
    >
      <Col className="img-wrapper">
        <img src={product?.photo_url!} className={`img-fit-content ${grayImage && 'grayed-img'}`} />
      </Col>
      <Col className="product-details">
        <h5>{product?.title}</h5>
        <Row>
          <Typography.Text className="extra-att-label">{t(COLOR)}</Typography.Text>
          <Typography.Text className="extra-att">{product?.color!}</Typography.Text>
          &nbsp;&nbsp;
          <Typography.Text className="extra-att-label">{t(SIZE_OR_WEIGHT)}</Typography.Text>
          <Typography.Text className="extra-att">{product?.dimensions!}</Typography.Text>
        </Row>
      </Col>
    </Row>
  );
};
