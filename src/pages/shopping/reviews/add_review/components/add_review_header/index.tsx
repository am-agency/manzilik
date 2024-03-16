import React, { FunctionComponent } from 'react';
import { Col, Divider, Row, Typography } from 'antd';

//hooks
import { useTranslation } from 'react-i18next';

//strings
import { REVIEW_PRODUCT } from '../../../../../../locales/strings';

//types
import { Product } from '../../../../../../API';

import Separator from '../../../../../../components/separator';
import Avatar from '../../../../../../components/avatar';

interface Props {
  product?: Product;
}
export const AddReviewHeader: FunctionComponent<Props> = ({ product }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="review-product-header">
      <h4>{t(REVIEW_PRODUCT)}</h4>
      <Separator vertical={4} />
      <Row justify="start" align="middle">
        <Col xl={2} lg={4} md={4} sm={4} xs={6}>
          <Avatar size={65} shape="square" className="avatar-lg" src={product?.photo_url} />
        </Col>
        <Col xl={22} lg={20} md={20} sm={20} xs={18}>
          <Typography.Text className="text">{product?.title}</Typography.Text>
        </Col>
        <Divider />
      </Row>
    </div>
  );
};
