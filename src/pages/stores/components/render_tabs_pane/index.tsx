import React from 'react';
import { Button, Divider, Rate, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Brand, Review } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import { MetaTags } from '../../../../components/meta_tags';
import ReadMoreText from '../../../../components/read_more_text';
import Separator from '../../../../components/separator';
import { getFloatRoundUp } from '../../../professionals/utils';
import { ReviewList } from '../../reviews_list';
import { EDIT_REVIEW, READ_MORE, REVIEW, REVIEWS, WRITE_REVIEW } from '../../../../locales/strings';
import GalleryPhotos from '../gallery_photos';
import { AR } from '../../../../locales/constants';

interface Props {
  id: string;
  brand: Brand;
  onLoadMore: () => void;
  reviewsList: Review[];
  total: number;
  reviewProf: () => void;
}

export const RenderTabsPane = ({ id, brand, reviewsList, onLoadMore, total, reviewProf }: Props) => {
  const { t, i18n } = useTranslation();
  const { userState } = useMainContext();
  const havePhotos = id && brand?.images?.count! > 0;
  const haveReviews = id && brand?.rates_count! > 0;
  const canReview =
    reviewsList.findIndex((review) => {
      return review?.client?.id === userState?.client?.id;
    }) >= 0;

  return (
    <>
      <MetaTags title={brand?.title!} description={brand?.description!} />

      <div id="about-me">
        {brand && (
          <div className="about-me-wrapper">
            <ReadMoreText
              text={i18n.language == AR ? brand.arabic_description! : brand?.english_description!}
              actionText={t(READ_MORE)}
            />
            <Separator vertical={10} />
            <Divider />
          </div>
        )}
      </div>

      {havePhotos && ( //list={brand.images.results} total={brand.images.count}
        <>
          <GalleryPhotos paginationProps={{ resourceId: id }} queryParams={{ id }} />
          <Divider type="horizontal" />
        </>
      )}

      <div id="comments">
        <Row justify="space-between" align="middle">
          <div className="review-label">{t(REVIEWS)}</div>
          <Button onClick={reviewProf} type="primary" className="add-review-btn">
            {canReview ? t(EDIT_REVIEW) : t(WRITE_REVIEW)}
          </Button>
        </Row>
        {haveReviews && (
          <>
            <Separator vertical={16} />
            <div className="count-wrapper">
              <Row justify="space-between" align="middle" className="review-count-container">
                <Row justify="center" align="middle">
                  <Typography.Title className="total-wrapper">
                    {getFloatRoundUp(brand?.rate!) || '0.0'}
                  </Typography.Title>
                  <Separator horizontal={5} />
                  <Rate disabled value={brand?.rate!} allowHalf />
                </Row>
                <Typography.Text>
                  <span className="total-wrapper">{brand?.rates_count!}</span>
                  <span className="review-text">{t(REVIEW)}</span>
                </Typography.Text>
              </Row>
            </div>
          </>
        )}
        <Separator vertical={15} />
        {brand && <ReviewList reviewsList={reviewsList} onLoadMore={onLoadMore} total={total} />}
      </div>
    </>
  );
};
