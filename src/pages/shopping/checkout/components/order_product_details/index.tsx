import React, { FunctionComponent, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, Row, Typography, Steps, Space, Modal, Alert, Checkbox, Input, Image, Rate } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  InputRefundOrderLine,
  Order,
  OrderLine,
  ProductReview,
  ProductReviewList,
  RefundReason,
  RefundReasons,
  ResultOutput,
} from '../../../../../API';
import {
  DELIVERED,
  NEW,
  TRACK_THE_ORDER,
  PREPARE_THE_ORDER,
  ORDER_STATUS,
  CANCEL_PRODUCT,
  CONFIRM_CANCEL_PRODUCT,
  REFUND_REQUEST_DESC,
  REFUND_REQUEST_NOTE,
  REFUND_REQUEST_SUCCESS,
  REFUND_REQUEST_SUCCESS_NOTE,
  CANCELED,
  CANCEL,
  OK,
  REVIEW_THIS_PRODUCT,
  EDIT_PRODUCT_REVIEW,
} from '../../../../../locales/strings';
import { profileIcons } from '../../../../../assets/icons/profile';
import { CheckoutProductDetails } from '../checkout_product_details';
import { useMainContext } from '../../../../../app/providers/main';
import { getListOfRefundReasons, refundOrderLine } from '../../api';
import RefundSuccessIcon from '../../../../../assets/icons/refund.svg';
import HashIcon from '../../../../../assets/icons/HashIcon';
import { listProductReviews } from '../../../reviews/api';
import { EditOutlined } from '@ant-design/icons';

interface Props {
  orderLine: OrderLine;
  orderNumber: Order['number'];
}

const { Step } = Steps;
const { TextArea } = Input;

export enum OrderLineStatuses {
  NEW = 'NEW',
  UNDER_PROCESSING = 'UNDER PROCESSING',
  DELIVERED = 'DELIVERED',
}

const getCurrentTrackingStep = (status: string) => {
  switch (status) {
    case OrderLineStatuses.NEW:
      return 0;
    case OrderLineStatuses.UNDER_PROCESSING:
      return 1;
    case OrderLineStatuses.DELIVERED:
      return 2;
    default:
      return 0;
  }
};

const getCurrentOrderStatusTitle = (status: string | undefined) => {
  switch (status) {
    case OrderLineStatuses.NEW:
      return NEW;
    case OrderLineStatuses.UNDER_PROCESSING:
      return PREPARE_THE_ORDER;
    case OrderLineStatuses.DELIVERED:
      return DELIVERED;
    default:
      return NEW;
  }
};

export const OrderProductDetails: FunctionComponent<Props> = ({ orderLine, orderNumber }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { requestApi, userState } = useMainContext();
  const [orderLineStatus, setOrderLineStatus] = useState(orderLine.status);
  const [showProductTracking, setShowProductTracking] = useState(false);
  const [showCancelProductModal, setShowCancelProductModal] = useState(false);
  const [showRefundSuccessModal, setShowRefundSuccessModal] = useState(false);
  const [listOfRefundReasons, setListOfRefundReasons] = useState<RefundReason[]>([]);
  const [selectedRefundReasons, setSelectedRefundReasons] = useState<string[]>([]);
  const [isSendingRefundRequest, setIsSendingRefundRequest] = useState(false);
  const [isRefundNoteRequired, setIsRefundNoteRequired] = useState(false);
  const [refundRequestNote, setRefundRequestNote] = useState('');
  const [userReview, setUserReview] = useState<ProductReview | null>();
  const [showReviewButton, setShowReviewButton] = useState(false);

  const isProductCanceled = orderLineStatus?.toUpperCase() === CANCELED;
  const isProductDelivered = orderLineStatus?.toUpperCase() === DELIVERED;
  const isProductNew = orderLineStatus?.toUpperCase() === NEW;
  const hasDiscount = orderLine.price_incl_tax !== orderLine.original_price_incl_tax;

  const handleProductTracking = () => setShowProductTracking((prevState) => !prevState);
  const handleProductCanceling = () => setShowCancelProductModal(true);

  const handleReviewProduct = () =>
    !!userReview?.id
      ? history.push(`/${orderLine.stockrecord?.id}/add-review/${userReview?.id}`)
      : history.push(`/${orderLine.stockrecord?.id}/add-review`);

  // fetch list of refund reasons on didMount
  useEffect(() => {
    (async () => {
      requestApi(getListOfRefundReasons, {}, (response: RefundReasons, error: string) => {
        if (error) {
          return;
        }
        const refundReasonsResult = response.results;
        setListOfRefundReasons(refundReasonsResult as RefundReason[]);
      });

      requestApi(
        listProductReviews,
        { resourceId: orderLine.stockrecord?.id, limit: 1 },
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
          if (userState.client?.id) {
            setShowReviewButton(true);
          }
        }
      );
    })();
  }, [userState.client?.id]);

  const handleSelectRefundReason = (refundReason: RefundReason) => {
    setSelectedRefundReasons((prev) => [...prev, refundReason.id]);
    if (refundReason.is_note_required) {
      setIsRefundNoteRequired(true);
    }
  };

  const handleUnSelectRefundReason = (refundReason: RefundReason) => {
    setSelectedRefundReasons((prev) => prev.filter((currentReason) => currentReason !== refundReason.id));
    if (refundReason.is_note_required) {
      setIsRefundNoteRequired(false);
      setRefundRequestNote('');
    }
  };

  const handleProductRefundRequest = () => {
    setIsSendingRefundRequest(true);
    if (!orderLine.id) {
      return;
    }
    const refundOrderLineInput: InputRefundOrderLine = {
      order_line_id: String(orderLine.id),
      refund_reason_ids: selectedRefundReasons,
      refund_note: refundRequestNote,
    };
    requestApi(refundOrderLine, { ...refundOrderLineInput }, (response: ResultOutput, error: string) => {
      if (error) {
        setIsSendingRefundRequest(false);
        return;
      }
      setIsSendingRefundRequest(false);
      setShowCancelProductModal(false);
      setShowRefundSuccessModal(true);
      /*
        Set order line status manually to canceled
        because the order line data is fetched at the top level 
      */
      setOrderLineStatus(CANCELED);
    });
  };

  return (
    <Row gutter={10}>
      <Col span={24}>
        <Row justify="space-between" align="middle">
          <CheckoutProductDetails
            product={orderLine.product!}
            grayImage={isProductCanceled || isProductDelivered}
            stockRecordId={orderLine.stockrecord?.id}
          />
          <Col className="prices-wrapper checkout-product-details">
            {hasDiscount && (
              <Typography.Text className="orignal-price last-label" type="secondary" delete>
                {orderLine?.original_price_incl_tax}
              </Typography.Text>
            )}
            <Typography.Text className="orignal-price last-label"> {orderLine?.price_incl_tax} </Typography.Text> &nbsp;
            <Typography.Text className="price-amount last-label"> {orderLine?.price_currency} </Typography.Text>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <div className="product-status-box">
          <Row justify="space-between" align="middle">
            <Typography.Text>
              {t(ORDER_STATUS)}{' '}
              <Typography.Text className={`status-label ${isProductCanceled && 'status-canceled-label'}`}>
                {t(getCurrentOrderStatusTitle(orderLineStatus?.toUpperCase()) || '')}
              </Typography.Text>
            </Typography.Text>
            <Space size="small">
              {isProductNew && (
                <Button type="primary" danger onClick={handleProductCanceling}>
                  {t(CANCEL_PRODUCT)}
                </Button>
              )}
              {isProductDelivered && showReviewButton && (
                <Button type={!!userReview ? 'link' : 'primary'} onClick={handleReviewProduct}>
                  {!!userReview && userReview?.general_score ? (
                    <Rate allowHalf defaultValue={userReview?.general_score} />
                  ) : null}
                  {!!userReview ? <EditOutlined /> : null}
                  {!!userReview ? t(EDIT_PRODUCT_REVIEW) : t(REVIEW_THIS_PRODUCT)}
                </Button>
              )}
              {isProductCanceled || isProductDelivered ? null : showProductTracking ? (
                <Button type="primary" onClick={handleProductTracking}>
                  <img src={profileIcons.remove} />
                </Button>
              ) : (
                <Button className="track-order" onClick={handleProductTracking}>
                  {t(TRACK_THE_ORDER)}
                </Button>
              )}
            </Space>
          </Row>
        </div>
        <Row>
          <Col span={24}>
            {showProductTracking && (
              <Steps progressDot current={getCurrentTrackingStep(orderLineStatus?.toUpperCase() || '')}>
                <Step title={t(NEW)} />
                <Step title={t(PREPARE_THE_ORDER)} />
                <Step title={t(DELIVERED)} />
              </Steps>
            )}
          </Col>
        </Row>
      </Col>
      {showCancelProductModal && (
        <Modal
          title={
            <Row justify="space-between" align="middle">
              <Typography.Text strong>{t(CANCEL_PRODUCT)}</Typography.Text>
              <Row align="middle">
                <Space size="small">
                  <HashIcon />
                  <Typography.Text>{orderNumber}</Typography.Text>
                </Space>
              </Row>
            </Row>
          }
          visible={showCancelProductModal}
          onOk={handleProductRefundRequest}
          confirmLoading={isSendingRefundRequest}
          onCancel={() => setShowCancelProductModal(false)}
          okButtonProps={{ danger: true, disabled: !selectedRefundReasons.length }}
          okText={t(CONFIRM_CANCEL_PRODUCT)}
          cancelText={t(CANCEL)}
          closable={false}
        >
          <Space direction="vertical" size="middle">
            <Alert message={t(REFUND_REQUEST_DESC)} type="info" showIcon />
            {listOfRefundReasons.map((refundReason) => (
              <div key={refundReason.id}>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleSelectRefundReason(refundReason);
                    } else {
                      handleUnSelectRefundReason(refundReason);
                    }
                  }}
                >
                  {refundReason.title}
                </Checkbox>
              </div>
            ))}
            {isRefundNoteRequired && (
              <TextArea
                value={refundRequestNote}
                onChange={(e: { target: { value: string } }) => setRefundRequestNote(e.target.value)}
                placeholder={t(REFUND_REQUEST_NOTE)}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            )}
          </Space>
        </Modal>
      )}
      {showRefundSuccessModal && (
        <Modal
          visible={showRefundSuccessModal}
          onCancel={() => setShowRefundSuccessModal(false)}
          footer={null}
          closable={false}
        >
          <Row justify="center">
            <Space direction="vertical" size="middle">
              <Row justify="center">
                <Image width={130} preview={false} src={RefundSuccessIcon} />
              </Row>
              <Row justify="center">
                <Typography.Text strong>{t(REFUND_REQUEST_SUCCESS)}</Typography.Text>
              </Row>
              <Row justify="center">
                <Typography.Text>{t(REFUND_REQUEST_SUCCESS_NOTE)}</Typography.Text>
              </Row>
              <Button type="primary" block onClick={() => setShowRefundSuccessModal(false)}>
                {t(OK)}
              </Button>
            </Space>
          </Row>
        </Modal>
      )}
    </Row>
  );
};
