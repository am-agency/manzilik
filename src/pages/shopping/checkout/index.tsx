import React, { useCallback } from 'react';
import { Alert, Button, Col, Divider, Input, message, Row, Steps, Tag, Typography } from 'antd';
import { withFeature } from 'flagged';
import { FunctionComponent, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  BasketLinesGroupedByPartnerObject,
  Client,
  ClientAddress,
  OrderDetails,
  PaymentMethod,
  SaveCardOptions,
} from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { LOADING_HOME_SLIDER, LOADING_UPLOADING_PRODUCT } from '../../../app/providers/main/loading_constants';
import { getUserBasket } from '../../../app/providers/user/userBasket';
import { withUserAuthenticator } from '../../../app/providers/user/with_user_authenticator';
import { ECOMMERCE_FEATURE } from '../../../app/settings';
import { shoppingIcons } from '../../../assets/icons/shopping';
import { Container } from '../../../components/container';
import Separator from '../../../components/separator';
import {
  BASKET,
  BASKET_NO_ITEMS_ADDED,
  CHECK,
  CONFIRM_PAYMENT_PROCCESS,
  DELIVERY,
  DO_YOU_HAVE_COPOUN,
  ENTER_COPON_CODE,
  FAST_DELIVERY,
  HOME_PAGE_SEO_DESCRIPTION,
  MANZILIK,
  PAYMENT_REVIEW,
  PREV,
  PRICE,
  PRICE_AFTER_TAX,
  PRICE_BEFORE_TAX,
  SAFE_GATEWAY,
  SHIPPING_NO_ADDRESS_SELECTED,
  SHOPPING_BASKET,
  SHOPPING_DATA_NOT_COMPLETED,
  STEP_CONTINUE,
  SUPPORT,
  TOTAL_TAX,
} from '../../../locales/strings';
import { CHECKOUT_ROUTE } from '../../../utils/routes';
import { getClientAddresses } from '../../profile/api';
import { checkout, listBasketProducts } from './api';
import { StepBasket } from './steps/step_basket';
import { StepDelivery } from './steps/step_delivery';
import { StepPayment } from './steps/step_payment';
import { StepReview } from './steps/step_review';
import { Loading } from '../../../components/loading';
import StepPaymentStatus from './steps/step_payment_status';
import { MetaTags } from '../../../components/meta_tags';

const { Step } = Steps;

export interface CurrentOrder {
  products?: BasketLinesGroupedByPartnerObject[];
  address?: ClientAddress;
  payment?: PaymentMethod;
  save_card?: SaveCardOptions;
  isSavedMethod?: boolean;
}

export enum CheckoutStep {
  BASKET,
  DELIVERY,
  PAYMENT_REVIEW,
  PAYMENT_STATUS,
}

export const stepId = ['basket', 'delivery', 'payment-review', 'payment-status'];

interface CheckoutParams {
  tabId: string;
}

export enum CheckoutStateType {
  ENTER_CHECKOUT = 'ENTER_CHECKOUT',
  ENTER_BASKET = 'ENTER_BASKET',
  ENTER_DELIVERY = 'ENTER_DELIVERY',
  ENTER_PAYMENT = 'ENTER_PAYMENT',
  ENTER_REVIEW = 'ENTER_REVIEW',

  BASKET_READY = 'BASKET_READY',
  DELIVERY_READY = 'DELIVERY_READY',
  PAYMENT_READY = 'PAYMENT_READY',

  LOADING_USER_BASKET = 'LOADING_USER_BASKET',
  UPDATE_USER_BASKET = 'UPDATE_USER_BASKET',
  FOUND_USER_BASKET = 'FOUND_USER_BASKET',
  BASKET_WAS_CLEARED = 'BASKET_WAS_CLEARED',

  LOADING_BASKET_PRODUCTS = 'LOADING_BASKET_PRODUCTS',
  FOUND_PRODUCTS_IN_BASKET = 'FOUND_PRODUCTS_IN_BASKET',
  DONE_LOADING_BASKET_PRODUCTS = 'DONE_LOADING_BASKET_PRODUCTS',
  FAILED_LOADING_BASKET_PRODUCTS = 'FAILED_LOADING_BASKET_PRODUCTS',

  LOADING_CLIENT_ADDRESSES = 'LOADING_CLIENT_ADDRESSES',
  DONE_LOADING_CLIENT_ADDRESSES = 'DONE_LOADING_CLIENT_ADDRESSES',
  FAILED_LOADING_CLIENT_ADDRESSES = 'FAILED_LOADING_CLIENT_ADDRESSES',
  SELECT_DELIVERY_ADDRESS = 'SELECT_DELIVERY_ADDRESS',
}

interface CheckoutState {
  states: CheckoutStateType[];
  visited: Partial<Record<CheckoutStateType, number>>;
}

const checkoutStateReducer = (pre: CheckoutState, next: CheckoutStateType): CheckoutState => {
  return {
    states: [...pre.states, next],
    visited: {
      ...pre.visited,
      [next]: (pre.visited[next] || 0) + 1,
    },
  };
};

const Checkout: FunctionComponent = () => {
  const [checkoutState, dispatchNextState] = useReducer(checkoutStateReducer, {
    states: [CheckoutStateType.ENTER_CHECKOUT],
    visited: {},
  });
  const isMobile = window.innerWidth <= 600;
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(0);
  const [client, setClient] = useState<Client>();
  // global state for the current order from all steps states
  const [currentOrder, setCurrentOrder] = useState<CurrentOrder>();
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false);
  const {
    requestApi,
    userState: { basket },
    dispatchUser,
  } = useMainContext();

  const { t } = useTranslation();
  const params = useParams<CheckoutParams>();
  const history = useHistory();
  const [currentStepReady, setCurrentStepReady] = useState(false);
  const [showStepAlerts, setShowStepAlerts] = useState(false);

  useEffect(() => {
    if (params.tabId === stepId[CheckoutStep.PAYMENT_STATUS]) {
      setCurrentStep(CheckoutStep.PAYMENT_STATUS);
      return;
    }
    const stepIndex = stepId.indexOf(params.tabId);
    if (!checkoutState.visited.FOUND_PRODUCTS_IN_BASKET) {
      setCurrentStep(CheckoutStep.BASKET);
      return;
    }
    if (!checkoutState.visited.SELECT_DELIVERY_ADDRESS) {
      setCurrentStep(CheckoutStep.DELIVERY);
      return;
    }
    setCurrentStep(stepIndex);
  }, []);

  useEffect(() => {
    history.push({ pathname: CHECKOUT_ROUTE + '/' + stepId[currentStep] });
  }, [currentStep]);

  const updateOrder = (values: CurrentOrder) => {
    setCurrentOrder({ ...currentOrder, ...values });
  };

  const getClientProductBasket = () => {
    dispatchNextState(CheckoutStateType.LOADING_USER_BASKET);
    getUserBasket(dispatchUser);
  };

  const moveTo = (next: (currentStep: number) => number) => {
    setCurrentStep(next);
  };

  const setBasketProducts = (products: BasketLinesGroupedByPartnerObject[]) => {
    setCurrentOrder((order) => ({
      ...order,
      products,
    }));
  };

  const loadClientAddresses = () => {
    dispatchNextState(CheckoutStateType.LOADING_CLIENT_ADDRESSES);
    // the pagination is for the client addresses
    requestApi(
      getClientAddresses,
      { limit: 50, offset: 0 },
      (client: Client, error: string) => {
        if (error) {
          dispatchNextState(CheckoutStateType.FAILED_LOADING_CLIENT_ADDRESSES);
          return;
        }
        dispatchNextState(CheckoutStateType.DONE_LOADING_CLIENT_ADDRESSES);
        setClient(client);
      },
      LOADING_HOME_SLIDER
    );
  };

  const reloadBasket = useCallback(() => {
    if (basket?.id) {
      getBasketProducts(basket.id);
    }
  }, []);

  const steps = [
    {
      title: !isMobile ? t(BASKET) : '',
      content: (
        <StepBasket
          dispatchNextState={dispatchNextState}
          basketProducts={currentOrder?.products}
          setBasketProducts={setBasketProducts}
          clientBasket={basket}
          updateOrder={updateOrder}
          updateUserBasket={getClientProductBasket}
        />
      ),
      icon: checkoutState.visited.ENTER_BASKET ? shoppingIcons.basketActive : shoppingIcons.basket,
    },
    {
      title: !isMobile ? t(DELIVERY) : '',
      content: (
        <StepDelivery
          client={client}
          loadClientAddresses={loadClientAddresses}
          dispatchNextState={dispatchNextState}
          updateOrder={updateOrder}
          currentOrder={currentOrder}
          getClientData={loadClientAddresses}
        />
      ),
      icon: checkoutState.visited.ENTER_DELIVERY ? shoppingIcons.deliveryActive : shoppingIcons.delivery,
    },
    {
      title: !isMobile ? t(PAYMENT_REVIEW) : '',
      content: (
        <section>
          <StepPayment
            reloadBasket={reloadBasket}
            dispatchNextState={dispatchNextState}
            updateOrder={updateOrder}
            currentOrder={currentOrder!}
            basket={basket}
          />
          <hr className="h-separator" />
          <StepReview
            dispatchNextState={dispatchNextState}
            currentOrder={currentOrder!}
            isPaymentSuccess={isPaymentSuccess}
            onChangeStep={setCurrentStep}
          />
        </section>
      ),
      icon: checkoutState.visited.ENTER_PAYMENT ? shoppingIcons.paymentActive : shoppingIcons.payment,
    },
  ];

  const renderStepTitle = () => {
    switch (currentStep) {
      case CheckoutStep.BASKET:
        return t(SHOPPING_BASKET);
      case CheckoutStep.DELIVERY:
        return t(DELIVERY);
      case CheckoutStep.PAYMENT_REVIEW:
        return t(PAYMENT_REVIEW);
      default:
        break;
    }
  };

  const canChangeBasket = (to: CheckoutStep): boolean => {
    switch (to) {
      case CheckoutStep.PAYMENT_REVIEW:
        return false; // NOT ALLOWED;
      case CheckoutStep.DELIVERY:
        if (checkoutState.visited.FOUND_PRODUCTS_IN_BASKET) {
          return true;
        }
    }
    return false;
  };

  const canChangeDelivery = (to: CheckoutStep): boolean => {
    switch (to) {
      case CheckoutStep.BASKET:
        return true;
      case CheckoutStep.PAYMENT_REVIEW:
        if (checkoutState.visited.SELECT_DELIVERY_ADDRESS) {
          return true;
        }
    }
    return false;
  };

  const canChangePayment = (to: CheckoutStep): boolean => {
    switch (to) {
      case CheckoutStep.BASKET:
        return true;
      case CheckoutStep.DELIVERY:
        return true;
    }
    return false;
  };

  const onChange = (value: number) => {
    let canProceed = false;
    switch (currentStep) {
      case CheckoutStep.BASKET:
        canProceed = canChangeBasket(value);
        break;
      case CheckoutStep.DELIVERY:
        canProceed = canChangeDelivery(value);
        break;
      case CheckoutStep.PAYMENT_REVIEW:
        canProceed = canChangePayment(value);
    }

    if (canProceed) {
      moveTo(() => value);
    }
  };

  const serviceIcons = [
    { label: t(FAST_DELIVERY), icon: shoppingIcons.fastDeliverIcon },
    { label: t(SAFE_GATEWAY), icon: shoppingIcons.safePaymentIcon },
    { label: t(SUPPORT), icon: shoppingIcons.supportIcon },
  ];

  useEffect(() => {
    getClientProductBasket();
  }, []);

  const getBasketProducts = (basketId: number) => {
    dispatchNextState(CheckoutStateType.LOADING_BASKET_PRODUCTS);
    requestApi(
      listBasketProducts,
      { limit: 30, offset: 0, resourceId: basketId },
      (response: { result: BasketLinesGroupedByPartnerObject[]; count: number }, error: string) => {
        if (error) {
          dispatchNextState(CheckoutStateType.FAILED_LOADING_BASKET_PRODUCTS);
          return;
        }
        dispatchNextState(CheckoutStateType.DONE_LOADING_BASKET_PRODUCTS);
        setBasketProducts(response.result);
        if (response.result.length > 0) {
          dispatchNextState(CheckoutStateType.FOUND_PRODUCTS_IN_BASKET);
        }
      },
      LOADING_UPLOADING_PRODUCT
    );
  };

  const doneLoadedBasketProducts = useMemo(() => {
    return checkoutState.visited[CheckoutStateType.LOADING_BASKET_PRODUCTS];
  }, [checkoutState.visited]);

  useEffect(() => {
    if (basket?.id && !doneLoadedBasketProducts) {
      dispatchNextState(CheckoutStateType.FOUND_USER_BASKET);
      getBasketProducts(basket.id);
    }
  }, [basket]);

  const canMoveNext: [boolean, string] = useMemo(() => {
    let canMoveNext = false;
    let errorId = '';
    switch (currentStep) {
      case CheckoutStep.BASKET:
        if (checkoutState.visited.FOUND_PRODUCTS_IN_BASKET && !checkoutState.visited.BASKET_WAS_CLEARED) {
          canMoveNext = true;
        } else {
          canMoveNext = false;
          errorId = BASKET_NO_ITEMS_ADDED;
        }
        break;

      case CheckoutStep.DELIVERY:
        if (checkoutState.visited.SELECT_DELIVERY_ADDRESS) {
          canMoveNext = true;
        } else {
          canMoveNext = false;
          errorId = SHIPPING_NO_ADDRESS_SELECTED;
        }
    }

    setShowStepAlerts(false);
    return [canMoveNext, errorId];
  }, [checkoutState]);

  const next = useCallback(() => {
    setShowStepAlerts(true);
    if (canMoveNext[0]) {
      moveTo((p) => p + 1);
    }
  }, [moveTo, canMoveNext]);

  const prev = useCallback(() => {
    if (currentStep > CheckoutStep.BASKET) {
      moveTo((p) => p - 1);
    }
  }, [moveTo, currentStep]);

  useEffect(() => {
    setCurrentStepReady(false);
    switch (currentStep) {
      case CheckoutStep.BASKET:
        if (checkoutState.visited.DONE_LOADING_BASKET_PRODUCTS) {
          setCurrentStepReady(true);
        }
        break;
      case CheckoutStep.DELIVERY:
        if (checkoutState.visited.DONE_LOADING_CLIENT_ADDRESSES) {
          setCurrentStepReady(true);
        }
        break;
      case CheckoutStep.PAYMENT_STATUS:
        setCurrentStepReady(true);
        break;
      case CheckoutStep.PAYMENT_REVIEW:
        setCurrentStepReady(true);
        break;
    }
  }, [checkoutState]);

  return (
    <Container>
      <MetaTags title={`${t(MANZILIK)} | ${t(SHOPPING_BASKET)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      {currentStep === CheckoutStep.PAYMENT_STATUS ? (
        <StepPaymentStatus />
      ) : (
        <Row gutter={[24, 24]} className="checkout-process">
          <Col xl={17} lg={17} md={24} sm={24} xs={24} className="basket-container">
            <Row align="middle" justify="space-around">
              {/* <Col className="basket-title"> {renderStepTitle()} </Col> */}
              <Col>
                <section className="steps-wrapper">
                  <Steps current={currentStep} onChange={onChange} className="checkout-steps">
                    {steps?.map((item) => (
                      <Step key={item.title} title={item.title} icon={<img src={item.icon} alt="step-icon" />} />
                    ))}
                  </Steps>
                </section>

                <section className="alert">
                  {showStepAlerts && <Alert message={t(canMoveNext[1])} type="error" showIcon />}
                </section>
              </Col>
            </Row>
            {/* STEPS CONTENT ---------------------------------------------------------- */}
            {currentStepReady ? (
              <div className="steps-content checkout-steps">{steps[currentStep].content}</div>
            ) : (
              <Loading />
            )}
            {/* STEPS CONTENT ---------------------------------------------------------- */}
          </Col>
          <Col xl={7} lg={7} md={24} sm={24} xs={24}>
            <div className="price-and-tax">
              <div className="head">
                <Typography.Text> {t(PRICE)}</Typography.Text>
                <Typography.Text className="original-price">{basket?.total_incl_tax}</Typography.Text>
              </div>
              <Divider type="horizontal" />
              <div className="body">
                <Typography.Text> {t(DO_YOU_HAVE_COPOUN)} </Typography.Text>
                <Separator vertical={5} />
                <Input.Group compact>
                  <Input placeholder={t(ENTER_COPON_CODE)} />
                  <Button type="primary">{t(CHECK)}</Button>
                </Input.Group>
                <Separator vertical={15} />
                <div className="text-group">
                  <Typography.Text> {t(PRICE_BEFORE_TAX)} </Typography.Text>
                  <Typography.Text> {basket?.total_excl_tax} </Typography.Text>
                </div>
                <div className="text-group">
                  <Typography.Text> {t(TOTAL_TAX)} </Typography.Text>
                  <Typography.Text> {basket?.total_tax} </Typography.Text>
                </div>
              </div>
              <Divider type="horizontal" />
              <div className="footer">
                <Typography.Text className="final-price-text"> {t(PRICE_AFTER_TAX)} </Typography.Text>
                <Typography.Text className="final-price"> {basket?.total_incl_tax_excl_discounts} </Typography.Text>
              </div>
            </div>
            <Separator vertical={11} />
            <Row className="steps-action" wrap={false} align="middle" justify="center">
              <Button onClick={prev} className="prev-btn" disabled={currentStep <= CheckoutStep.BASKET}>
                {t(PREV)}
              </Button>
              {
                <Button
                  type="primary"
                  className="next-btn"
                  onClick={next}
                  disabled={currentStep >= CheckoutStep.PAYMENT_REVIEW}
                >
                  {t(STEP_CONTINUE)}
                </Button>
              }
            </Row>
            <Separator vertical={14} />
            <Row justify="space-between" className="services-icons">
              {serviceIcons.map((elm) => {
                return (
                  <Col key={elm.label} className="service-container">
                    <img src={elm.icon} alt={elm.label} />
                    <Separator vertical={2} />
                    <h5> {elm.label} </h5>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default withUserAuthenticator(withFeature(ECOMMERCE_FEATURE)(Checkout));
