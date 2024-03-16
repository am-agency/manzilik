import { Card, Tooltip } from 'antd';
import React from 'react';
import Separator from '../../../../components/separator';
import { StockRecord } from '../../../../API';
import { textSubstring } from '../../../../utils';
import { useHistory } from 'react-router-dom';
import * as analytics from '../../../../analytics';

interface RelatedProductCardProps {
  length?: number;
  index?: number;
  item: StockRecord;
}

const RelatedProductCard = (props: RelatedProductCardProps) => {
  const { length, index, item } = props;
  const history = useHistory();

  const redirectToProductDetail = () => {
    history.push(`/product/${item?.id}`);
    analytics.PublishEvent(new analytics.AnalyticsSelectItem('shopping'));
  };
  return (
    <>
      <div className="related-product-wrapper" onClick={redirectToProductDetail}>
        <Card cover={<img className="img-fit-content" src={item?.product?.photo_url!} />}>
          <Tooltip placement="top" title={item?.product?.title!}>
            <Card.Meta title={textSubstring(item?.product?.title!, 15)} />
          </Tooltip>
          <div className="price-container">
            <div className="price-contain">
              <span className="price-before">{item?.original_price}</span>
              <span className="current-price">{item?.price!}</span>
              <span className="currency">{`(${item?.currency})`}</span>
            </div>
          </div>
        </Card>
      </div>
      {length !== index! + 1 && <Separator horizontal={10} />}
    </>
  );
};

export default RelatedProductCard;
