import React, { FunctionComponent } from 'react';
import { Col, Progress, Rate, Row } from 'antd';
import { StarFilled } from '@ant-design/icons/lib';
import { useTranslation } from 'react-i18next';
import { REVIEW } from '../../../../../locales/strings';
import { StockRecordReviewsAggregationResult } from '../../../../../API';

interface Props {
  rate: number;
  reviewsCount: number;
  ratesAggregation: StockRecordReviewsAggregationResult['rates_aggregation'];
}

export const ReviewStatistics: FunctionComponent<Props> = ({ rate, reviewsCount, ratesAggregation }) => {
  const { t } = useTranslation();

  return (
    <Row justify="start" align="middle" className="progress-bar-section" gutter={[16, 16]}>
      <Col xl={6} lg={6} md={12} sm={24} xs={24}>
        {ratesAggregation?.length &&
          ratesAggregation
            .filter((rateAggregation) => rateAggregation?.rate !== 0)
            .reverse()
            .map((rateAggregation) => (
              <div className="progress-with-star" key={rateAggregation?.rate}>
                <span>{rateAggregation?.rate}</span>
                <StarFilled />
                <Progress
                  strokeWidth={(rateAggregation?.count || 0) * 100}
                  percent={((rateAggregation?.count || 0) * 100) / reviewsCount}
                />
              </div>
            ))}
      </Col>
      <Col xl={4} lg={4} md={12} sm={24} xs={24}>
        <div className="total-rating">
          <span className="rating-number">
            {reviewsCount} {t(REVIEW)}
          </span>
          <span className="rating-result">{rate}</span>
          <Rate allowHalf disabled defaultValue={rate} />
        </div>
      </Col>
    </Row>
  );
};
