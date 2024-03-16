import React, { useState, useEffect } from 'react';
import { Empty, Select } from 'antd';
import { useMainContext } from '../../app/providers/main';
import { listCities, listCountries } from '../../pages/profile/api';
import { toArrayOrEmpty } from '../../pages/idea/utils';
import { City } from '../../API';
import i18n from '../../app/i18n';
import { debounceFunction } from '../../utils';
import { THERE_ARE_NO_DATA } from '../../locales/strings';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

interface CitiesListProps {
  resourceId?: string | undefined;
  getCityId: Function;
  selectedCityId?: string;
  isMultiple?: boolean;
}

const CitiesList = (props: CitiesListProps) => {
  const { resourceId, getCityId, selectedCityId, isMultiple = false } = props;
  const [cities, setCities] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { requestApi } = useMainContext();
  const { t } = useTranslation();

  const listCitiesOfCountry = (query?: string) => {
    if (!resourceId) {
      return;
    } else {
      setIsSearching(true);
      requestApi(listCities, { resourceId, offset: 0, limit: 100, query }, (response: City[], error: string) => {
        if (error) {
          return;
        }
        setIsSearching(false);
        setCities(toArrayOrEmpty(response));
      });
    }
  };

  useEffect(() => {
    listCitiesOfCountry();
  }, [resourceId, i18n.language]);

  const handleCityChange = (value: string) => {
    cities?.forEach((elm) => {
      if (elm.name === value) {
        getCityId(elm.id);
      }
    });
  };

  const debouncedSearch = debounceFunction((value: string) => {
    listCitiesOfCountry(value);
  }, 500);

  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  return (
    <>
      <Select
        onChange={handleCityChange}
        onSearch={handleSearchChange}
        loading={isSearching}
        value={cities?.find((elm) => elm.id === selectedCityId)?.name!}
        showSearch
        allowClear
        onClear={() => getCityId('')}
        notFoundContent={<Empty description={t(THERE_ARE_NO_DATA)} />}
        style={{
          width: '100%',
        }}
      >
        {cities.map((city) => (
          <Option key={city?.id} value={city?.name!}>
            {city?.name}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default CitiesList;
