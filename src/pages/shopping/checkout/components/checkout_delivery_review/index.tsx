import React, { useEffect } from 'react';
import { Space, Col, Typography, Row } from 'antd';
import { useReducer } from 'react';
import {
  SELECT_PAYMENT_METHOD,
  SECURE_PAYMENT_LINE,
  PAY_NOW,
  EDIT_ADDRESS_LINE,
  EDIT_ADDRESS,
  ADDRESS,
  EDIT,
  PAYMENT,
} from '../../../../../locales/strings';
import MailboxImage from '../../../../../assets/images/mailbox.svg';
import { useTranslation } from 'react-i18next';
import { CheckoutStep, CurrentOrder } from '../..';
import icons from '../../../../../assets/icons';
import { ADDRESS_VAR, PAYMENT_VAR } from '../../../../../app/settings';
import { shoppingIcons } from '../../../../../assets/icons/shopping';
import Separator from '../../../../../components/separator';
import { AddressDetails } from '../../../../profile/edit_profile/addresses/components/address_details';
import { PaymentDetails } from '../payment_details';
import { useHistory } from 'react-router-dom';
import { CHECKOUT_ROUTE } from '../../../../../utils/routes';

interface Props {
  currentOrder?: CurrentOrder;
  onChangeStep: (step: CheckoutStep) => void;
}

export const CheckoutDeliveryReview = ({ currentOrder, onChangeStep }: Props) => {
  const { t } = useTranslation();

  const onEditAddress = () => {
    onChangeStep(CheckoutStep.DELIVERY);
  };

  return (
    <Space direction="vertical" size="small" className="step-container">
      <button className="tab-btn">
        <img src={MailboxImage} alt="mailbox" />
        {currentOrder && (
          <section className="addresses-tab">
            {currentOrder.address && <AddressDetails address={currentOrder.address} />}
          </section>
        )}
        <span onClick={onEditAddress} className="edit-btn">
          {t(EDIT_ADDRESS)}
        </span>
      </button>
      <Row align="middle">
        <img src={icons.info.icon} alt="info" />
        <Typography.Text>&nbsp;{t(EDIT_ADDRESS_LINE)}</Typography.Text>
      </Row>
    </Space>
  );
};
