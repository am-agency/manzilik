import { Divider, Row } from 'antd';
import React from 'react';
import { PaymentMethod } from '../../../../../API';
import Separator from '../../../../../components/separator';

interface Props {
  payment: PaymentMethod;
  paymentDetails: React.ReactNode;
}
export const PaymentDetails = ({ payment, paymentDetails }: Props) => {
  return (
    <Row className="payment-wrapper address-container">
      <div className="img-wrapper">
        <img src={payment?.logo!} alt={payment?.name!} className="img-fit-content" />
      </div>
      <Separator horizontal={5} />
      <Divider type="vertical" />
      <Separator horizontal={5} />
      {paymentDetails}
      {/* will enable it when it's done
              <div>
                <h5> shahenaz monia</h5>
                <h6>5478 ***** ***** 8754</h6>
              </div> */}
    </Row>
  );
};
