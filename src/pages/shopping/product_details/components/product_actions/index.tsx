import React from 'react';
import { message, Row } from 'antd';
import i18n from '../../../../../app/i18n';
import { getLayoutDirection } from '../../../../../app/layouts';
import { productsIcons } from '../../../../../assets/icons/products';
import { PRODUCTS_MAIN_ROUTE } from '../../../../../utils/routes';
import { ProductsParams } from '../../../../../components/bread_crumbs_header';
const { REACT_APP_BASE_URL } = process.env;
import * as analytics from '../../../../../analytics';

interface Props {
  url: ProductsParams;
}
export const ProductActions = ({ url }: Props) => {
  const { primary, secondary, tertiary, product, id } = url;
  const pathname = `${PRODUCTS_MAIN_ROUTE}/${primary}/${secondary}/${tertiary}/${product}/${id}`;

  const onShareProduct = () => {
    analytics.PublishEvent(new analytics.AnalyticsShareItemEvent('product'));
    navigator.clipboard.writeText(REACT_APP_BASE_URL + pathname);
    message.success({
      content: REACT_APP_BASE_URL + pathname,
      className: 'product_actions_share-message-wrapper',
    });
  };

  return (
    <Row className={`product-actions ${getLayoutDirection(i18n.language)}`}>
      {/* will hide it for now
       <img src={productsIcons.save.icon} />
      <Separator vertical={10} /> */}
      <img src={productsIcons.share.icon} onClick={onShareProduct} />
    </Row>
  );
};
