/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import {
  ALL_OPTIONS_AVAILABLE,
  A_LOT_OF_DESIGNS,
  CREATE_DESIGNS,
  DOWNLOAD_IMAGES,
  INCLUDED_FEES,
  PAYMENT_FAILED,
  PENDING_PAYMENT,
  POINT,
  REFUND2,
  SAR,
  SERVICE_REQUESTS,
  START_SMART_DESIGN,
  SUCCESSFULL,
  TOTAL_PAYMENT,
  TYR_ANOTHER_TIME,
  WE_NEED_YOUR_PHONE_TO_ASSIST,
} from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import successIcon from '../../../../../assets/lotties/success.gif';
import failedIcon from '../../../../../assets/lotties/error.gif';
import pendingIcon from '../../../../../assets/lotties/pending.gif';
import { aiIcons } from '../../../../../assets/icons/ai';
import { getLayoutDirection } from '../../../../../app/layouts';
import { ManzilikAiContext, ManzilikAiProps } from '../../../manzilik_ai_context';
import { API } from 'aws-amplify';
import { graphqlAuthenticationOperation } from '../../../../../utils';
import { paymentStatusUpdated } from '../../../../../custom_graphql/subscriptions';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { CURRENT_ORDER_NUMBER_LOCAL_KEY } from '../../../../../locales/constants';
import * as analytics from '../../../../../analytics';
import { useClient } from '../../../../../app/hooks/use_client';
import { CheckoutTypes } from '../../../../../constants';
import IconWithText from '../../../../../components/icon_with_text';
import RfqPriceCard from '../../../../professionals/request_professional_service/components/rfq_price_card';
import PhoneNumberModal from '../../../../../components/phone_number_modal';
import { CountryPhoneInputValue } from 'antd-country-phone-input';
import { useCompletePersonalProfile } from '../../../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';

function StatusPage() {
  const { t, i18n } = useTranslation();
  const selectedPackage = JSON.parse(localStorage.getItem('selectedPackage') || '{}');
  const { client } = useClient();
  const [currentStatus, setCurrentStatus] = useState<string>('PENDING');
  const [message, setMessage] = useState<string>('');
  const { search } = useLocation();
  const checkoutType = search?.split('&')[0].split('=')[1];
  const isRfq = checkoutType === CheckoutTypes.RFQ;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [value, setValue] = useState<CountryPhoneInputValue>({ short: 'SA' });
  const { submitWithoutValidation } = useCompletePersonalProfile();

  const sendRequest = async () => {
    await submitWithoutValidation({
      mobile: `${value.code}${value.phone}`,
    });
    setModalVisible(false);
  };

  const checkoutId = localStorage.getItem(CURRENT_ORDER_NUMBER_LOCAL_KEY) || null;
  const options = {
    headers: {
      lang: i18n.language,
    }, // OPTIONAL
  };

  useEffect(() => {
    if (currentStatus === 'REJECTED') {
      setModalVisible(true);
    }
  }, [currentStatus]);

  useEffect(() => {
    if (!checkoutId!) {
      return;
    }
    const subscription = (
      API.graphql(graphqlAuthenticationOperation(paymentStatusUpdated, { checkout_id: checkoutId! })) as any
    ).subscribe({
      next: (eventData: any) => {
        const notifications = eventData.value.data;
        if (notifications.paymentStatusUpdated) {
          setCurrentStatus(notifications.paymentStatusUpdated.status);
          setMessage(notifications.paymentStatusUpdated.message);
        }
      },
      error: (error: never) => console.error("Can't subscrib", error),
    });

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe();
  }, [checkoutId!]);

  const history = useHistory();

  useEffect(() => {
    if (currentStatus === 'SUCCEEDED') {
      analytics.PublishEvent(
        new analytics.AnalyticsSuccessPurchaseEvent(selectedPackage.price!, selectedPackage.credit_amount!)
      );
    } else {
      analytics.PublishEvent(
        new analytics.AnalyticsFailedPurchaseEvent(selectedPackage.price!, selectedPackage.credit_amount!, client?.id!)
      );
    }
  }, [currentStatus]);

  const title =
    currentStatus === 'PENDING' ? (
      <p className="header">{t(PENDING_PAYMENT)}</p>
    ) : currentStatus === 'REJECTED' ? (
      <p className="header">{message}</p>
    ) : (
      <p className="header">{t(SUCCESSFULL)}</p>
    );

  return (
    <div
      className="ai-status-wrapper"
      style={{
        direction: getLayoutDirection(i18n.language),
      }}
    >
      <div className="ai-status-content">
        {currentStatus === 'PENDING' ? (
          <img src={pendingIcon} className="success-img" alt="" />
        ) : currentStatus === 'REJECTED' ? (
          <img src={failedIcon} className="success-img" alt="" />
        ) : (
          <img src={successIcon} className="success-img" alt="" />
        )}

        {title}
        {!isRfq ? (
          <div className="notes">
            <div className="title-with-icon">
              <img src={aiIcons.checked} alt="ai Checked" />
              <p className="title">{t(ALL_OPTIONS_AVAILABLE)}</p>
            </div>
            <ul>
              <li>{t(DOWNLOAD_IMAGES)}</li>
              <li>{t(CREATE_DESIGNS)}</li>
            </ul>

            <div className="title-with-icon">
              <img src={aiIcons.checked} alt="ai Checked" />
              <p className="title">{t(A_LOT_OF_DESIGNS)}</p>
            </div>
          </div>
        ) : (
          <div className="notes">
            <RfqPriceCard actualPrice="100" discountPrice="40" />
            <IconWithText icon={aiIcons.checked} text={t(INCLUDED_FEES)} />
            <IconWithText icon={aiIcons.checked} text={t(REFUND2)} />
          </div>
        )}

        {currentStatus === 'REJECTED' &&
          (!isRfq ? (
            <button className="start-ai-design try-ai" onClick={() => history.push('/manzilik-ai')}>
              {t(TYR_ANOTHER_TIME)}
            </button>
          ) : (
            <button className="start-ai-design try-ai" onClick={() => history.push('/request-quotation-service')}>
              {t(TYR_ANOTHER_TIME)}
            </button>
          ))}
        {currentStatus === 'SUCCEEDED' &&
          (!isRfq ? (
            <>
              <div className="selected-package">
                <p className="selected-points">
                  {selectedPackage?.credit_amount}
                  <span>{t(POINT)}</span>
                </p>
                <div className="selected-package-price">
                  <p>{t(TOTAL_PAYMENT)}</p>
                  <p>
                    {selectedPackage?.discount}
                    <span>{t(SAR)}</span>
                  </p>
                </div>
              </div>
              <button className="start-ai-design" onClick={() => history.push('/manzilik-ai')}>
                {t(START_SMART_DESIGN)}
              </button>
            </>
          ) : (
            <button className="start-ai-design" onClick={() => history.push('/edit-profile/service-requests')}>
              {t(SERVICE_REQUESTS)}
            </button>
          ))}
      </div>
      <PhoneNumberModal
        isModalVisible={modalVisible}
        setIsModalVisible={setModalVisible}
        onRequest={sendRequest}
        onPhoneNumberChange={(v) => {
          setValue(v);
        }}
        withDescription={false}
        title={WE_NEED_YOUR_PHONE_TO_ASSIST}
      />
    </div>
  );
}

export default StatusPage;
