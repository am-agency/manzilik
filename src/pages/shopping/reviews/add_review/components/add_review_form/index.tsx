import React, { FunctionComponent, useEffect, useState } from 'react';
import { Form, Button, Col, Typography, Rate, Row, Input, message } from 'antd';

//hooks
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

//strings
import {
  ADD_YOUR_COMMENT_HERE,
  ADD_PRODUCT_COMMENT,
  ADD_PRODUCT_IMAGES,
  PRODUCT_MATCHES_DESCRIPTION,
  PRODUCT_QUALITY,
  REASONABLE_PRICE,
  SEND,
  SHIPPING_SPEED,
  TRANSFER_YOUR_EXPERIENCE_OF_USING_THE_PRODUCT,
  WHAT_IS_YOUR_REVIEW_FOR_PRODUCT,
  REVIEWED_PRODUCT_SUCCESSFULLY,
  UPLOADED_IMAGES_SUCCESSFULLY,
  GENERAL_REVIEW_MANDATORY,
} from '../../../../../../locales/strings';

import Separator from '../../../../../../components/separator';
import { FileUploader } from '../../../../../project/upload_idea/file_uploader';
import { productsIcons } from '../../../../../../assets/icons/prodcuts';
import { useMainContext } from '../../../../../../app/providers/main';
import { addProductReview, listDetailedScore, listProductReviews, updateProductReview } from '../../../api';
import {
  DetailedReviewScore,
  DetailedScore,
  ListProductReviewsByStockRecordIdQuery,
  ProductReview,
  ProductReviewList,
} from '../../../../../../API';
import { UploadFile } from 'antd/lib/upload/interface';
import { uploadAsset } from '../../../../../../utils/assets_manager';
import { MakhzanDestination } from '../../../../../project/upload_idea';

interface Params {
  stockRecordId: string;
  reviewId: string;
}

export const AddReviewForm: FunctionComponent = () => {
  const { stockRecordId, reviewId } = useParams<Params>();
  const history = useHistory();
  const { requestApi, userState } = useMainContext();
  const { t } = useTranslation();
  // TODO: fix this types issue once an update is made in the backend
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detailedScores, setDetailedScores] = useState<any[]>();
  const [reviewRate, setReviewRate] = useState(0);
  const [comments, setComments] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  useEffect(() => {
    if (!reviewId) {
      requestApi(listDetailedScore, {}, (response: DetailedScore[], error: Error) => {
        if (error) {
          return;
        }
        setDetailedScores(response);
      });
    }

    if (reviewId) {
      requestApi(
        listProductReviews,
        { resourceId: stockRecordId, limit: 1 },
        (response: ProductReviewList, error: Error) => {
          if (error) {
            return;
          }
          if (response.results.length) {
            const firstReview = response.results[0];
            if (firstReview?.client?.id === userState.client?.id) {
              setReviewRate(firstReview?.general_score || 0);
              setComments(firstReview?.body || '');
              const detailedScoreMap = firstReview?.detailed_review_scores?.map((val) => ({
                ...val,
                id: val?.detailed_score?.id,
              }));
              setDetailedScores(detailedScoreMap);
              // TODO: fix this typing issue of null in images array
              //@ts-ignore
              setReviewImages(firstReview?.review_images.map((val) => val?.image) || []);
            }
          }
        }
      );
    }
  }, []);

  const handleSendReview = () => {
    if (!reviewRate) {
      message.error(t(GENERAL_REVIEW_MANDATORY));
      return;
    }
    if (reviewId) {
      requestApi(
        updateProductReview,
        {
          id: reviewId,
          resourceId: stockRecordId,
          stockrecord: stockRecordId,
          body: comments,
          general_score: reviewRate,
          detailed_review_scores: detailedScores?.map(({ id, score }) => ({ detailed_score: id, score: score || 0 })),
          review_images: reviewImages,
        },
        (response: ProductReview, error: Error) => {
          if (error) {
            return;
          }
          message.success(t(REVIEWED_PRODUCT_SUCCESSFULLY));
          history.goBack();
        }
      );
    } else {
      requestApi(
        addProductReview,
        {
          resourceId: stockRecordId,
          stockrecord: stockRecordId,
          body: comments,
          general_score: reviewRate,
          detailed_review_scores: detailedScores?.map(({ id, score }) => ({ detailed_score: id, score: score || 0 })),
          review_images: reviewImages,
        },
        (response: ProductReview, error: Error) => {
          if (error) {
            return;
          }
          message.success(t(REVIEWED_PRODUCT_SUCCESSFULLY));
          history.goBack();
        }
      );
    }
  };

  const handleDetailedScoreChange = (id: string, score: number) => {
    const updatedDetailedScores = detailedScores?.map((currentDetailedScore) => {
      if (currentDetailedScore.id === id) {
        currentDetailedScore.score = score;
        return currentDetailedScore;
      } else {
        return currentDetailedScore;
      }
    });

    setDetailedScores(updatedDetailedScores);
  };

  const UploadButton = (
    <div>
      <img src={productsIcons.upload.icon} />
    </div>
  );

  const onImagesLocalLoadingFinish = (fileList: UploadFile[]) => {
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index];
      requestApi(
        uploadAsset,
        {
          file: file.originFileObj,
          file_name: `${index}-${file.uid}`,
          content_type: file.type,
          destination: MakhzanDestination.REVIEWS,
        },
        async (url: string, error: string) => {
          if (!error) {
            setReviewImages((prevState) => [...prevState, url]);
            message.success(t(UPLOADED_IMAGES_SUCCESSFULLY));
          }
        }
      );
    }
  };

  return (
    <div className="review-product-form">
      <Row align="middle" gutter={[8, 8]}>
        <Col lg={16} xl={16} md={16} sm={24} xs={24}>
          <div className="general-review">
            <Typography.Text>{t(WHAT_IS_YOUR_REVIEW_FOR_PRODUCT)}</Typography.Text>
            <Separator vertical={4} />
            <Rate onChange={setReviewRate} value={reviewRate} />
          </div>
          <Separator vertical={16} />
        </Col>
      </Row>
      <Row align="middle" justify="start">
        <Col span={24}>
          <div className="general-review">
            <Typography.Text>{t(TRANSFER_YOUR_EXPERIENCE_OF_USING_THE_PRODUCT)}</Typography.Text>
            <Separator vertical={8} />
          </div>
        </Col>
        <Col span={24}>
          <Row align="bottom" gutter={24}>
            {detailedScores?.length &&
              detailedScores.map(({ id, title, score }) => (
                <Col xl={6} lg={6} md={12} sm={12} xs={12} className="custom-review" key={id}>
                  <Row>
                    <Col span={24}>
                      <Typography.Text>{title}</Typography.Text>
                    </Col>
                    <Col span={24}>
                      <Rate value={score || 0} onChange={(score) => handleDetailedScoreChange(id, score)} />
                    </Col>
                  </Row>
                </Col>
              ))}
          </Row>
          <Separator vertical={20} />
          <Row align="bottom" justify="end" gutter={[0, 24]}>
            {/* TODO: build upload images components specific for the add review form page  */}
            {/* {!reviewId ? (
              <Col span={24}>
                <Typography.Text className="text">{t(ADD_PRODUCT_IMAGES)}</Typography.Text>
                <Separator vertical={9} />
                <FileUploader
                  type="picker"
                  customUploadButton={UploadButton}
                  fileLength={5}
                  onFinish={onImagesLocalLoadingFinish}
                />
                <Separator vertical={20} />
              </Col>
            ) : null} */}
            <Col span={24}>
              <Typography.Text className="text">{t(ADD_PRODUCT_COMMENT)}</Typography.Text>
              <Separator vertical={9} />
              <Input.TextArea
                placeholder={t(ADD_YOUR_COMMENT_HERE)}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Col>
            <Col span={4}>
              <Button type="primary" className="custom-antd-btn" block onClick={handleSendReview}>
                {t(SEND)}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
