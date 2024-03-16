import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useMainContext } from '../../app/providers/main';
import { listCountries } from '../../pages/profile/api';
import { toArrayOrEmpty } from '../../pages/idea/utils';
import { Country } from '../../API';
import { debounceFunction } from '../../utils';
import i18n from '../../app/i18n';

const { Option } = Select;
interface CountriesListProps {
  getCountryId: Function;
  selectedCountryId?: string;
}

const CountriesList = (props: CountriesListProps) => {
  const { getCountryId, selectedCountryId } = props;
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { requestApi } = useMainContext();

  const getCountry = (query?: string) => {
    requestApi(listCountries, { offset: 0, limit: 100, query }, (response: Country[], error: string) => {
      if (error) {
        return;
      }
      setCountries(toArrayOrEmpty(response));
    });
  };

  useEffect(() => {
    getCountry();
  }, [i18n.language]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
  };

  const debouncedSearch = debounceFunction((value: string) => {
    if (value.length === 0) {
      return;
    } else {
      setIsSearching(true);
      getCountry(value);
      setIsSearching(false);
    }
  }, 500);

  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  useEffect(() => {
    getCountryId(selectedCountry);
  }, [selectedCountry]);

  return (
    <>
      <Select
        onChange={handleCountryChange}
        onSearch={handleSearchChange}
        value={countries?.find((country) => country?.id === selectedCountryId)?.name!}
        showSearch
        loading={isSearching}
        style={{
          width: '100%',
        }}
      >
        {countries.map((country) => (
          <Option key={country?.id} value={country?.id!}>
            {country?.name}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default CountriesList;
