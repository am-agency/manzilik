import { Form, Row, Select, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { CITY, COUNTRY } from '../../locales/strings';
import Separator from '../separator';
import CitiesList from '../cities_list';
import { useCompletePersonalProfile } from '../../pages/auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';
import { useTranslation } from 'react-i18next';
import { useCountries } from '../../pages/professionals/hooks/useCountries';

interface Props {
  onChangeCountry?: (countryId: string) => void;
  onChangeCity?: (cityId: string) => void;
}

const CountryCityDropdowns: React.FC<Props> = (props) => {
  const { onChangeCity, onChangeCountry } = props;
  const { t } = useTranslation();
  const { errors, profile, setProfile } = useCompletePersonalProfile();
  const { countries, defaultCountry } = useCountries();
  const selectedCountries = useMemo(() => (defaultCountry ? [defaultCountry] : []), [defaultCountry]);
  const [selectedCountryId, setSelectedCountryId] = useState(selectedCountries[0]?.id || '');

  const setCityId = (cityId: string) => [setProfile((pre) => ({ ...pre, cityId }))];

  return (
    <div className="country-city-container">
      <section className="country-city">
        <Row className="block-select vertical">
          <Typography.Text className="field-txt">
            <span className="asterisk">*</span> {t(COUNTRY)}
          </Typography.Text>
          <Select
            showSearch
            className="block-select-input"
            value={profile.countryId || selectedCountryId}
            onChange={(value) => {
              setSelectedCountryId(value);
              setProfile((pre) => ({ ...pre, countryId: value }));
              onChangeCountry!(value);
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
            <span className="asterisk">*</span> {t(CITY)}
          </Typography.Text>
          <CitiesList
            resourceId={selectedCountryId || defaultCountry?.id || ''}
            selectedCityId={profile.cityId || ''}
            getCityId={(cityId: string) => {
              setCityId(cityId);
              onChangeCity!(cityId);
            }}
          />
        </Row>
        <Separator vertical={10} />
      </section>
    </div>
  );
};

export default CountryCityDropdowns;
