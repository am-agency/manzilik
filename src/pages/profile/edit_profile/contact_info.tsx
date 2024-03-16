import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Select, Typography } from 'antd';
import { CONTACT_INFORMATION, COUNTRY, CITY, STATE, ZIP, CANCEL, UPDATE } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { useMainContext } from '../../../app/providers/main';
import { listCities, listCountries } from '../api';
import { useForm } from 'antd/lib/form/Form';
import { City, Client, Country, EditClientProfileInput, Professional } from '../../../API';
import { toArrayOrEmpty } from '../../idea/utils';
import { getLayoutDirection } from '../../../app/layouts';
import { PrivateProfileHeader } from './components/profile_header';
import Separator from '../../../components/separator';
import CountriesList from '../../../components/countries_list';
import CitiesList from '../../../components/cities_list';
import { useClient } from '../../../app/hooks/use_client';
import { useHistory } from 'react-router-dom';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';

interface Props {
  onUpdateClientInformation: Function;
  client: Client;
}

export const ContactInfo: React.FunctionComponent<Props> = ({ onUpdateClientInformation, client }: Props) => {
  const { t, i18n } = useTranslation();
  const { requestApi, generalSettings } = useMainContext();
  const [form] = useForm();
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [countryId, setCountryId] = useState<string>();
  const [countryDefault, setCountryDefault] = useState<string>();
  const [cityDefault, setCityDefault] = useState<string>();
  const [cityId, setCityId] = useState<string>();
  const { client: userData } = useClient();
  const [professionalData, setProfessionalData] = useState<Professional>();
  const history = useHistory();
  const { clientData, refreshGetClientData } = useContext(SharedStateContext) as SharedStateInterface;

  useEffect(() => {
    refreshGetClientData();
  }, []);

  useEffect(() => {
    if (clientData) {
      setCountryId(clientData?.country?.id);
      setCityId(clientData?.city?.id);
    }
  }, [clientData]);
  useEffect(() => {
    localStorage.getItem('Professional') && setProfessionalData(JSON.parse(localStorage.getItem('Professional')!));
  }, []);

  const onFinish = (values: EditClientProfileInput) => {
    onUpdateClientInformation({ city_id: cityId, country_id: countryId, state: values.state, zip: values.zip });
  };

  return (
    <Form name="basic" form={form} onFinish={onFinish} className="form account-info">
      <PrivateProfileHeader title={t(CONTACT_INFORMATION)} />
      <Separator vertical={15} />
      <Row>
        <Col span={22}>
          <Row gutter={20}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Typography.Text> {t(COUNTRY)}</Typography.Text>
              <Form.Item name="country" initialValue={client?.country?.name}>
                <CountriesList
                  selectedCountryId={countryId}
                  getCountryId={(id: string) => {
                    setCountryId(id);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Typography.Text> {t(CITY)}</Typography.Text>
              <Form.Item name="city" initialValue={client?.city?.name}>
                <CitiesList
                  resourceId={countryId}
                  selectedCityId={cityId}
                  getCityId={(id: string) => {
                    setCityId(id);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xl={20} lg={20} md={0} sm={0} xs={0} />
            <Col lg={4} xl={4} md={6} xs={12} sm={12}>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="submit-button">
                  {t(UPDATE)}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
