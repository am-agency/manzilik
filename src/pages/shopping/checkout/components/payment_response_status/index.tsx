import { Button, Modal, Row, Space, Typography } from 'antd';
import React, { FunctionComponent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentStatusOutput } from '../../../../../API';
import { CLOSE, PENDING, PENDING_PAYMENT, REJECTED, SUCCESSFULL } from '../../../../../locales/strings';
import Spinner from '../../../../../assets/gifs/spinner.svg';
import Success from '../../../../../assets/images/Success.svg';
import Failed from '../../../../../assets/images/Failed.svg';
import { useHistory } from 'react-router-dom';
import { CHECKOUT_ROUTE, MY_ORDERS_ROUTE } from '../../../../../utils/routes';
import { CURRENT_ORDER_NUMBER_LOCAL_KEY } from '../../../../../locales/constants';

interface Props {
  status: PaymentStatusOutput | null;
}

export const PaymentResponseStatus: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [show, setModalShow] = useState(true);
  const failureMessage = useMemo(() => {
    return props.status?.description;
  }, [props.status?.description]);

  const isPending = useMemo(() => {
    const _status = props.status?.payment_status;
    return !_status || _status.toLowerCase() === 'New' || _status.toLowerCase() === 'Pending';
  }, [props.status?.payment_status]);

  const isSuccess = useMemo(() => {
    return props.status?.payment_status === 'Succeeded';
  }, [props.status?.payment_status]);

  const status = useMemo(() => {
    if (isPending) {
      return PENDING_PAYMENT;
    } else if (isSuccess) {
      return SUCCESSFULL;
    } else {
      return failureMessage || REJECTED;
    }
  }, [props.status?.payment_status]);

  const paymentIconSrc = useMemo(() => {
    if (isSuccess) {
      return Success;
    } else if (isPending) {
      return Spinner;
    } else {
      return Failed;
    }
  }, [isSuccess, isPending]);

  const close = () => {
    setModalShow(false);
    if (isSuccess) {
      history.push(`${MY_ORDERS_ROUTE}/${localStorage.getItem(CURRENT_ORDER_NUMBER_LOCAL_KEY)}`);
    } else {
      history.push(CHECKOUT_ROUTE);
    }
  };

  return (
    <Modal visible={show} footer={null}>
      <div className="status-content">
        <Space direction="vertical" size="large">
          <img src={paymentIconSrc} alt="" />
          <Typography.Text className="status_title">{t(status)}</Typography.Text>
          {/* <p> {props.status.description} </p> */}
          <Button type="primary" onClick={close}>
            {t(CLOSE)}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};
