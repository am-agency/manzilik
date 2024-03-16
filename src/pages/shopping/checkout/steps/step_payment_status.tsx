import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { PaymentStatusOutput } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import { CHECKOUT_ROUTE } from '../../../../utils/routes';
import { getPaymentStatus } from '../api';
import { PaymentResponseStatus } from '../components/payment_response_status';

const StepPaymentStatus = () => {
  const { requestApi } = useMainContext();
  const [paymentResponse, setPaymentResponse] = useState<PaymentStatusOutput | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hpCheckoutId = params.get('id');

    if (hpCheckoutId) {
      setTimeout(() => {
        requestApi(getPaymentStatus, { hp_checkout_id: hpCheckoutId }, (res: PaymentStatusOutput, err: string) => {
          setPaymentResponse(res);
        });
      }, 30000);
    } else {
      window.location.href = CHECKOUT_ROUTE;
    }
  }, []);

  return <PaymentResponseStatus status={paymentResponse} />;
};

export default StepPaymentStatus;
