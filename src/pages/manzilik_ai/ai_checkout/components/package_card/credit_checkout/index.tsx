import React, { useContext } from 'react';
import { Alert, Checkbox, Col, Row, Space, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { FunctionComponent, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {
  BankCard,
  Basket,
  BasketLine,
  PaymentCheckoutIdOutput,
  PaymentCheckoutIdResultObject,
  PaymentMethod,
  ResultOutput,
  SaveCardOptions,
} from '../../../../../../API';
import i18n from '../../../../../../app/i18n';
import { useMainContext } from '../../../../../../app/providers/main';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../../../../app/providers/main/loading_constants';
import { REVIEW_VAR } from '../../../../../../app/settings';
import icons from '../../../../../../assets/icons';
import { shoppingIcons } from '../../../../../../assets/icons/shopping';

import Separator from '../../../../../../components/separator';
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
} from '../../../../../../locales/strings';
import { AI_CHECKOUT_REDIRECT_ROUTE, AI_CHECKOUT_ROUTE, CHECKOUT_ROUTE } from '../../../../../../utils/routes';
import { wpwlOptions } from '../../../wpwlOptions';
import { CURRENT_ORDER_NUMBER_LOCAL_KEY } from '../../../../../../locales/constants';
import { SharedStateContext, SharedStateInterface } from '../../../../../../context/shared_state_context';
import {
  deleteBankCard,
  generatePaymentCheckoutIdForOrderInfo,
  getClientCards,
  listPaymentMethods,
} from '../../../../../shopping/checkout/api';
import { CardsSkeleton } from '../../../../../../components/skeletons/cards_grid_skeleton';
import { CheckoutStateType, CheckoutStep, CurrentOrder, stepId } from '../../../../../shopping/checkout';
import { requestPurchaseCredit } from '../../../../api';
import { RequestPurchaseCreditResponse } from '../../../../types';
import { ManzilikAiContext, ManzilikAiProps } from '../../../../manzilik_ai_context';

interface Props {
  selectedPackageId?: string | null;
  checkoutType?: string;
  serviceInquiryId?: string;
}

export const CreditCheckout: FunctionComponent<Props> = (props: Props) => {
  const { selectedPackageId, checkoutType, serviceInquiryId } = props;

  const { clientData: client } = useContext(SharedStateContext) as SharedStateInterface;
  const { requestApi, loadingMap, generalSettings } = useMainContext();
  const { hash } = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [brandName, setBrandName] = useState<string | undefined>(undefined);
  const [savedCardsList, setSavedCardsList] = useState<BankCard[]>([]);
  const [isSavedMethod, setIsSavedMethod] = useState<boolean>(false);
  const id = hash && hash?.split('id=')[1]?.split('.')[0];
  const [showPayment, togglePayment] = useReducer((state: boolean) => !state, false);
  const [checkoutIdRequestError, setCheckoutIdRequestError] = useState<PaymentCheckoutIdResultObject>();
  const { setSelectedCheckoutId } = useContext(ManzilikAiContext) as ManzilikAiProps;

  // Get Payment Methods
  const getPaymentCards = () => {
    requestApi(
      listPaymentMethods,
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

    const input /** PaymentCheckoutIdForOrderInfoInput */ = {
      payment_method_id: method.id?.toString(),
    };

    setCheckoutIdRequestError(undefined);
    requestApi(
      requestPurchaseCredit,
      {
        package_id: selectedPackageId,
        payment_method_id: method.id?.toString(),
        outstanding_id: serviceInquiryId ? serviceInquiryId : '',
      },

      (
        response: {
          data: {
            generatePaymentCheckoutIdForManzilikAi: RequestPurchaseCreditResponse;
          };
        },
        error: string
      ) => {
        if (error) {
          return;
        }
        const { checkout_id } = response.data.generatePaymentCheckoutIdForManzilikAi;

        if (checkout_id) {
          setBrandName(name!);
          setSelectedCheckoutId!(checkout_id);

          if (checkout_id) {
            localStorage.setItem(CURRENT_ORDER_NUMBER_LOCAL_KEY, checkout_id);
          }
          localStorage.setItem('checkoutId', checkout_id);
          const script = document.createElement('script');
          const baseUrl = `${generalSettings.hyperPayPaymentUrl}${process.env['REACT_APP_PAYMENT_WIDGET_SRC']}`;
          script.src = `${baseUrl}?checkoutId=${checkout_id}`;
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
        } else {
          return;
        }
      }
    );
  };

  const closePaymentForm = () => {
    setBrandName('');
    setIsSavedMethod(false);
    history.push(`${CHECKOUT_ROUTE}#${REVIEW_VAR}`);
  };

  const onSaveCard = (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    const isSaved = checked ? SaveCardOptions.True : SaveCardOptions.False;
  };

  const getClientSavedCards = () => {
    requestApi(
      getClientCards,
      { offset: 0, limit: 10 },
      (response: { results: BankCard[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        setSavedCardsList(response.results);
      }
    );
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

      <Row gutter={20} className="step-three-payment" id="payment">
        <hr className="h-separator" />
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
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
                  <img src={brandName == elm.name ? shoppingIcons.activeCheck : shoppingIcons.check} />
                </Row>
                {brandName == elm.name && !isSavedMethod && (
                  <div>
                    <Separator vertical={5} />
                    <form
                      action={`${AI_CHECKOUT_REDIRECT_ROUTE}?type=${checkoutType}`}
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

          {loadingMap[LOADING_LOW_PRIORITY_GLOBAL] && <CardsSkeleton colSpan={{ xl: 24 }} />}
        </Col>
      </Row>
    </Space>
  );
};
