import { Col, Form, FormInstance, Input, Row, Select, Typography } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { City, ClientAddress, Country, Neighborhood } from '../../../../../../API';
import i18n from '../../../../../../app/i18n';
import { getLayoutDirection } from '../../../../../../app/layouts';
import { useMainContext } from '../../../../../../app/providers/main';
import {
  ADDRESS_DETAILS,
  ADDRESS_TITLE,
  CITY,
  COUNTRY,
  EMAIL,
  FULL_NAME,
  MOBILE,
  NEIGHBORHOOD,
} from '../../../../../../locales/strings';
import { toArrayOrEmpty } from '../../../../../idea/utils';
import { required } from '../../../../../projects/add_new_project';
import { getNeighborhoods, listCities, listCountries } from '../../../../api';
import CountriesList from '../../../../../../components/countries_list';
import CitiesList from '../../../../../../components/cities_list';
import NeighborhoodsList from '../../../../../../components/neighborhoods_list';

interface Props {
  onFinish: Function;
  form: FormInstance;
  address: ClientAddress;
  type?: string;
}

export const AddAddress: FunctionComponent<Props> = ({ onFinish, address, form, type }: Props) => {
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [cityId, setCityId] = useState<string>();
  const [countryId, setCountryId] = useState<string>();
  const { city, country, name, neighborhood, description, phone_number, email, first_name, last_name } = address || {};

  const getCountries = () => {
    requestApi(listCountries, { offset: 0, limit: 100 }, (response: Country[], error: string) => {
      if (error) {
        return;
      }
      setCountries(toArrayOrEmpty(response));
    });
  };

  const listCitiesOfCountry = (resourceId: string) => {
    setCountryId(resourceId);
    requestApi(listCities, { resourceId, offset: 0, limit: 100 }, (response: City[], error: string) => {
      if (error) {
        return;
      }
      setCities(toArrayOrEmpty(response));
    });
  };

  const listNeighborhoods = (resourceId: string) => {
    requestApi(
      getNeighborhoods,
      { limit: 100, offset: 0, resourceId },
      (response: { results: Neighborhood[] }, error: string) => {
        if (error) {
          return;
        }
        setNeighborhoods(response.results);
      }
    );
  };

  const onCityChange = (value: string) => {
    cities?.forEach((elm) => {
      if (elm.name === value) {
        listNeighborhoods(elm.id);
        form.setFieldsValue({ neighborhood: '' });
      }
    });
  };

  const onCountryChange = (value: string) => {
    countries?.forEach((elm) => {
      if (elm.name === value) {
        requestApi(listCitiesOfCountry, elm.id);
        form.setFieldsValue({ city: '', neighborhood: '' });
      }
    });
  };

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    if (city?.id) {
      setCityId(city?.id);
    }
    if (country?.id) {
      setCountryId(country.id);
    }

    form?.setFieldsValue({
      city: city?.id,
      country: country?.id,
      name,
      neighborhood: neighborhood?.id,
      description,
      phone_number,
      fullname: `${first_name || ''} ${last_name || ''}`,
      email,
    });
  }, [address, form]);

  return (
    <Form
      form={form}
      layout="horizontal"
      validateTrigger="onChange"
      className="complete-profile form address-form"
      onFinish={(values) => onFinish({ city: cityId, country: countryId, type, id: address?.id, ...values })}
    >
      <Typography.Text className="field-txt">
        <span>{t(FULL_NAME)} </span>
      </Typography.Text>
      <Form.Item name="fullname" className="title-item">
        <Input />
      </Form.Item>
      <Row gutter={20}>
        <Col span={12}>
          <Typography.Text className="field-txt"> {t(MOBILE)} </Typography.Text>
          <Form.Item name="phone_number">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Typography.Text className="field-txt"> {t(EMAIL)}</Typography.Text>
          <Form.Item name="email">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Typography.Text className="field-txt">
        <span>{t(ADDRESS_TITLE)} </span>
      </Typography.Text>
      <Form.Item name="name" className="title-item" rules={[required]}>
        <Input />
      </Form.Item>
      <Typography.Text className="field-txt">{t(COUNTRY)}</Typography.Text>
      <Form.Item name="country" rules={[required]}>
        <CountriesList
          selectedCountryId={countryId}
          getCountryId={(id: string) => {
            setCountryId(id);
            form.setFieldsValue({ country: id });
          }}
        />
      </Form.Item>
      <Row gutter={20}>
        <Col span={12}>
          <Typography.Text className="field-txt"> {t(CITY)}</Typography.Text>
          <Form.Item name="city" rules={[required]}>
            <CitiesList
              resourceId={countryId}
              selectedCityId={cityId}
              getCityId={(id: string) => {
                setCityId(id);
                form.setFieldsValue({ city: id });
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Typography.Text className="field-txt"> {t(NEIGHBORHOOD)}</Typography.Text>
          <Form.Item name="neighborhood" rules={[required]}>
            <NeighborhoodsList
              resourceId={cityId}
              getNeighborhoodId={(id: string) => {
                form.setFieldsValue({ neighborhood: id });
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Typography.Text className="field-txt">{t(ADDRESS_DETAILS)}</Typography.Text>
      <Form.Item name="description">
        <Input />
      </Form.Item>
    </Form>
  );
};
