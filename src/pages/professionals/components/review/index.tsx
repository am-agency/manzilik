import { Rate, Row, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Separator from '../../../../components/separator';
import { REVIEW } from '../../../../locales/strings';
import { getFloatRoundUp } from '../../utils';

interface Props {
  reviews_count?: number;
  reviews_total?: number;
  showNumbers?: boolean;
}

export const Review = ({ reviews_total, reviews_count, showNumbers = true }: Props) => {
  const { t } = useTranslation();

  return (
    <Row className="review-section" align="middle">
      {showNumbers && (
        <>
          <Typography.Text className="total-review">{getFloatRoundUp(reviews_total!)}</Typography.Text>{' '}
          <Separator horizontal={6} />
        </>
      )}
      <Rate disabled value={reviews_total || 0} allowHalf />
      <Separator horizontal={6} />
      {showNumbers && (
        <Typography.Text className="review-number">{t(REVIEW, { count: reviews_count })}</Typography.Text>
      )}
    </Row>
  );
};
