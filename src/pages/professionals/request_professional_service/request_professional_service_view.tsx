import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Form, Input, Row, Select, Space, Typography } from 'antd';
import CountryPhoneInput, { ConfigProvider } from 'antd-country-phone-input';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import i18n from '../../../app/i18n';
import icons from '../../../assets/icons';
import { AR } from '../../../locales/constants';
import en from 'world_countries_lists/data/countries/en/world.json';
import ar from 'world_countries_lists/data/countries/ar/world.json';
import 'antd-country-phone-input/dist/index.css';

import {
  BUDGET,
  BUDGET_EXAMPLE,
  CITY,
  LETTER,
  SELECT_CATEGORY,
  SELECT_SERVICE,
  SEND_SERVICE_REQUEST_NOW,
  SERVICE_CITIES,
  SERVICE_DESCRIPTION,
  SERVICE_INFO,
  TELEPHONE_NUMBER,
  WHATSAPP_NUMBER,
} from '../../../locales/strings';
import { FormatterProps } from '../../contact_us/components/contact_form';
import { useRequestProfessionalForm } from './hooks/useRequestProfessionalForm';
import { useRequestProfessionalService } from './hooks/useRequestProfessionalService';
import { UploadImage } from './uploadAssets/upload_image';
import { RequestProfessionalServiceHeader } from './request_professional_service_header';
import {
  RequestProfessionalServiceFeedback,
  SubmitServiceRequestStatus,
} from './request_professional_service_feedback';
import { REQUEST_PROFESSIONAL_SERVICE_ROUTE } from '../../../utils/routes';
import { withFeature } from 'flagged';
import { SERVICE_INQUIRY_FEATURE } from '../../../app/settings';
import { useMainContext } from '../../../app/providers/main';
import { ServiceInquiryOutput } from './types';
import CitiesList from '../../../components/cities_list';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import { useClient } from '../../../app/hooks/use_client';
import { useCompletePersonalProfile } from '../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import CountryCityDropdowns from '../../../components/country_city_dropdowns';

const professionalIdQueryKey = 'professional_id';

export const getRequestServiceUrl = (professiona_id: string) =>
  `${REQUEST_PROFESSIONAL_SERVICE_ROUTE}?${professionalIdQueryKey}=${professiona_id}`;

const RequestProfessionalServiceView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const [requestId, setRequestId] = useState<string | undefined>();
  const [cityId, setCityId] = useState('');
  const [countryId, setCountryId] = useState('');
  const { requestApi } = useMainContext();
  const [submitStatus, setSubmitStatus] = useState<SubmitServiceRequestStatus>(SubmitServiceRequestStatus.NO_SENT);
  const { defaultCountry } = useContext(SharedStateContext) as SharedStateInterface;
  const { client: userData } = useClient();

  const { submitWithoutValidation } = useCompletePersonalProfile();

  const { categories, professional, requestProfessionalService, services, setProfessionalId } =
    useRequestProfessionalService();

  const { form, setPhotos, setProfessionalIdFormField, getFormValue, DEFAULT_FORM_VALUE, validation, setFieldValue } =
    useRequestProfessionalForm();

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const professionalId = q.get(professionalIdQueryKey);
    if (professionalId) {
      setProfessionalId(professionalId);
      setProfessionalIdFormField(professionalId);
    }
  }, [location.search]);

  const getProfessionalCountryAndCity = () => {
    if (userData?.city?.id) {
      setCityId(userData.city.id);
      setFieldValue('city', userData.city.id);
    }
    if (userData?.country?.id) {
      setCountryId(userData.country.id);
      setFieldValue('country', userData.country.id);
    }
  };

  useEffect(() => {
    getProfessionalCountryAndCity();
  }, [userData]);

  const onRequest = async () => {
    await form.validateFields();
    await submitWithoutValidation({
      country_id: countryId,
      city_id: cityId,
    });

    setPendingSubmit(true);

    const {
      budget_limits,
      categories,
      description,
      phone_number,
      photos,
      professional_id,
      services,
      whatsapp_number,
      city,
      country,
    } = getFormValue();

    requestApi(
      requestProfessionalService,
      {
        professional_id,
        budget_limits,
        categories,
        description,
        photos,
        services,
        city,
        country,
        phone_number: phone_number.phone ? `${phone_number.code}${phone_number.phone}` : '',
        whatsapp_number: whatsapp_number.phone ? `${whatsapp_number.code}${whatsapp_number.phone}` : '',
      },
      (response: ServiceInquiryOutput, error: string) => {
        if (error) {
          setSubmitStatus(SubmitServiceRequestStatus.FAILED);
          return;
        }
        setSubmitStatus(SubmitServiceRequestStatus.SUCCESS);
        setRequestId(response.id);
      }
    );
    setPendingSubmit(false);
  };

  const retry = () => {
    setSubmitStatus(SubmitServiceRequestStatus.NO_SENT);
    onRequest();
  };

  return (
    <section className="request-service-container mobile">
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
          <RequestProfessionalServiceHeader professional={professional} />
          <Typography.Title className="form-title">{t(SERVICE_INFO)}</Typography.Title>
          <Row>
            <Form className="stretch" form={form} initialValues={DEFAULT_FORM_VALUE}>
              <Form.Item
                label={t(SELECT_SERVICE)}
                name="services"
                rules={[validation.required()]}
                validateTrigger="onChange"
              >
                <Select
                  mode="multiple"
                  showArrow
                  showSearch
                  size="large"
                  maxTagCount="responsive"
                  placeholder={t(SELECT_SERVICE)}
                  optionFilterProp="label"
                >
                  {services?.map((service) => (
                    <Select.Option key={service.id} value={service.id!} label={service?.title}>
                      {service.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={t(SELECT_CATEGORY)} name="categories" validateTrigger="onChange">
                <Select
                  mode="multiple"
                  showArrow
                  showSearch
                  size="large"
                  maxTagCount="responsive"
                  placeholder={t(SELECT_CATEGORY)}
                  optionFilterProp="label"
                >
                  {categories?.map((category) => (
                    <Select.Option key={category.id} value={category.id!} label={category?.title}>
                      {category.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label={t(SERVICE_DESCRIPTION)} name="description" rules={[validation.required()]}>
                <Input.TextArea
                  minLength={50}
                  showCount={{
                    formatter: ({ count }: FormatterProps) => `${count} ${t(LETTER)}`,
                  }}
                />
              </Form.Item>

              <Form.Item className="clear-spacing" label={t(BUDGET)} name="budget_limits" rules={[]}>
                <Input />
              </Form.Item>
              <Space className="item-hint">
                <ExclamationCircleFilled />
                <Typography.Text>{t(BUDGET_EXAMPLE)}</Typography.Text>
              </Space>

              <UploadImage onChange={setPhotos} />

              <CountryCityDropdowns
                onChangeCity={(cityId: string) => {
                  setCityId(cityId);
                  setFieldValue('city', cityId);
                }}
                onChangeCountry={(countryId: string) => {
                  setCountryId(countryId);
                  setFieldValue('country', countryId);
                }}
              />

              <Form.Item
                name="phone_number"
                label={t(TELEPHONE_NUMBER)}
                rules={[validation.required(), validation.phone(t)]}
                className="phone-number"
              >
                <CountryPhoneInput type="number" />
              </Form.Item>

              <Form.Item name="whatsapp_number" label={t(WHATSAPP_NUMBER)} className="phone-number">
                <CountryPhoneInput type="number" />
              </Form.Item>

              <Button type="primary" block onClick={onRequest} loading={pendingSubmit}>
                {t(SEND_SERVICE_REQUEST_NOW)}
              </Button>
            </Form>
          </Row>
        </section>
        <RequestProfessionalServiceFeedback
          status={submitStatus}
          retry={retry}
          onClose={() => setSubmitStatus(SubmitServiceRequestStatus.NO_SENT)}
          requestId={requestId}
        />
      </ConfigProvider>
    </section>
  );
};

export default withFeature(SERVICE_INQUIRY_FEATURE)(RequestProfessionalServiceView);
