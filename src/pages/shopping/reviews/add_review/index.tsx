import React, { FunctionComponent, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { useParams } from 'react-router-dom';
//hooks
import { useTranslation } from 'react-i18next';

//strings
import { AR } from '../../../../locales/constants';
import { productArabic, productEnglish } from '../../product_details/mock/product';

//types
import { Product, StockRecord } from '../../../../API';

//components
import { AddReviewHeader } from './components/add_review_header';
import { Container } from '../../../../components/container';
import Separator from '../../../../components/separator';
import { AddReviewForm } from './components/add_review_form';

import { withUserAuthenticator } from '../../../../app/providers/user/with_user_authenticator';
import { ECOMMERCE_FEATURE } from '../../../../app/settings';
import { withFeature } from 'flagged';
import { useMainContext } from '../../../../app/providers/main';
import { getStockRecord } from '../../product_details/api';

interface Params {
  stockRecordId: string;
}

export const AddReview: FunctionComponent = () => {
  const { i18n } = useTranslation();
  const { requestApi } = useMainContext();
  const { stockRecordId } = useParams<Params>();
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    if (stockRecordId) {
      requestApi(getStockRecord, { id: stockRecordId }, (response: StockRecord, error: string) => {
        if (error) {
          return;
        }
        if (response.product) {
          setProduct(response.product);
        }
      });
    }
  }, []);

  return (
    <Container>
      <div className="review-product-page">
        <Separator vertical={8} />
        <Row>
          <Col span={24}>
            <AddReviewHeader product={product} />
          </Col>
        </Row>
        <Row align="middle" gutter={[8, 8]}>
          <Col lg={16} xl={16} md={16} sm={24} xs={24}>
            <AddReviewForm />
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default withFeature(ECOMMERCE_FEATURE)(withUserAuthenticator(AddReview));
