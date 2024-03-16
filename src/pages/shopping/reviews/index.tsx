import React, { FunctionComponent, useEffect, useState } from 'react';
import { CUSTOMER_REVIEWS, EDIT_PRODUCT_REVIEW, REVIEW_THIS_PRODUCT } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import Separator from '../../../components/separator';
import { ReviewStatistics } from './components/review_statistic';
import { NoReviews } from './components/no_reviews';
import { ReviewComment } from './components/review_comment';
import { ReviewFilter } from './components/review_filter';
import { productReviewMock } from './mock/product_review';
import {
  ListProductReviewsByStockRecordIdQuery,
  ProductReview,
  ProductReviewList,
  StockRecord,
  StockRecordReviewsAggregationObject,
  StockRecordReviewsAggregationResult,
} from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { Button, Col, Row } from 'antd';
import { useHistory } from 'react-router';
import { GuestUserModal } from '../../../components/guest_user_modal';
import { ADD_REVIEW } from '../../../utils/routes';
import { listProductReviews, list_stockrecord_reviews_aggregation } from './api';

interface Props {
  stockRecord: StockRecord;
}

export const Reviews: FunctionComponent<Props> = ({ stockRecord }) => {
  const history = useHistory();
  const { i18n, t } = useTranslation();
  const { userState } = useMainContext();
  const [reviews, setReviews] = useState<Array<ProductReview | null>>();
  const [userReview, setUserReview] = useState<ProductReview | null>();
  const [ratesAggregation, setRatesAggregation] = useState<StockRecordReviewsAggregationResult['rates_aggregation']>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { requestApi } = useMainContext();

  useEffect(() => {
    (async () => {
      requestApi(listProductReviews, { resourceId: stockRecord.id }, (response: ProductReviewList, error: Error) => {
        if (error) {
          return;
        }
        setReviews(response.results);
      });

      requestApi(
        list_stockrecord_reviews_aggregation,
        { resourceId: stockRecord.id },
        (response: StockRecordReviewsAggregationResult, error: Error) => {
          if (error) {
            return;
          }
          setRatesAggregation(response.rates_aggregation);
        }
      );

      requestApi(
        listProductReviews,
        { resourceId: stockRecord.id, limit: 1 },
        (response: ProductReviewList, error: Error) => {
          if (error) {
            return;
          }
          if (response.results.length) {
            const firstReview = response.results[0];
            if (firstReview?.client?.id === userState.client?.id) {
              setUserReview(firstReview);
            }
          }
        }
      );
    })();
  }, []);

  const onAddReview = () => {
    if (!userState.isAuthenticated) {
      setIsModalVisible(true);
    } else if (!!userReview) {
      history.push(`/${stockRecord.id}/add-review/${userReview.id}`);
    } else {
      history.push(`/${stockRecord.id}/add-review`);
    }
  };

  if (!reviews?.length && !stockRecord.is_purchased) {
    return null;
  }

  return (
    <Row align="middle" className="reviews-section">
      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
        <h4>{t(CUSTOMER_REVIEWS)}</h4>
      </Col>
      {stockRecord.is_purchased ? (
        <Col xs={24} sm={12} md={12} lg={12} xl={12} className="review-product-btn">
          <Button className="custom-antd-btn" onClick={onAddReview}>
            {!!userReview ? t(EDIT_PRODUCT_REVIEW) : t(REVIEW_THIS_PRODUCT)}
          </Button>
        </Col>
      ) : null}
      <Col span={24}>
        <Separator vertical={24} />
        {!reviews?.length ? (
          <NoReviews onAddReview={onAddReview} />
        ) : (
          <>
            <ReviewStatistics
              rate={stockRecord.reviews_total!}
              reviewsCount={stockRecord.reviews_count!}
              ratesAggregation={ratesAggregation}
            />
            <Separator vertical={16} />
            <ReviewFilter />
            <Separator vertical={4} />
            <ReviewComment reviews={reviews!} />
          </>
        )}
      </Col>
      <GuestUserModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
    </Row>
  );
};
