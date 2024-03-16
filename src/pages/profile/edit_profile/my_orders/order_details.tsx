import React, { FunctionComponent } from 'react';
import { Col, Row, Skeleton, Steps, Tabs, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ADDRESS,
  CANCEL_THE_ORDER,
  DISCOUNT_AMOUNT,
  PAYMENT,
  PRICE,
  PRICE_AFTER_TAX,
  PRICE_BEFORE_TAX,
  PRODUCTS,
  SHIPPING_COST,
  TOTAL_TAX,
} from '../../../../locales/strings';
import { OrderDetails as Order, OrderLine, OrderLinesGroupedByPartnerObject } from '../../../../API';
import Separator from '../../../../components/separator';
import { AddressDetails } from '../addresses/components/address_details';
import { PaymentDetails } from '../../../shopping/checkout/components/payment_details';
import { ModalTitle } from '../../../../components/modal_title';
import { CancelOrderForm } from './components/cancel_order_form';
import { useModal } from '../../../../app/providers/modal';
import { OrderProductDetails } from '../../../shopping/checkout/components/order_product_details';

const { TabPane } = Tabs;

interface Props {
  order: Order;
  orderProducts: OrderLinesGroupedByPartnerObject[];
}
export const OrderDetails: FunctionComponent<Props> = ({ order, orderProducts }: Props) => {
  const { t } = useTranslation();
  const { showModal } = useModal();

  const priceDetails = [
    {
      label: t(PRICE),
      amount: `${order?.products_price || 0.0} ${order?.currency}`,
    },
    {
      label: t(SHIPPING_COST),
      amount: `${order?.shipping_excl_tax || 0.0} ${order?.currency}`,
    },
    {
      label: `${t(DISCOUNT_AMOUNT)} (${order?.discount_amount || 0.0} %)`,
      amount: `${order?.discount_price || 0.0}`,
    },
    {
      label: t(PRICE_BEFORE_TAX),
      amount: `${order?.total_excl_tax || 0.0} ${order?.currency}`,
    },
    {
      label: t(TOTAL_TAX),
      amount: `${order?.total_tax || 0.0} ${order?.currency} `,
    },
    {
      label: t(PRICE_AFTER_TAX),
      amount: `${order?.total_incl_tax || 0.0} ${order?.currency}`,
    },
  ];

  const onCancelOrder = () => {
    showModal(
      <ModalTitle title={t(CANCEL_THE_ORDER)} />,
      <CancelOrderForm />,
      'modal-wrapper modal-with-custom-footer cancel-order-modal',
      '',
      <div />
    );
  };

  const renderPricesSection = () => {
    return (
      <Col span={24} className="prices-wrapper">
        {priceDetails?.map((elm, index) => {
          const lastElm = priceDetails.length == index + 1;
          return (
            <>
              <Row justify="space-between" key={`${index}-${elm.label}`}>
                <Col>
                  <Typography.Text className={lastElm ? 'last-label' : 'label'}>{elm.label}</Typography.Text>
                </Col>
                <Col>
                  <Typography.Text className={lastElm ? 'last-amount last-label' : 'price-amount'}>
                    {elm.amount}
                  </Typography.Text>
                </Col>
              </Row>
              <Separator vertical={lastElm ? 5 : 4} />
            </>
          );
        })}
      </Col>
    );
  };
  return (
    <div className="order_details-container">
      <Tabs defaultActiveKey="1" className="custom-tabs">
        <TabPane key="1" tab={<span>{t(PRODUCTS)}</span>}>
          <Row justify="space-between" gutter={[2, 18]}>
            {orderProducts.length ? (
              <Col xl={13} lg={13} md={14} sm={24} xs={24}>
                {orderProducts.map((elm, index) => {
                  return (
                    <div className="product-wrapper" key={`${index}-${elm.partner?.id}`}>
                      <div className="product-header">{elm.partner?.name}</div>
                      <Separator vertical={6} />
                      {elm.lines?.map((item) => (
                        <>
                          <OrderProductDetails orderLine={item!} orderNumber={order?.number} key={item?.id} />
                          <Separator vertical={3} />
                        </>
                      ))}
                    </div>
                  );
                })}
              </Col>
            ) : (
              <Col xl={13} lg={13} md={14} sm={24} xs={24}>
                <Skeleton />
              </Col>
            )}

            <Col span={2} />
            {renderPricesSection()}
          </Row>
        </TabPane>
        <TabPane
          key="2"
          tab={
            <span>
              {t(ADDRESS)} | {t(PAYMENT)}
            </span>
          }
        >
          <Row>
            <Col xl={13} lg={13} md={24} sm={24} xs={24}>
              <div className="addresses-tab">
                <div className="address-container">
                  {order && <AddressDetails address={order?.shipping_address!} />}
                </div>
              </div>
              <Separator vertical={16} />
              <PaymentDetails payment={order?.payment_method!} paymentDetails={renderPricesSection()} />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};
