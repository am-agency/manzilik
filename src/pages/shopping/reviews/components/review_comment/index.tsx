import React, { FunctionComponent } from 'react';
import { Comment, Image, Avatar, Col, Row, Typography, Tag, Rate, Button, List } from 'antd';
import { productsIcons } from '../../../../../assets/icons/prodcuts';
import Separator from '../../../../../components/separator';
import { HeartOutlined } from '@ant-design/icons/lib';
import { useTranslation } from 'react-i18next';
import { ProductReview } from '../../../../../API';
import {
  BOUGHT_THIS_PRODUCT,
  COMMENT_LIKE,
  DID_THIS_COMMENT_HELP_YOU,
  PREVIEW,
  THERE_ARE_NO_DATA,
} from '../../../../../locales/strings';
import { getLayoutDirection } from '../../../../../app/layouts';
import { CustomPagination, PaginationType } from '../../../../../components/pagination_item';
import { getTimeFormatBasedOnLanguage } from '../../../../idea/utils';
import { getUserName } from '../../../../../utils';

interface Props {
  reviews: Array<ProductReview | null>;
}
export const ReviewComment: FunctionComponent<Props> = ({ reviews }: Props) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="comments-list-section">
      <List
        pagination={{
          showTitle: false,
          pageSize: 5,
          className: `pagination ${getLayoutDirection(i18n.language)}`,
          hideOnSinglePage: true,
          itemRender: (page: number, type: PaginationType) => CustomPagination(page, type, t),
        }}
        dataSource={reviews}
        locale={{ emptyText: t(THERE_ARE_NO_DATA) }}
        renderItem={(review, index) => (
          <List.Item key={index}>
            <Comment
              author={
                <div>
                  <div className="author-name">
                    <Typography.Text>{getUserName(review?.client)}</Typography.Text>
                    <Tag>
                      <img src={productsIcons.check.icon} alt="check" />
                      <span>{t(BOUGHT_THIS_PRODUCT)}</span>
                    </Tag>
                  </div>
                  <Separator vertical={4} />
                  <div className="comment-date-rate">
                    <Typography.Text>{getTimeFormatBasedOnLanguage(review?.created_at!)}</Typography.Text>
                    <Rate defaultValue={review?.general_score || 5} disabled />
                  </div>
                </div>
              }
              avatar={<Avatar size={50} src={review?.client?.profile_image} alt="avatar" className="comment-avatar" />}
              content={
                <div className="comment-content">
                  <Separator vertical={8} />
                  <Row justify="start" gutter={[8, 8]}>
                    <Col span={24}>
                      <Typography.Text>{review?.body}</Typography.Text>
                      <Separator vertical={8} />
                    </Col>
                    {review?.review_images?.map((image, index) => (
                      <Col xl={4} lg={4} md={4} sm={6} xs={12} key={index}>
                        <Image preview={{ mask: t(PREVIEW) }} className="img-fit-content" src={image?.image!} />
                      </Col>
                    ))}
                  </Row>
                  <Separator vertical={12} />
                  {/* Disabling this functionality for now to discuss the Backend soon */}
                  {/* <Row justify="start" className="product-footer">
                    <Col>
                      <Typography.Text>{t(DID_THIS_COMMENT_HELP_YOU)}</Typography.Text>
                    </Col>
                    <Col>
                      <Button icon={<HeartOutlined />}>{t(COMMENT_LIKE)}</Button>
                    </Col>
                  </Row> */}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};
