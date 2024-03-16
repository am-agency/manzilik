import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Form, Input, Row, Typography } from 'antd';
import CountryPhoneInput, { ConfigProvider } from 'antd-country-phone-input';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import icons from '../../../../assets/icons';
import { AR } from '../../../../locales/constants';
import en from 'world_countries_lists/data/countries/en/world.json';
import ar from 'world_countries_lists/data/countries/ar/world.json';
import 'antd-country-phone-input/dist/index.css';

import {
  ADDITIONAL_INFO,
  CITY,
  CONTACT_INFO,
  PRICE,
  PROFESSIONAL,
  REQUEST_SERVICE_INFO,
  SEND_SERVICE_REQUEST_NOW,
  SERVICE_DESCRIPTION,
  TELEPHONE_NUMBER,
  WHATSAPP_NUMBER,
} from '../../../../locales/strings';

import {
  RequestProfessionalServiceFeedback,
  SubmitServiceRequestStatus,
} from '../../../professionals/request_professional_service/request_professional_service_feedback';
import { UploadImage } from '../../../professionals/request_professional_service/uploadAssets/upload_image';
import { useMainContext } from '../../../../app/providers/main';
import { useRequestGigServiceForm } from '../../hooks/useRequestGigServiceForm';
import AvatarCard from '../../../../components/avatar_card';
import { GigService } from '../../../../API';
import { GigsStepsContext } from '../../../../context/gigs_steps_context';
import { Loading } from '../../../../components/loading';
import TextWithIcon from '../../../../components/text_with_icon';
import { useRequestProfessionalService } from '../../../professionals/request_professional_service/hooks/useRequestProfessionalService';
import { ServiceInquiryOutput } from '../../../professionals/request_professional_service/types';
import Loader from 'react-spinners/ClipLoader';
import * as analytics from '../../../../analytics';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';

const StepFive = () => {
  const { t, i18n } = useTranslation();
  const contextValue = useContext(GigsStepsContext);
  const { currentScreenName } = useContext(SharedStateContext) as SharedStateInterface;

  const location = useLocation();
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [requestId, setRequestId] = useState<string | undefined>();
  const [renderedSelectedServiceItem, setRenderedSelectedServiceItem] = useState<GigService | null>(null);
  const selectedServiceItemFromLocalStorage = localStorage.getItem('selectedServiceItem');
  const [isClearPhotos, setIsClearPhotos] = useState<boolean>(false);

  const { requestProfessionalService } = useRequestProfessionalService();
  const { requestApi, professional } = useMainContext();
  const [submitStatus, setSubmitStatus] = useState<SubmitServiceRequestStatus>(SubmitServiceRequestStatus.NO_SENT);

  const {
    form,
    setPhotos,
    getFormValue,
    DEFAULT_FORM_VALUE,
    validation,
    setFormField,
    resetWhatsappNumber,
    resetPhoneNumber,
  } = useRequestGigServiceForm();

  if (!contextValue) {
    return <Loading />;
  }
  const { selectedServiceItem, selectedCityId, selectedService, selectedCityName } = contextValue;

  const selectedCity = useMemo(() => {
    return renderedSelectedServiceItem?.cities?.filter((item) => item?.id == selectedCityId)[0]?.name || '';
  }, [selectedCityId, renderedSelectedServiceItem]);

  useEffect(() => {
    if (selectedServiceItem) {
      setRenderedSelectedServiceItem(selectedServiceItem);
    }
  }, [selectedServiceItem]);

  useEffect(() => {
    if (selectedServiceItemFromLocalStorage) {
      setRenderedSelectedServiceItem(JSON.parse(selectedServiceItemFromLocalStorage));
    } else {
      setRenderedSelectedServiceItem(selectedServiceItem!);
    }
  }, [selectedServiceItem, selectedServiceItemFromLocalStorage]);
  const onRequest = async () => {
    await form.validateFields();

    setPendingSubmit(true);

    const { description, phone_number, photos, professional_id, whatsapp_number } = getFormValue();

    requestApi(
      requestProfessionalService,
      {
        professional_id: selectedServiceItem?.professional?.id || '',
        description: description || ' ',
        categories: [],
        services: selectedServiceItem?.services?.map((item) => item?.id || ''),
        photos,
        phone_number: phone_number.phone ? `${phone_number.code}${phone_number.phone}` : '',
        whatsapp_number: whatsapp_number.phone ? `${whatsapp_number.code}${whatsapp_number.phone}` : '',
        city: selectedCityId || '',
        gig_input: {
          id: selectedServiceItem?.id,
          title: selectedServiceItem?.title,
          price: selectedServiceItem?.price,
          description: selectedServiceItem?.description,
        },
      },
      (response: ServiceInquiryOutput, error: string) => {
        if (error) {
          setSubmitStatus(SubmitServiceRequestStatus.FAILED);
          return;
        }
        setSubmitStatus(SubmitServiceRequestStatus.SUCCESS);
        setRequestId(response.id);
        setPendingSubmit(false);

        analytics.PublishEvent(
          new analytics.AnalyticsSubmitGig(
            selectedService?.title!,
            selectedCityName!,
            selectedServiceItem?.id!,
            selectedServiceItem?.title!,
            selectedServiceItem?.professional?.id!,
            currentScreenName
          )
        );
      }
    );
  };

  const retry = () => {
    setSubmitStatus(SubmitServiceRequestStatus.NO_SENT);
    // onRequest();
  };

  return (
    <div className="step-five">
      <section className="request-service-container">
        <ConfigProvider
          locale={i18n.language === AR ? ar : en}
          areaMapper={(area) => {
            if (area.name?.includes('Saudi Arabia') || area.name?.includes('السعودية')) {
              return {
                ...area,
                emoji: <img src={icons.saudi_arabia_flag.icon} className="area-emoji" />,
              };
            }
            return area;
          }}
        >
          <section className="request-service-form">
            <div className="header">
              <p className="header-title">{t(REQUEST_SERVICE_INFO)} </p>
              <div className="header-content">
                {/* <AvatarCard
                  imageUrl={renderedSelectedServiceItem?.professional?.company_logo!}
                  name={renderedSelectedServiceItem?.professional?.company_name!}
                  title={t(PROFESSIONAL)}
                  rate={renderedSelectedServiceItem?.professional?.reviews_count!}
                  rateFontSize={'10px'}
                  onNameClick={() => {
                    window.open(`/professional/${renderedSelectedServiceItem?.professional?.id}`, '_blank');
                  }}
                /> */}
                <div className="info">
                  <h3>{renderedSelectedServiceItem?.title}</h3>
                  <div className="icons-wrapper">
                    <div>
                      <TextWithIcon icon={icons.my_gigs.price_icon} text={t(PRICE)} />
                      <span className="price">{renderedSelectedServiceItem?.price}</span>
                    </div>
                    <div className="divider" />
                    <div>
                      <TextWithIcon icon={icons.my_gigs.square_pin} text={t(CITY)} />
                      <span className="city">{selectedCity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Row>
              <Form className="stretch" form={form} initialValues={DEFAULT_FORM_VALUE}>
                <Typography.Title className="form-title">{t(CONTACT_INFO)}</Typography.Title>
                <Form.Item
                  name="phone_number"
                  label={t(TELEPHONE_NUMBER)}
                  rules={[validation.required(), validation.phone(t)]}
                >
                  <CountryPhoneInput type="number" />
                </Form.Item>

                <Form.Item name="whatsapp_number" label={t(WHATSAPP_NUMBER)}>
                  <CountryPhoneInput type="number" />
                </Form.Item>
                <Typography.Title className="form-title">{t(ADDITIONAL_INFO)}</Typography.Title>
                <UploadImage onChange={setPhotos} maxCount={5} clearPhotos={isClearPhotos} />
                <Form.Item label={t(SERVICE_DESCRIPTION)} name="description">
                  <Input.TextArea minLength={50} maxLength={400} showCount />
                </Form.Item>

                <Button className="submit-btn" type="primary" block onClick={onRequest} disabled={pendingSubmit}>
                  {t(SEND_SERVICE_REQUEST_NOW)}
                  {pendingSubmit && <Loader color="#fff" size={20} />}
                </Button>
              </Form>
            </Row>
          </section>
          <RequestProfessionalServiceFeedback
            status={submitStatus}
            retry={retry}
            onClose={() => {
              setSubmitStatus(SubmitServiceRequestStatus.NO_SENT);
              setFormField('description', '');
              resetWhatsappNumber();
              resetPhoneNumber();
              setIsClearPhotos(true);
              setTimeout(() => {
                setIsClearPhotos(false);
              }, 1000);
            }}
            requestId={requestId}
          />
        </ConfigProvider>
      </section>
    </div>
  );
};

export default StepFive;
