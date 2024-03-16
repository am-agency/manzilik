import React, { useEffect, useState } from 'react';
import { Button, Rate, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../app/providers/main';
import { EDIT_REVIEW, REVIEW, REVIEWS, SEND, WRITE_REVIEW } from '../../locales/strings';
import { ReviewList } from '../../pages/professionals/components/reviews_list';
import { getFloatRoundUp } from '../../pages/professionals/utils';
import Separator from '../separator';
import { Professional, Review, ReviewInput } from '../../API';
import {
  editProfessionalReview,
  getMyReviewForProfessional,
  listReviews,
  reviewProfessional,
} from '../../pages/professionals/api';
import { useModal } from '../../app/providers/modal';
import ReviewProfessional from '../../pages/professionals/review_professional';
import { listLimit as limit } from '../../app/settings';

interface Props {
  professional?: Professional;
  userId: string;
  is_reviewable: boolean;
  reviews_total: number;
  reviews_count: number;
  updateUser: Function;
  isPartner?: boolean;
}
export const ReviewsList = ({
  userId,
  is_reviewable,
  reviews_total,
  reviews_count,
  updateUser,
  isPartner = false,
}: Props) => {
  const { t } = useTranslation();
  const { userState } = useMainContext();

  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [myReview, setMyReview] = useState<Review>();

  const { requestApi } = useMainContext();
  const { showModal, setModalVisible } = useModal();

  const getProfessionalReviews = (refresh = false) => {
    const currentOffset = refresh ? 0 : offset;
    requestApi(
      listReviews,
      { resourceId: userId, offset: currentOffset, limit },
      (response: { results: Review[]; count: number }, error: string) => {
        const { results, count } = response;
        if (error) {
          return;
        }
        if (refresh && results.length !== 0) {
          setReviewsList(results);
        } else {
          setReviewsList((prevReviews) => [...prevReviews, ...results]);
        }
        setOffset(currentOffset + limit);
        setTotal(count);
      }
    );
  };

  const getMyReviewForCurrentProfessional = () => {
    requestApi(getMyReviewForProfessional, { resourceId: userId }, (review: Review, err: string) => {
      if (err) {
        return;
      }
      setMyReview(review);
    });
  };

  const updateReviewList = (response: Review, action: string) => {
    updateUser();
    setModalVisible?.(false);
    setMyReview(response);
    if (action == 'add') {
      setReviewsList((updatedList) => [...updatedList, response]);
    } else {
      const updatedList = reviewsList.map((elm) => {
        if (elm.id == response.id) {
          return response;
        }
        return elm;
      });
      setReviewsList(updatedList);
    }
  };

  const onAddReview = (values: ReviewInput) => {
    requestApi(reviewProfessional, { ...values, resourceId: userId }, (response: Review, err: string) => {
      if (err) {
        return;
      }
      updateReviewList(response, 'add');
    });
  };

  const onEditReview = (values: ReviewInput) => {
    requestApi(
      editProfessionalReview,
      { ...values, resourceId: userId, id: myReview?.id },
      (response: Review, err: string) => {
        if (err) {
          return;
        }
        updateReviewList(response, 'edit');
      }
    );
  };

  const reviewProf = () => {
    if (is_reviewable) {
      showModal(
        t(EDIT_REVIEW),
        <ReviewProfessional onFinish={onEditReview} review={myReview} userId={userId} isPartner={isPartner} />,
        'modal-wrapper review-professional',
        t(SEND)
      );
      return;
    }
    // not editable mode
    showModal(
      t(WRITE_REVIEW),
      <ReviewProfessional onFinish={onAddReview} userId={userId} isPartner={isPartner} />,
      'modal-wrapper review-professional',
      t(SEND)
    );
  };

  const onLoadMore = () => {
    getProfessionalReviews();
  };

  const initReview = () => {
    if (is_reviewable) {
      getMyReviewForCurrentProfessional();
    }
    if (userId) {
      getProfessionalReviews(true);
    }
  };

  useEffect(() => {
    initReview();
  }, [userId]);

  return (
    <div className="custom-reviews-list">
      <Row justify="space-between" align="middle">
        <div className="review-label">{t(REVIEWS)}</div>

        {userState.client?.id !== userId && (
          <Button onClick={reviewProf} type="primary" className="add-review-btn">
            {is_reviewable ? t(EDIT_REVIEW) : t(WRITE_REVIEW)}
          </Button>
        )}
      </Row>
      {Boolean(reviews_count) && (
        <>
          <Separator vertical={16} />
          <div className="count-wrapper">
            <Row justify="space-between" align="middle" className="review-count-container">
              <Row justify="center" align="middle">
                <Typography.Title className="total-wrapper">
                  {getFloatRoundUp(reviews_total!) || '0.0'}
                </Typography.Title>
                <Separator horizontal={5} />
                <Rate disabled value={reviews_total!} allowHalf />
              </Row>
              <Typography.Text>
                <span className="total-wrapper">{reviews_count! || 0}</span>
                <span className="review-text">{t(REVIEW)}</span>
              </Typography.Text>
            </Row>
          </div>
        </>
      )}
      <Separator vertical={15} />

      <ReviewList reviewsList={reviewsList} onLoadMore={onLoadMore} total={total} />
    </div>
  );
};
