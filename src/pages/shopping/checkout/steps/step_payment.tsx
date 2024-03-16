import React, { useContext } from 'react';
import { Alert, Checkbox, Col, Row, Space, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { FunctionComponent, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { CheckoutStateType, CheckoutStep, CurrentOrder, stepId } from '..';
import {
  BankCard,
  Basket,
  BasketLine,
  PaymentCheckoutIdOutput,
  PaymentCheckoutIdResultObject,
  PaymentMethod,
  ResultOutput,
  SaveCardOptions,
} from '../../../../API';
import { useClient } from '../../../../app/hooks/use_client';
import i18n from '../../../../app/i18n';
import { useMainContext } from '../../../../app/providers/main';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../../app/providers/main/loading_constants';
import { REVIEW_VAR } from '../../../../app/settings';
import icons from '../../../../assets/icons';
import { shoppingIcons } from '../../../../assets/icons/shopping';
import CreditCardImage from '../../../../assets/images/credit_card.svg';
import Separator from '../../../../components/separator';
import { CardsSkeleton } from '../../../../components/skeletons/cards_grid_skeleton';
import {
  ADD_NEW_CARD,
  CARD_NUMBER_MISMATCH_BRAND_TYPE,
  FIRST_NAME,
  INVALID_CARD_HOLDER,
  LAST_NAME,
  LAST_STEP_PURCHASE,
  MISSING_FIRST_NAME,
  MISSING_LAST_NAME,
  PAY_NOW,
  SAVE_CARD_IN_SAFE_WAY_TO_PAY_QUICKLY_IN_FUTURE,
  SECURE_PAYMENT_LINE,
  SELECT_PAYMENT_METHOD,
} from '../../../../locales/strings';
import { CHECKOUT_ROUTE } from '../../../../utils/routes';
import { wpwlOptions } from '../../wpwlOptions';
import { deleteBankCard, generatePaymentCheckoutIdForOrderInfo, getClientCards, listPaymentMethods } from '../api';
import { CURRENT_ORDER_NUMBER_LOCAL_KEY } from '../../../../locales/constants';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';

interface Props {
  updateOrder: (values: CurrentOrder) => void;
  currentOrder: CurrentOrder;
  basket: Basket | undefined;
  dispatchNextState: (state: CheckoutStateType) => void;
  reloadBasket: () => void;
}

export const StepPayment: FunctionComponent<Props> = ({
  updateOrder,
  currentOrder,
  basket,
  dispatchNextState,
  reloadBasket,
}: Props) => {
  useEffect(() => {
    dispatchNextState(CheckoutStateType.ENTER_PAYMENT);
  }, []);
  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { requestApi, loadingMap, generalSettings } = useMainContext();
  const { hash } = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [brandName, setBrandName] = useState<string | undefined>(currentOrder?.payment?.name!);
  const [savedCardsList, setSavedCardsList] = useState<BankCard[]>([]);
  const [isSavedMethod, setIsSavedMethod] = useState<boolean>(false);
  const id = hash && hash?.split('id=')[1]?.split('.')[0];
  const [showPayment, togglePayment] = useReducer((state: boolean) => !state, false);
  const [checkoutIdRequestError, setCheckoutIdRequestError] = useState<PaymentCheckoutIdResultObject>();

  const getPaymentCards = () => {
    requestApi(
      listPaymentMethods,
      // limited payment methods
      { limit: 10, offset: 0 },
      (response: { results: PaymentMethod[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        const { results } = response;
        setPaymentMethods(results);
      }
    ),
      LOADING_LOW_PRIORITY_GLOBAL;
  };

  const onPaymentMethodClick = (method: PaymentMethod, refId?: string) => {
    const { name } = method!;

    if (brandName == name) {
      setBrandName(undefined);
      setIsSavedMethod(false);
      return;
    }

    if (refId) {
      setIsSavedMethod(true);
    } else {
      setIsSavedMethod(false);
    }

    if (!currentOrder.address) {
      // TODO: missing address
      return;
    }

    if (!basket) {
      // TODO: missing basket
      return;
    }

    if (!currentOrder.products) {
      // TODO: missing products
      return;
    }

    const currentOrderLine = currentOrder.products.flatMap((product) => product.lines) as BasketLine[];

    const lines = currentOrderLine
      .map((line) => {
        if (
          !line.id ||
          !line?.product?.id ||
          !line.quantity ||
          !line.stockrecord_id ||
          !line.stockrecord_id ||
          !line.price_currency ||
          !line.price_incl_tax
        ) {
          return null;
        }
        const checkoutLine = {
          id: line.id,
          product_id: parseInt(line.product.id),
          quantity: line.quantity,
          stockrecord_id: line.stockrecord_id,
          price_currency: line.price_currency,
          price_incl_tax: line.price_incl_tax,
        };
        return checkoutLine;
      })
      .filter((line) => line !== null);

    if (!currentOrder.address.country || !currentOrder.address.city || !currentOrder.address.neighborhood) {
      // TODO: Handle missing address values - unlikely situation -
      return;
    }

    const input /** PaymentCheckoutIdForOrderInfoInput */ = {
      basket: {
        id: basket.id,
        status: basket.status,
        total_incl_tax: basket.total_incl_tax,
        total_quantity: basket.total_quantity,
        currency: basket.currency,
        lines,
      },
      shipping_address: {
        client_address_id: currentOrder.address.id,
        country: currentOrder.address.country.id,
        city: currentOrder.address.city.id,
        neighborhood: currentOrder.address.neighborhood.id,
        name: currentOrder.address.name,
        first_name: currentOrder.address.first_name,
        last_name: currentOrder.address.last_name,
        phone_number: currentOrder.address.phone_number,
        email: currentOrder.address.email,
        note: currentOrder.address.description,
      },
      payment_method_id: method.id?.toString(),
    };

    setCheckoutIdRequestError(undefined);
    requestApi(generatePaymentCheckoutIdForOrderInfo, input, (response: PaymentCheckoutIdOutput, error: string) => {
      if (error) {
        return;
      }
      if (response.id) {
        setBrandName(name!);
        if (response.order_number) {
          localStorage.setItem(CURRENT_ORDER_NUMBER_LOCAL_KEY, response.order_number);
        }
        localStorage.setItem('checkoutId', response.id);
        const script = document.createElement('script');
        const baseUrl = `${generalSettings.hyperPayPaymentUrl}${process.env['REACT_APP_PAYMENT_WIDGET_SRC']}`;
        script.src = `${baseUrl}?checkoutId=${response.id}`;
        script.async = true;
        const _t = {
          [FIRST_NAME]: t(FIRST_NAME),
          [LAST_NAME]: t(LAST_NAME),
          [MISSING_FIRST_NAME]: t(MISSING_FIRST_NAME),
          [MISSING_LAST_NAME]: t(MISSING_LAST_NAME),
          [INVALID_CARD_HOLDER]: t(INVALID_CARD_HOLDER),
          [CARD_NUMBER_MISMATCH_BRAND_TYPE]: t(CARD_NUMBER_MISMATCH_BRAND_TYPE),
        };

        const initialValues = {
          [FIRST_NAME]: client?.first_name || '',
          [LAST_NAME]: client?.last_name || '',
        };
        // @ts-ignore
        window.wpwlOptions = wpwlOptions(i18n, _t, initialValues, method.brand);
        document.body.appendChild(script);
        updateOrder({ payment: method, isSavedMethod: refId ? true : false });
      } else {
        reloadBasket();
        setCheckoutIdRequestError(response.result as PaymentCheckoutIdResultObject);
      }
    });
  };

  const closePaymentForm = () => {
    setBrandName('');
    setIsSavedMethod(false);
    history.push(`${CHECKOUT_ROUTE}#${REVIEW_VAR}`);
  };

  const onSaveCard = (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    const isSaved = checked ? SaveCardOptions.True : SaveCardOptions.False;
    updateOrder({ save_card: isSaved });
  };

  const getClientSavedCards = () => {
    requestApi(
      getClientCards,
      // limited cards
      { offset: 0, limit: 10 },
      (response: { results: BankCard[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        setSavedCardsList(response.results);
      }
    );
  };

  const onDeleteCard = (id: string) => {
    requestApi(deleteBankCard, { id }, (response: ResultOutput, error: string) => {
      if (error) {
        return;
      }
      const updatedList = savedCardsList.filter((elm) => elm.id !== id);
      setSavedCardsList(updatedList);
    });
  };

  useEffect(() => {
    if (id) {
      closePaymentForm();
    }
  }, [hash]);

  useEffect(() => {
    getClientSavedCards();
    getPaymentCards();
  }, []);

  return (
    <Space size="small" direction="vertical" className={'step-container ' + (i18n.language === 'ar' ? 'rtl' : 'ltr')}>
      {checkoutIdRequestError && <Alert type="warning" message={checkoutIdRequestError.description} />}
      <button className="tab-btn" onClick={togglePayment}>
        <Space align="center" size="small" direction="horizontal">
          <img className="img-fit-content" src={CreditCardImage} alt="credit card" />
          <Col>
            <header className="title">{t(SELECT_PAYMENT_METHOD)}</header>
            <Typography.Text>
              <Row align="middle">
                <img src={icons.secure.icon} alt="secure" />
                &nbsp;{t(SECURE_PAYMENT_LINE)}
              </Row>
            </Typography.Text>
          </Col>
        </Space>
        <span className="pay-btn">{t(PAY_NOW)}</span>
      </button>
      <Row align="middle">
        <img src={icons.info.icon} alt="info" />
        <Typography.Text>&nbsp;{t(LAST_STEP_PURCHASE)}</Typography.Text>
      </Row>
      {showPayment && (
        <Row gutter={20} className="step-three-payment" id="payment">
          {/* TODO: FIX IT LATER */}
          {/* {savedCardsList.length > 0 && (
            <Col xl={10} lg={10} md={10} sm={24} xs={24} className="radio-group-container-custom">
              <div className="cards-title saved-cards-title"> {t(SAVED_CARDS)} </div>
              <Radio.Group className="radio-group-container" value={currentOrder?.payment?.id}>
                {savedCardsList?.map((elm) => {
                  return (
                    <>
                      <Radio
                        key={elm.id}
                        value={elm?.payment_method?.id}
                        className="radio-wrapper saved-card"
                        onChange={() => onPaymentMethodClick(elm?.payment_method!, elm?.partner_reference!)}
                      >
                        <Row justify="space-between" className="payment-method">
                          <Col>
                            <div className="img-wrapper">
                              <img src={elm?.payment_method?.logo!} alt={elm?.name!} className="img-fit-content" />
                            </div>
                            <p> {elm.name} </p>
                            <p className="card-number"> {elm.number} </p>
                            <p> {moment(elm.expiry_date).locale('en').format('MM/YYYY')} </p>
                          </Col>
                          <Col>
                            <div className="delete-wrapper icon" onClick={() => onDeleteCard(elm?.id!)}>
                              <img src={icons.whiteDelete} alt="delete-card" />
                            </div>
                          </Col>
                        </Row>
                      </Radio>
                      {isSavedMethod && (
                        <div>
                          <Separator vertical={5} />
                          <form
                            action={StepId[CheckoutStep.PAYMENT_STATUS]}
                            target="_blank"
                            data-brands={elm.payment_method?.brand}
                            className="paymentWidgets"
                          />
                        </div>
                      )}
                    </>
                  );
                })}
              </Radio.Group>
            </Col>
          )} */}
          <hr className="h-separator" />
          <Col xl={14} lg={14} md={14} sm={24} xs={24}>
            <div className="cards-title"> {t(ADD_NEW_CARD)} </div>
            <Separator vertical={5} />
            {paymentMethods?.map((elm) => {
              return (
                <div className="clickable" key={elm.id}>
                  <Separator vertical={5} />
                  <Row
                    className="payment-method"
                    justify="space-between"
                    align="middle"
                    onClick={() => onPaymentMethodClick(elm)}
                  >
                    <div className="img-wrapper">
                      <img src={elm?.logo!} alt={elm?.name!} className="img-fit-content payment-method-logo" />
                    </div>
                    <img
                      src={
                        brandName == elm.name && !currentOrder?.isSavedMethod
                          ? shoppingIcons.activeCheck
                          : shoppingIcons.check
                      }
                    />
                  </Row>
                  {brandName == elm.name && !isSavedMethod && (
                    <div>
                      <Separator vertical={5} />
                      <form
                        action={`${stepId[CheckoutStep.PAYMENT_STATUS]}/redirect`}
                        target="_blank"
                        className="paymentWidgets"
                        data-brands="MADA VISA MASTER"
                        lang={'ar'}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            <Separator vertical={20} />
            {paymentMethods.length > 0 && (
              <Checkbox onChange={onSaveCard}> {t(SAVE_CARD_IN_SAFE_WAY_TO_PAY_QUICKLY_IN_FUTURE)} </Checkbox>
            )}
            {loadingMap[LOADING_LOW_PRIORITY_GLOBAL] && <CardsSkeleton colSpan={{ xl: 24 }} />}
          </Col>
        </Row>
      )}
    </Space>
  );
};
