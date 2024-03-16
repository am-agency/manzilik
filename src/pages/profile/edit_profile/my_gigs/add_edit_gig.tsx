import { AutoComplete, Button, Col, Form, Input, Row, Select, Switch, Typography } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useGigsForm } from './hooks/useGigsForm';
import {
  AVAILABLE,
  CANCEL,
  CITY,
  LETTER,
  NOT_AVAILABLE,
  SAR,
  SAVE_SERVICE,
  SELECT_SERVICE,
  SELECT_SERVICE_TYPE,
  SERVICE_ADDRESS,
  SERVICE_CITIES,
  SERVICE_DESC_ONE,
  SERVICE_DESC_TWO,
  SERVICE_PRICE,
  SERVICE_STATUS,
  START_NOW,
  TO_CONTINUE_FOLLOW_DETAILS,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { FormatterProps } from '../../../contact_us/components/contact_form';
import { UploadImage } from '../../../professionals/request_professional_service/uploadAssets/upload_image';
import { City, Service } from '../../../../API';
import { useCitiesByCountry } from '../../../professionals/hooks/useCitiesByCountry';
import { getLayoutDirection } from '../../../../app/layouts';
import { useGigsServices } from './hooks/useGigsServices';
import { GigsListItem, PageViews, SubmitServiceRequestStatus } from './types';
import { useGigsSuggestions } from './hooks/useGigsSuggestions';
import { debounceFunction } from '../../../../utils';
import { useNotification } from '../../../../hooks/useNotification';
import * as analytics from '../../../../analytics';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import TutorialCard from '../../../../components/tutorial_card';
import { TutorialContext, TutorialInterface } from '../../../../context/tutorial_context';

interface AddEditGigProps {
  setCurrentView: Function;
  currentView?: string;
  selectedGig?: GigsListItem;
}

const AddEditGig = (props: AddEditGigProps) => {
  const { setCurrentView, currentView, selectedGig } = props;
  const { t, i18n } = useTranslation();
  const { form, DEFAULT_FORM_VALUE, validation, setPhotos, getFormValue, setFormField, clearForm, isAllFilled } =
    useGigsForm();
  const [currentProfessional, setCurrentProfessional] = React.useState(null);
  const [services, setServices] = useState<Service[]>([]);
  const [value, setValue] = useState('');
  const [submitStatus, setSubmitStatus] = useState<SubmitServiceRequestStatus>(SubmitServiceRequestStatus.NOT_SENT);
  const { requestAddGigService, requestEditGigService } = useGigsServices();
  const [isEnabled, setIsEnabled] = useState(true);
  const { cities, selectCitiesById, selectedCities, debouncedSearch } = useCitiesByCountry();
  const [options, setOptions] = useState<{ value: string }[]>([]);
  const [isUserUsedSuggestions, setIsUserUsedSuggestions] = useState(false);
  const { getGigsSuggestions, suggestions } = useGigsSuggestions();
  const isEditMode = currentView === PageViews.EDIT;
  const { isListServicesLoading, listOfServices } = useContext(SharedStateContext) as SharedStateInterface;
  const { currentStep, disableTutorial, stepIncremental, setPointerPosition } = useContext(
    TutorialContext
  ) as TutorialInterface;

  useEffect(() => {
    stepIncremental!(4);
    setPointerPosition!('top');
  }, []);
  useEffect(() => {
    if (selectedGig && isEditMode) {
      const selectedCities = selectedGig.cities.map((city) => city.id);
      const selectedServices = selectedGig.services.map((service) => service.id);
      setFormField('id', selectedGig.id);
      setFormField('title', selectedGig.title);
      setFormField('description', selectedGig.description);
      setFormField('cities', selectedCities);
      setFormField('services', selectedServices);
      setFormField('price', selectedGig.price);
      setFormField('is_enabled', selectedGig.is_enabled);
      setIsEnabled(selectedGig.is_enabled);
    } else {
      clearForm();
    }
  }, [selectedGig]);

  const getProfessionalFromLocalStorage = () => {
    const professional = localStorage.getItem('Professional');
    if (professional) {
      const professionalObject = JSON.parse(professional);
      const coverageCities = professionalObject?.locations?.map((city: City) => city.id);
      if (currentView === PageViews.ADD) {
        setFormField('cities', coverageCities);
      }
      setCurrentProfessional(professionalObject);
      if (professionalObject?.is_profile_completed) {
        setServices(professionalObject?.services);
      } else {
        if (!isListServicesLoading!) {
          setServices(listOfServices!);
        }
      }
    }
  };

  useEffect(() => {
    getProfessionalFromLocalStorage();
  }, []);

  const onSelect = (data: string) => {
    const selectedSuggestion = suggestions.filter((suggestion) => suggestion.title === data);
    if (selectedSuggestion.length === 0) {
      setIsUserUsedSuggestions(false);
      return;
    }
    setFormField('price', selectedSuggestion[0].price!);
    setFormField('description', selectedSuggestion[0].description!);
  };

  const debouncedSuggestionsSearch = debounceFunction((value: string) => {
    if (value.length === 0) {
      return;
    } else {
      getGigsSuggestions(value);
    }
  }, 500);
  const onChange = (data: string) => {
    setValue(data);
    debouncedSuggestionsSearch(data);
  };
  const selectedCitiesId = useMemo(() => {
    return selectedCities.map((city) => city.id);
  }, [selectedCities]);

  const onCityChange = (values: string[]) => {
    selectCitiesById(values);
  };
  const langDirection = getLayoutDirection(i18n.language);

  useEffect(() => {
    setOptions(suggestions.map((suggestion) => ({ value: suggestion.title! })));
  }, [suggestions]);

  const onRequest = async () => {
    await form.validateFields();
    const { title, description, cities, photos, services, price, is_enabled } = getFormValue();
    try {
      await requestAddGigService({
        title,
        description,
        cities,
        photos,
        services,
        price,
        is_enabled,
      });
      setSubmitStatus(SubmitServiceRequestStatus.SUCCESS);
      setCurrentView(PageViews.LIST);
      if (isUserUsedSuggestions) {
        analytics.PublishEvent(new analytics.AnalyticsAddGigEvent(services[0], 'suggested', title));
      } else {
        analytics.PublishEvent(new analytics.AnalyticsAddGigEvent(services[0], 'new', title));
      }
    } catch (error) {
      setSubmitStatus(SubmitServiceRequestStatus.FAILED);
    }
  };
  const onUpdate = async () => {
    await form.validateFields();
    const { title, description, cities, photos, services, price, is_enabled, id } = getFormValue();
    try {
      await requestEditGigService({
        id,
        title,
        description,
        cities,
        photos,
        services,
        price,
        is_enabled,
      });
      setSubmitStatus(SubmitServiceRequestStatus.SUCCESS);
      setCurrentView(PageViews.LIST);
    } catch (error) {
      setSubmitStatus(SubmitServiceRequestStatus.FAILED);
    }
  };

  const requiredTag = (label: string) => {
    return (
      <p>
        {label}
        <span className="required-input">*</span>
      </p>
    );
  };

  return (
    <section className="gigs-form">
      <Form className="stretch" form={form} initialValues={DEFAULT_FORM_VALUE}>
        <Row>
          <Col xs={24} md={11}>
            <div className="service-type-container">
              <Form.Item
                label={requiredTag(t(SELECT_SERVICE))}
                name="services"
                rules={[validation.required()]}
                validateTrigger="onChange"
              >
                <Select
                  showArrow
                  showSearch
                  maxTagCount="responsive"
                  placeholder={t(SELECT_SERVICE_TYPE)}
                  optionFilterProp="label"
                >
                  {services?.map((service) => (
                    <Select.Option key={service.id} value={service.id!} label={service?.title}>
                      {service.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {currentStep === 4 && !disableTutorial ? (
                <TutorialCard left="60%" top="110%" title={t(TO_CONTINUE_FOLLOW_DETAILS)} buttonText={t(START_NOW)} />
              ) : null}
            </div>
            <Form.Item
              label={requiredTag(t(SERVICE_ADDRESS))}
              name="title"
              rules={[validation.required()]}
              validateTrigger="onChange"
            >
              <AutoComplete
                options={options}
                onSelect={onSelect}
                onSearch={(text) => setOptions(text ? [{ value: text }] : [])}
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item label={requiredTag(t(SERVICE_DESC_ONE))} name="description" rules={[validation.required()]}>
              <Input.TextArea maxLength={144} placeholder={t(SERVICE_DESC_TWO)} showCount />
            </Form.Item>
            <Form.Item
              className="clear-spacing"
              label={requiredTag(t(SERVICE_PRICE))}
              name="price"
              rules={[validation.required()]}
            >
              <Input suffix={t(SAR)} />
            </Form.Item>
          </Col>
          <Col span={2}></Col>
          <Col xs={24} md={11}>
            <Form.Item label={requiredTag(t(SERVICE_CITIES))} name="cities" rules={[validation.required()]}>
              <Select
                placeholder={t(CITY)}
                mode="multiple"
                showSearch
                showArrow
                onChange={onCityChange}
                onSearch={debouncedSearch}
                maxTagCount="responsive"
                optionFilterProp={'label'}
                value={selectedCitiesId}
              >
                {cities.map((city) => (
                  <Select.Option value={city.id} label={city.name} key={city.id} className={langDirection}>
                    {city.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <UploadImage
              onChange={setPhotos}
              maxCount={3}
              defaultImages={
                selectedGig && isEditMode
                  ? selectedGig?.photos?.map((photo) => {
                      return photo;
                    })
                  : []
              }
            />

            <div className="gig-status">
              <Typography.Title level={5}>{t(SERVICE_STATUS)}</Typography.Title>
              <div className="gig-container">
                <Typography.Text className="status-text">{isEnabled ? t(AVAILABLE) : t(NOT_AVAILABLE)}</Typography.Text>
                <Switch
                  defaultChecked={isEnabled}
                  checked={isEnabled}
                  onChange={(checked) => {
                    setIsEnabled(checked);
                    setFormField('is_enabled', checked);
                  }}
                />
              </div>
            </div>

            <Row className="footer-actions">
              <Col span={15}>
                <Button
                  type="primary"
                  onClick={isEditMode ? onUpdate : onRequest}
                  block
                  className={`${!isAllFilled() ? 'disabled-btn' : ''}`}
                >
                  {t(SAVE_SERVICE)}
                </Button>
              </Col>
              <Col span={1}></Col>
              <Col span={8}>
                <Button className="cancel-btn" block onClick={() => setCurrentView(PageViews.LIST)}>
                  {t(CANCEL)}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </section>
  );
};

export default AddEditGig;
