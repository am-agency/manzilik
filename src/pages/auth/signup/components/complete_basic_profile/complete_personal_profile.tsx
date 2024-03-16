import { Button, Col, Form, Input, Row, Select, Typography } from 'antd';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../../app/i18n';
import UserForm from '../../../../../assets/images/UserForm.svg';
import Separator from '../../../../../components/separator';
import {
  CITY,
  COUNTRY,
  ENTER_FULL_NAME,
  FIRST_NAME,
  LAST_NAME,
  NAME_VERIFICATION_STEP,
  REQUIRED,
  SAVE_AND_CONTINUE,
} from '../../../../../locales/strings';
import { useCountries } from '../../../../professionals/hooks/useCountries';
import { PersonalProfileFields } from './hooks/useCompletePersonalProfile';
import CitiesList from '../../../../../components/cities_list';
import { getLayoutDirection } from '../../../../../app/layouts';
import { SharedStateContext, SharedStateInterface } from '../../../../../context/shared_state_context';

interface Props {
  onComplete: (fields: PersonalProfileFields) => void;
  profile: PersonalProfileFields;
  setProfile: React.Dispatch<React.SetStateAction<PersonalProfileFields>>;
  errors: Record<keyof PersonalProfileFields, string | null>;
  submit: () => Promise<PersonalProfileFields>;
  onInit: () => void;
}

export const CompletePersonalProfile = ({ onComplete, errors, profile, setProfile, submit, onInit }: Props) => {
  const { t } = useTranslation();
  const { countries, defaultCountry } = useCountries();
  const { defaultCountry: systemCountryId } = useContext(SharedStateContext) as SharedStateInterface;

  const selectedCountries = useMemo(() => (defaultCountry ? [defaultCountry] : []), [defaultCountry]);
  const [selectedCountryId, setSelectedCountryId] = useState(selectedCountries[0]?.id || '');

  useEffect(() => {
    onInit();
  }, []);

  const setCityId = (cityId: string) => [setProfile((pre) => ({ ...pre, cityId }))];

  return (
    <Row justify="center" className={`complete-basic-profile ${i18n.language}`}>
      <header>
        <Separator vertical={10} />
        <Row justify="center">
          <img src={UserForm} alt="user form" />
        </Row>
        <Separator vertical={10} />
        <Row justify="center">
          <Typography.Title level={5} className="title">
            {t(ENTER_FULL_NAME)}
          </Typography.Title>
        </Row>
        <Row justify="center">
          <Typography.Paragraph>{t(NAME_VERIFICATION_STEP)}</Typography.Paragraph>
        </Row>
        <Separator vertical={10} />
      </header>

      <Row gutter={10} style={{ width: '100%' }}>
        <Col span={12}>
          <Form.Item
            name="first_name"
            className="group-floating-label"
            rules={[{ required: true, message: t(REQUIRED) }]}
            initialValue={profile.first_name}
          >
            <Input
              className="signup-input form-input switch-input-wrapper"
              type="text"
              placeholder="."
              suffix={
                <>
                  <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="first_name">
                    {t(FIRST_NAME)}*
                  </label>
                </>
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="last_name"
            className="group-floating-label"
            rules={[{ required: true, message: t(REQUIRED) }]}
            initialValue={profile.last_name}
          >
            <Input
              className="signup-input form-input switch-input-wrapper"
              type="text"
              placeholder="."
              suffix={
                <>
                  <label className={`floating-label ${getLayoutDirection(i18n.language)}`} htmlFor="first_name">
                    {t(LAST_NAME)}*
                  </label>
                </>
              }
            />
          </Form.Item>
        </Col>
      </Row>

      <section className="country-city">
        <Row className="block-select vertical">
          <Typography.Text className="field-txt">
            {t(COUNTRY)} <span className="asterisk">*</span>
          </Typography.Text>
          <Select
            showSearch
            className="block-select-input"
            value={profile.countryId || selectedCountryId}
            onChange={(value) => {
              setSelectedCountryId(value);
              setProfile((pre) => ({ ...pre, countryId: value }));
            }}
          >
            {countries.map((country) => (
              <Select.Option key={country.id} value={country.id} title={country.id}>
                {country.name}
              </Select.Option>
            ))}
          </Select>
        </Row>

        <Separator vertical={10} />

        <Row className="block-select center">
          <Typography.Text className="field-txt">
            {t(CITY)} <span className="asterisk">*</span>
          </Typography.Text>
          <CitiesList
            resourceId={selectedCountryId || systemCountryId}
            selectedCityId={profile.cityId || ''}
            getCityId={setCityId}
          />
          <Form.Item validateStatus={errors.cityId ? 'error' : 'success'} help={errors.cityId}></Form.Item>
        </Row>
        <Separator vertical={10} />
      </section>

      <Button
        className={`complete-button ${i18n.language}`}
        key="complete-button"
        type="primary"
        block
        onClick={() => {
          submit().then(onComplete);
        }}
      >
        {t(SAVE_AND_CONTINUE)}
      </Button>
    </Row>
  );
};
