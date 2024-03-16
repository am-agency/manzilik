/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CountryPhoneInput, { ConfigProvider, CountryPhoneInputValue } from 'antd-country-phone-input';

import { useMainContext } from '../../../app/providers/main';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import { useRequestProfessionalService } from '../../professionals/request_professional_service/hooks/useRequestProfessionalService';
import { ManzilikAiContext, ManzilikAiProps } from '../manzilik_ai_context';
import { getAIDesign } from '../api';
import { AIDesignObject, ServiceInquiry } from '../../../API';

import DesignHeader from './components/design_header';
import DesignRating from './components/design_rating';
import PackageDetails from '../ai_checkout/components/package_details';
import Referral from '../components/referral';
import { useFeature } from 'flagged';
import * as analytics from '../../../analytics';

import AIHeaderIMage from '../../../assets/images/ai.png';
import SaveTime from '../../../assets/icons/ai/why-manzilik1.svg';
import ImproveDesigns from '../../../assets/icons/ai/why-manzilik2.svg';
import PredictFuture from '../../../assets/icons/ai/why-manzilik3.svg';
import CustomizeDesign from '../../../assets/icons/ai/why-manzilik4.svg';

import {
  CUSTOMIZE_DESIGN,
  CUSTOMIZE_DESIGN_TEXT,
  IMPROVE_DESIGN,
  IMPROVE_DESIGN_TEXT,
  NEED_DESIGNER,
  NEED_DESIGNER_TEXT,
  PREDICT_FUTURE,
  PREDICT_FUTURE_TEXT,
  REQUEST_SUCCESSFULLY_RECEIVED,
  SAVE_TIME_EFFORT,
  SAVE_TIME_EFFORT_TEXT,
  SEND_TO_MANZILIK,
  WHY_MANZILIK,
  WHY_MANZILIK_TEXT,
} from '../../../locales/strings';

import { getLayoutDirection } from '../../../app/layouts';
import { REFERRAL_FLAG } from '../../../app/settings';
import { Loading } from '../../../components/loading';
import { ServiceInquiryOutput } from '../../professionals/request_professional_service/types';
import { aiIcons } from '../../../assets/icons/ai';
import PhoneNumberModal from '../../../components/phone_number_modal';

const { REACT_APP_PROFESSIONAL_ID, REACT_APP_SERVICE_INQUERY_ID } = process.env;

function DesignDetails() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const { clientData, setAiRfqInquiry } = useContext(SharedStateContext) as SharedStateInterface;
  const [selectedDesignObject, setSelectedDesignObject] = useState<AIDesignObject | undefined>(undefined);

  const originalImageURL = selectedDesignObject?.sourceImageUrl;
  const afterImageURL = selectedDesignObject?.processedImagesPath?.[selectedDesignObject.selectedImageIndex ?? 0];
  const { formData } = useContext(ManzilikAiContext) as ManzilikAiProps;
  const [isRequestSuccess, setIsRequestSuccess] = React.useState(false);
  const history = useHistory();
  const isReferralFlagOn = useFeature(REFERRAL_FLAG);
  const hasMobile = clientData?.mobile ? 'Yes' : 'No';

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isDesignObjectLoaded, setIsDesignObjectLoaded] = useState<boolean>(false);
  const { requestProfessionalService } = useRequestProfessionalService();
  const [value, setValue] = useState<CountryPhoneInputValue>({ short: 'SA' });
  const [description, setDescription] = useState<string>('');
  const location = useLocation();
  const id = location.pathname.split('/')[2];

  const getAIDesignObject = useCallback(() => {
    setIsDesignObjectLoaded(false);
    requestApi(
      getAIDesign,
      {
        id,
      },
      (
        response: {
          data: {
            getAIDesignDetails: AIDesignObject;
          };
        },
        error: string
      ) => {
        if (error) {
          return;
        }
        setSelectedDesignObject(response?.data?.getAIDesignDetails);
        setIsDesignObjectLoaded(true);
      }
    );
  }, [id]);

  useEffect(() => {
    getAIDesignObject();
  }, [getAIDesignObject]);

  useEffect(() => {
    window.onpopstate = () => {
      history.push('/manzilik-ai');
    };
  }, []);

  const sendRequest = () => {
    const rfqInquiry = {
      professional_id: REACT_APP_PROFESSIONAL_ID,
      description: `${description} , Room Type:${
        (formData?.roomTypeSlug || selectedDesignObject?.roomType?.name) ?? ''
      } Style:${
        (formData?.styleSlug || selectedDesignObject?.style?.name) ?? ''
      } , request assistance in ManzilikAI generated design`,
      services: [REACT_APP_SERVICE_INQUERY_ID],
      photos: [originalImageURL, afterImageURL],
      phone_number: clientData.mobile ? `${clientData?.mobile}` : `${value?.phone}`,
    };

    setAiRfqInquiry!(rfqInquiry! as any);

    requestApi(requestProfessionalService, rfqInquiry, (response: ServiceInquiryOutput, error: string) => {
      if (error) {
        return;
      }
      setIsRequestSuccess(true);
      setModalVisible(false);
      history.push('/request-quotation-service');
    });

    analytics.PublishEvent(new analytics.AnalyticsSendToManzilikAIEvent(hasMobile));
    analytics.PublishEvent(new analytics.AnalyticsAddInquiryEvent('SelectedDesign'));
  };

  // ... Rest of the component logic remains the same

  return (
    <div
      className="design-details-ai-wrapper"
      style={{
        direction: getLayoutDirection(i18n.language),
      }}
    >
      {!isDesignObjectLoaded ? (
        <Loading />
      ) : (
        <>
          <DesignHeader />
          <DesignRating />
          <div className="need-designer-wrapper">
            <div className="need-designer-content">
              <div className="need-designer-title">
                <p>{t(NEED_DESIGNER)}</p>
                <img src={AIHeaderIMage} alt="" />
              </div>

              <p className="need-designer-subtitle">{t(NEED_DESIGNER_TEXT)}</p>
            </div>
            {isRequestSuccess ? (
              <div className="success-wrapper">
                <img src={aiIcons.success} alt="" />
                <p>{t(REQUEST_SUCCESSFULLY_RECEIVED)}</p>
              </div>
            ) : (
              <button onClick={() => setModalVisible(true)}>{t(SEND_TO_MANZILIK)}</button>
            )}
          </div>
          <PhoneNumberModal
            isModalVisible={modalVisible}
            setIsModalVisible={setModalVisible}
            onRequest={sendRequest}
            onPhoneNumberChange={(v) => {
              setValue(v);
            }}
            onDescriptionChange={(v) => {
              setDescription(v);
            }}
          />
          {isReferralFlagOn && <Referral />}

          <div className="why-manzilik-wrapper">
            <div className="why-manzilik-header">
              <p className="why-manzilik-title">{t(WHY_MANZILIK)}</p>
              <p className="why-manzilik-subtitle">{t(WHY_MANZILIK_TEXT)}</p>
            </div>
            <div className="why-manzilik-content">
              <div className="why-manzilik-item">
                <img src={SaveTime} alt="" />
                <div className="item-content">
                  <p className="why-manzilik-item-title">{t(SAVE_TIME_EFFORT)}</p>
                  <p className="why-manzilik-item-subtitle">{t(SAVE_TIME_EFFORT_TEXT)}</p>
                </div>
              </div>
              <div className="why-manzilik-item">
                <img src={ImproveDesigns} alt="" />
                <div className="item-content">
                  <p className="why-manzilik-item-title">{t(IMPROVE_DESIGN)}</p>
                  <p className="why-manzilik-item-subtitle">{t(IMPROVE_DESIGN_TEXT)}</p>
                </div>
              </div>
              <div className="why-manzilik-item">
                <img src={PredictFuture} alt="" />
                <div className="item-content">
                  <p className="why-manzilik-item-title">{t(PREDICT_FUTURE)}</p>
                  <p className="why-manzilik-item-subtitle">{t(PREDICT_FUTURE_TEXT)}</p>
                </div>
              </div>
              <div className="why-manzilik-item">
                <img src={CustomizeDesign} alt="" />
                <div className="item-content">
                  <p className="why-manzilik-item-title">{t(CUSTOMIZE_DESIGN)}</p>
                  <p className="why-manzilik-item-subtitle">{t(CUSTOMIZE_DESIGN_TEXT)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="packages">
            <PackageDetails withHeader />
          </div>
        </>
      )}
    </div>
  );
}

export default DesignDetails;
