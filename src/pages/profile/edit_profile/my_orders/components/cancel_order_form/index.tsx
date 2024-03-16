import { Button, Checkbox, Col, Divider, Form, Input, Row, Typography } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../../../app/providers/modal';
import { shoppingIcons } from '../../../../../../assets/icons/shopping';
import Separator from '../../../../../../components/separator';
import {
  ADD_DESCRIPTION,
  CANCEL,
  CHANGE_THE_ORDER,
  CONFIRM_ORDER_CANCELATION,
  ORDER_IS_DUPLICATED,
  OTHER,
  REASON_OF_CANCELING_THE_ORDER,
  SHIPPING_PROBLEM,
  THE_FOLLOWING_INFO_IS_ONLY_FOR_US_IT_WONT_PREVENT_YOU_FROM_CANCELING_YOUR_ORDER,
} from '../../../../../../locales/strings';

export const CancelOrderForm: FunctionComponent = () => {
  const { t } = useTranslation();
  const { setModalVisible } = useModal();

  const onClick = () => {
    setModalVisible?.(false);
  };

  return (
    <Form>
      <div className="modal-header">
        <img src={shoppingIcons.info} /> &nbsp;&nbsp;
        <Typography.Text>
          {t(THE_FOLLOWING_INFO_IS_ONLY_FOR_US_IT_WONT_PREVENT_YOU_FROM_CANCELING_YOUR_ORDER)}
        </Typography.Text>
      </div>
      <Separator vertical={5} />
      <Divider type="horizontal" />
      <Separator vertical={5} />
      <Typography.Text> {t(REASON_OF_CANCELING_THE_ORDER)} </Typography.Text>
      <Form.Item>
        {/**@TODO: this is just a static data for now */}
        <Checkbox.Group options={[t(CHANGE_THE_ORDER), t(SHIPPING_PROBLEM), t(ORDER_IS_DUPLICATED), t(OTHER)]} />
      </Form.Item>
      <Form.Item>
        <Input.TextArea placeholder={t(ADD_DESCRIPTION)} />
      </Form.Item>
      <Row>
        <Col>
          <Form.Item>
            <Button className="confirm-order" onClick={onClick}>
              {t(CONFIRM_ORDER_CANCELATION)}
            </Button>
          </Form.Item>
        </Col>
        <Separator horizontal={5} />
        <Col>
          <Form.Item>
            <Button className="cancel-order" onClick={onClick}>
              {t(CANCEL)}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
