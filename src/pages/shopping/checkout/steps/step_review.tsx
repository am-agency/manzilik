import { Button, Col, Divider, Row, Typography } from 'antd';
import React, { FunctionComponent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { CheckoutStateType, CheckoutStep, CurrentOrder, stepId } from '..';
import { ADDRESS_VAR, PAYMENT_VAR, TRACK } from '../../../../app/settings';
import { shoppingIcons } from '../../../../assets/icons/shopping';
import Separator from '../../../../components/separator';
import {
  ADDRESS,
  EDIT,
  PAYMENT,
  PRODUCTS,
  QUANTITY,
  THE_ORDER_HAS_BEEN_DONE_SUCCESSFULLY,
  THE_TOTAL_PRICE_HAS_BEEN_PAID_AND_WILL_WORKING_ON_PREPARING_THE_ORDER,
  TRACK_THE_ORDER,
} from '../../../../locales/strings';
import { CHECKOUT_ROUTE } from '../../../../utils/routes';
import { AddressDetails } from '../../../profile/edit_profile/addresses/components/address_details';
import { CheckoutDeliveryReview } from '../components/checkout_delivery_review';
import { CheckoutProductDetails } from '../components/checkout_product_details';
import { PaymentDetails } from '../components/payment_details';

interface Props {
  currentOrder: CurrentOrder;
  isPaymentSuccess: boolean;
  onChangeStep: (step: CheckoutStep) => void;
  dispatchNextState: (state: CheckoutStateType) => void;
}

export const StepReview: FunctionComponent<Props> = ({
  currentOrder = {},
  isPaymentSuccess,
  onChangeStep,
  dispatchNextState,
}: Props) => {
  const history = useHistory();
  useEffect(() => {
    dispatchNextState(CheckoutStateType.ENTER_REVIEW);
  }, []);

  const { t } = useTranslation();

  if (isPaymentSuccess) {
    return (
      <div className="success-payment">
        <img src={shoppingIcons.successPayment} alt="success-payment" />
        <Separator vertical={7} />
        <h5> {t(THE_ORDER_HAS_BEEN_DONE_SUCCESSFULLY)} </h5>
        <Separator vertical={3} />
        <p> {t(THE_TOTAL_PRICE_HAS_BEEN_PAID_AND_WILL_WORKING_ON_PREPARING_THE_ORDER)} </p>
        <Separator vertical={12} />
      </div>
    );
  }

  return (
    <div className="step-one step-four-review">
      <CheckoutDeliveryReview currentOrder={currentOrder} onChangeStep={onChangeStep} />
      <hr className="h-separator" />
      <Typography.Text className="section-title"> {t(PRODUCTS)} </Typography.Text>
      <Separator vertical={6} />
      <div>
        {currentOrder.products?.map((elm) => {
          return (
            <div key={elm.partner?.id}>
              {elm.lines?.map((item) => {
                return (
                  <Row key={item?.id} justify="space-between" className="product-review-details">
                    <Col>
                      <CheckoutProductDetails product={item?.product!} />
                    </Col>
                    <Col className="price-and-quantity">
                      <div className="quantity">
                        <Typography.Text> {t(QUANTITY)} </Typography.Text> &nbsp;&nbsp; | &nbsp;&nbsp;
                        <Typography.Text> {item?.quantity} </Typography.Text>
                      </div>
                      <Separator horizontal={13} />
                      <div className="price">
                        <strong> {item?.price_excl_tax} </strong>
                        <Typography.Text> {item?.price_currency} </Typography.Text>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </div>
          );
        })}
      </div>

      <Divider type="horizontal" />
    </div>
  );
};
