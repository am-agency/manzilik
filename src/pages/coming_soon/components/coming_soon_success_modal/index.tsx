import React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { shoppingIcons } from '../../../../assets/icons/shopping';
import Separator from '../../../../components/separator';
import {
  EXPLORE_MANZILIK,
  OPERATION_TEAM_WILL_REACH_YOU_SOON,
  THANK_FOR_YOUR_INTEREST_TO_JOIN_MANZILIK_PLANTFORM,
} from '../../../../locales/strings';

export const ComingSoonSuccessModal = () => {
  const { t } = useTranslation();
  return (
    <div className="success-msg-wrapper">
      <img src={shoppingIcons.successPayment} alt="success-payment" />
      <Separator vertical={15} />
      <h5> {t(THANK_FOR_YOUR_INTEREST_TO_JOIN_MANZILIK_PLANTFORM)} </h5>
      <p> {t(OPERATION_TEAM_WILL_REACH_YOU_SOON)} </p>
      <Separator vertical={12} />
      <Link to="/">
        <Button type="primary">{t(EXPLORE_MANZILIK)}</Button>
      </Link>
    </div>
  );
};
