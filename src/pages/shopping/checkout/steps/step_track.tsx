import { Button, Row, Steps } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Separator from '../../../../components/separator';
import {
  CANCEL_THE_ORDER,
  DELIVERY_PROCESS,
  MY_ORDERS,
  PREPARE_THE_ORDER,
  REVIEW_PROCESS,
  THE_ORDER_HAS_BEEN_DELIVERED_SUCCESSFULLY,
} from '../../../../locales/strings';

const { Step } = Steps;

export const StepTrack: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className="step-five-track">
      <Row justify="center" className="steps-track">
        <Steps progressDot direction="vertical" current={0}>
          <Step title={t(REVIEW_PROCESS)} />
          <Step title={t(PREPARE_THE_ORDER)} />
          <Step title={t(DELIVERY_PROCESS)} />
          <Step title={t(THE_ORDER_HAS_BEEN_DELIVERED_SUCCESSFULLY)} />
        </Steps>
      </Row>
      <Separator vertical={14} />
      <Row wrap={false}>
        <Button type="primary" className="my-order-btn">
          {t(MY_ORDERS)}
        </Button>
        <Separator horizontal={8} />
        <Button className="cancel-order"> {t(CANCEL_THE_ORDER)} </Button>
      </Row>
    </div>
  );
};
