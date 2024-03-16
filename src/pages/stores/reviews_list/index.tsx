import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Divider, List, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Review as ReviewType } from '../../../API';
import { MORE_REVIEWS, NO_REVIEWS, READ_MORE, SHOW } from '../../../locales/strings';
import { getClientProfile, getUserName } from '../../../utils';
import { Review } from '../../professionals/components/review';
import ReadMoreText from '../../../components/read_more_text';
import Separator from '../../../components/separator';
import { getTimeFormatBasedOnLanguage } from '../../idea/utils';
import { useMainContext } from '../../../app/providers/main';

interface Props {
  reviewsList: ReviewType[];
  onLoadMore: () => void;
  total: number;
}

export const ReviewList: FunctionComponent<Props> = ({ reviewsList, onLoadMore, total }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { userName } = useMainContext();

  const remainingReviewCount = total - reviewsList?.length!;
  const loadMore = total > reviewsList?.length! && (
    <div className="load-more" onClick={onLoadMore}>
      {t(SHOW)} {remainingReviewCount} {t(MORE_REVIEWS, { count: remainingReviewCount })}
    </div>
  );

  return (
    <List
      dataSource={reviewsList}
      bordered={false}
      split={false}
      loadMore={loadMore}
      size="small"
      itemLayout="vertical"
      className="prof-reviews-list"
      locale={{ emptyText: t(NO_REVIEWS) }}
      renderItem={(review, index: number) => {
        return (
          <>
            <List.Item key={index} className="comment">
              <List.Item.Meta
                avatar={<Avatar src={review.client?.profile_image} />}
                title={
                  <span className="user-name" onClick={() => getClientProfile(history, review?.client!)}>
                    {userName}
                  </span>
                }
                description={<Review reviews_total={review.rating!} showNumbers={false} />}
              />
              <ReadMoreText text={review?.content!} actionText={t(READ_MORE)} />
              <Separator vertical={7} />
              <Typography.Text className="review-date">
                {getTimeFormatBasedOnLanguage(review.updated_at!)}
              </Typography.Text>
            </List.Item>
            <Divider />
          </>
        );
      }}
    />
  );
};
