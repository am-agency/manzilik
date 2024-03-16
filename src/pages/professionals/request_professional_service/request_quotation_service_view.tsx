/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Space, Tabs, Typography } from 'antd';
import CountryPhoneInput, { ConfigProvider } from 'antd-country-phone-input';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import i18n from '../../../app/i18n';
import icons from '../../../assets/icons';
import { AR } from '../../../locales/constants';
import en from 'world_countries_lists/data/countries/en/world.json';
import ar from 'world_countries_lists/data/countries/ar/world.json';
import 'antd-country-phone-input/dist/index.css';

import {
  ACTIVE_REPUBLISH,
  BUDGET,
  BUDGET_EXAMPLE,
  CITY,
  CONGRATS,
  CONTACT_INFO,
  CREATE_A_PROJECT,
  CREATE_A_PROJECT_TEXT,
  INCLUDED_FEES,
  LETTER,
  NEXT_STEP,
  PAYMENT,
  PAY_SERVICE_VALUE,
  POST_IT_NOW,
  REFUND2,
  REQUEST_FOR_QUOTATION,
  SELECT_CATEGORY,
  SELECT_PAYMENT_METHOD,
  SELECT_SERVICE,
  SEND_SERVICE_REQUEST_NOW,
  SERVICE_CITIES,
  SERVICE_DESCRIPTION,
  SERVICE_FORM,
  SERVICE_INFO,
  SUBMIT_A_PRICE_REQUEST,
  TELEPHONE_NUMBER,
  VAT_INCLUDED,
  WHATSAPP_NUMBER,
  YOUR_MANZILIK_ORDER,
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
import { RequestQuotationFeedback } from './request_quotation_feedback';
import RfqModalImage from '../../../assets/images/rfq-modal.svg';
import MoreInfoBtn from '../../requests_for_quotations/components/rfq_card/more_info_btn';
import Loader from 'react-spinners/ClipLoader';
import { Client, ServiceInquiry } from '../../../API';
import { act } from 'react-dom/test-utils';
import GiftCard from './components/gift_card';
import RfqPriceCard from './components/rfq_price_card';
import IconWithText from '../../../components/icon_with_text';
import { aiIcons } from '../../../assets/icons/ai';
import { useMediaQuery } from 'react-responsive';
import { CreditCheckout } from '../../manzilik_ai/ai_checkout/components/package_card/credit_checkout';
import { CheckoutTypes } from '../../../constants';
import { getClientDraftServiceInquiry } from '../../profile/api';
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
  const [draftRfq, setDraftRfq] = useState<ServiceInquiry>();
  const [isFormValid, setIsFormValid] = useState(false);
  const [cityId, setCityId] = useState('');
  const [countryId, setCountryId] = useState('');

  const { requestApi } = useMainContext();
  const [submitStatus, setSubmitStatus] = useState<SubmitServiceRequestStatus>(SubmitServiceRequestStatus.NO_SENT);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const {
    defaultCountry,
    listOfServices,
    canceledServiceInquires,
    setCanceledServiceInquires,
    aiRfqInquiry,
    setAiRfqInquiry,
  } = useContext(SharedStateContext) as SharedStateInterface;
  const { client: userData, initClient } = useClient();
  const { TabPane } = Tabs;
  const [activeStep, setActiveStep] = useState(1);
  const canUserCreateFreeRequest = userData?.can_create_free_rfq;
  const history = useHistory();
  const onHandleTabClick = (key: string) => {
    setActiveStep(Number(key));
  };
  const { submitWithoutValidation } = useCompletePersonalProfile();

  const { categories, professional, requestForQuotation, services, setProfessionalId } =
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

  const getDraftRfq = () => {
    requestApi(getClientDraftServiceInquiry, {}, (client: Client, error: string) => {
      if (error) {
        return;
      }
      const draftRfq = client?.draft_service_inquiry;
      setDraftRfq(draftRfq!);
      setRequestId(draftRfq?.id!);
    });
  };

  useEffect(() => {
    getDraftRfq();
  }, []);

  useEffect(() => {
    if (aiRfqInquiry) {
      const {
        budget_limits,
        categories: allCategories,
        description,
        phone_number,
        photos,
        services,
        whatsapp_number,
        city,
      } = aiRfqInquiry;

      setFieldValue('budget_limits', budget_limits!);
      setFieldValue('city', city?.id!);
      setCityId(city?.id!);
      setFieldValue('description', description!);
      setFieldValue('categories', allCategories?.results?.map((category) => category?.id) as any);
      setFieldValue('services', services as any);
      setFieldValue('phone_number', {
        phone: phone_number?.substring(3, phone_number?.length),
      } as any);
      setFieldValue('whatsapp_number', {
        phone: whatsapp_number?.substring(3, whatsapp_number?.length),
      } as any);
    }

    return () => {
      setAiRfqInquiry!(undefined);
    };
  }, [aiRfqInquiry]);

  useEffect(() => {
    if (draftRfq && !canceledServiceInquires) {
      const {
        budget_limits,
        categories: allCategories,
        description,
        phone_number,
        photos,
        services,
        whatsapp_number,
        city,
      } = draftRfq;

      setFieldValue('budget_limits', budget_limits!);
      setFieldValue('city', city?.id!);
      setFieldValue('description', description!);
      setFieldValue('categories', allCategories?.results?.map((category) => category?.id) as any);
      setFieldValue('services', services?.results?.map((service) => service?.id) as any);
      setFieldValue('phone_number', {
        phone: phone_number?.substring(3, phone_number?.length),
      } as any);
      setFieldValue('whatsapp_number', {
        phone: whatsapp_number?.substring(3, whatsapp_number?.length),
      } as any);
    }
  }, [draftRfq]);

  useEffect(() => {
    if (canceledServiceInquires) {
      const {
        budget_limits,
        categories: allCategories,
        description,
        phone_number,
        photos,
        services,
        whatsapp_number,
        city,
      } = canceledServiceInquires;

      setFieldValue('budget_limits', budget_limits!);
      setFieldValue('city', city?.id!);
      setCityId(city?.id!);
      setFieldValue('description', description!);
      setFieldValue('categories', allCategories?.results?.map((category) => category?.id) as any);
      setFieldValue('services', services?.results?.map((service) => service?.id) as any);
      setFieldValue('phone_number', {
        phone: phone_number?.substring(3, phone_number?.length),
      } as any);
      setFieldValue('whatsapp_number', {
        phone: whatsapp_number?.substring(3, whatsapp_number?.length),
      } as any);
    }

    return () => {
      setCanceledServiceInquires!(undefined);
    };
  }, [canceledServiceInquires]);

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

  useEffect(() => {
    if (draftRfq) {
      setUploadedPhotos(draftRfq?.photos?.results?.map((photo) => photo?.photo) as any);
    } else if (canceledServiceInquires) {
      setUploadedPhotos(canceledServiceInquires?.photos?.results?.map((photo) => photo?.photo) as any);
    } else if (aiRfqInquiry) {
      setUploadedPhotos(aiRfqInquiry?.photos as any);
    }
  }, [draftRfq, canceledServiceInquires, aiRfqInquiry]);

  const onNextStepClick = () => {
    const { services, categories, description, budget_limits, phone_number, whatsapp_number, city, country } =
      form.getFieldsValue();

    if (!services || !categories || !description || !phone_number || !whatsapp_number) {
      return;
    } else {
      onHandleTabClick('2');
      onRequest();
    }
  };

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
      requestForQuotation,
      {
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
      (
        response: {
          data: {
            sendRFQ: ServiceInquiry;
          };
        },
        error: string
      ) => {
        if (error) {
          setSubmitStatus(SubmitServiceRequestStatus.FAILED);
          return;
        }

        setSubmitStatus(SubmitServiceRequestStatus.SUCCESS);
        setRequestId(response?.data?.sendRFQ?.id!);
        initClient();
      }
    );
    setPendingSubmit(false);
  };

  const onHandleFreeRequest = () => {
    if (requestId) {
      history.push(`/edit-profile/service-requests/${requestId}`);
    } else {
      history.push('/edit-profile/service-requests');
    }
  };

  const retry = () => {
    setSubmitStatus(SubmitServiceRequestStatus.NO_SENT);
    onRequest();
  };
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    // check if the form values are valid with some validation
    form
      .validateFields()
      .then(() => {
        setIsFormValid(true);
      })
      .catch(() => {
        setIsFormValid(false);
      });
  }, [form]);

  return (
    <section className={`request-service-container ${isMobile ? 'mobile' : ''}`}>
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
        <Row>
          <section className="request-service-form">
            <Tabs
              defaultActiveKey="1"
              activeKey={activeStep.toString()}
              centered
              className="quotation-tabs"
              onChange={onHandleTabClick}
            >
              <TabPane
                tab={
                  <>
                    <span className={`step-num ${activeStep === 1 ? 'active' : ''}`}>1</span>
                    <span className="step-name"> {t(SERVICE_FORM)}</span>
                  </>
                }
                key="1"
                active={activeStep === 1}
              >
                <Form className="stretch" form={form} initialValues={DEFAULT_FORM_VALUE}>
                  <p className="form-title">{t(SERVICE_INFO)}</p>
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
                      {listOfServices?.map((service) => (
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

                  <UploadImage
                    onChange={setPhotos}
                    maxCount={3}
                    defaultImages={
                      uploadedPhotos &&
                      (uploadedPhotos?.map((photo) => {
                        return photo;
                      }) as any)
                    }
                  />
                  <p className="form-title">{t(CONTACT_INFO)}</p>

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
                    <CountryPhoneInput
                      type="number"
                      onChange={(e: any) => {
                        setFieldValue('whatsapp_number', e);
                      }}
                    />
                  </Form.Item>

                  <Form.Item name="whatsapp_number" label={t(WHATSAPP_NUMBER)} className="phone-number">
                    <CountryPhoneInput type="number" />
                  </Form.Item>

                  <Button type="primary" block onClick={onNextStepClick} loading={pendingSubmit}>
                    {t(NEXT_STEP)}
                    {pendingSubmit && <Loader color="#fff" size={20} />}
                  </Button>
                </Form>
              </TabPane>
              <TabPane
                tab={
                  <>
                    <span className={`step-num ${activeStep === 2 ? 'active' : ''}`}>2</span>
                    <span className="step-name">{t(PAYMENT)}</span>
                  </>
                }
                active={activeStep === 2}
                key="2"
                disabled={activeStep === 1 && requestId === undefined}
              >
                {canUserCreateFreeRequest ? (
                  <>
                    <GiftCard title={t(YOUR_MANZILIK_ORDER)} message={t(CONGRATS)} />
                    <Button type="primary" block onClick={onHandleFreeRequest} loading={pendingSubmit}>
                      {t(ACTIVE_REPUBLISH)}
                      {pendingSubmit && <Loader color="#fff" size={20} />}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="form-title">{t(PAY_SERVICE_VALUE)}</p>
                    <p className="form-subtitle">{t(VAT_INCLUDED)}</p>

                    <RfqPriceCard actualPrice="100" discountPrice="40" />
                    <div className="hr-line"></div>
                    <IconWithText icon={aiIcons.checked} text={t(INCLUDED_FEES)} />
                    <IconWithText icon={aiIcons.checked} text={t(REFUND2)} />
                    <p className="form-title">{t(SELECT_PAYMENT_METHOD)}</p>
                    <CreditCheckout
                      selectedPackageId={'bc3ecf1a-59be-4166-a952-1f74ef0db208'}
                      checkoutType={CheckoutTypes.RFQ}
                      serviceInquiryId={requestId}
                    />
                  </>
                )}
              </TabPane>
            </Tabs>
          </section>
        </Row>
        <Row>
          <div className="rfq-header">
            <img src={RfqModalImage} alt="" />
            <p className="title">{t(REQUEST_FOR_QUOTATION)}</p>
            <p className="detail-item-create">
              <span>{t(CREATE_A_PROJECT_TEXT)}</span>
            </p>
            <MoreInfoBtn isBtnDisabled />
          </div>
        </Row>

        {/* <RequestQuotationFeedback
          status={submitStatus}
          retry={retry}
          onClose={() => {
            setSubmitStatus(SubmitServiceRequestStatus.NO_SENT);
            form.resetFields();
          }}
          requestId={requestId}
        /> */}
      </ConfigProvider>
    </section>
  );
};

export default withFeature(SERVICE_INQUIRY_FEATURE)(RequestProfessionalServiceView);
