import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useMainContext } from '../../app/providers/main';
import { listCities, getNeighborhoods } from '../../pages/profile/api';
import { toArrayOrEmpty } from '../../pages/idea/utils';
import { City, Neighborhood } from '../../API';
import i18n from '../../app/i18n';
import { debounceFunction } from '../../utils';

const { Option } = Select;

interface NeighborhoodsListProps {
  resourceId?: string;
  getNeighborhoodId: Function;
}

const NeighborhoodsList = (props: NeighborhoodsListProps) => {
  const { resourceId, getNeighborhoodId } = props;
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { requestApi } = useMainContext();

  const listNeighborhoods = (query?: string) => {
    requestApi(
      getNeighborhoods,
      { limit: 100, offset: 0, resourceId, query },
      (response: { results: Neighborhood[] }, error: string) => {
        if (error) {
          return;
        }
        setNeighborhoods(response.results);
      }
    );
  };
  useEffect(() => {
    listNeighborhoods();
  }, [resourceId, i18n.language]);

  const handleCityChange = (value: string) => {
    neighborhoods?.forEach((elm) => {
      if (elm.name === value) {
        getNeighborhoodId(elm.id);
      }
    });
  };

  const debouncedSearch = debounceFunction((value: string) => {
    if (value.length === 0) {
      return;
    } else {
      listNeighborhoods(value);
    }
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
        showSearch
        allowClear
        style={{
          width: '100%',
        }}
      >
        {neighborhoods.map((city) => (
          <Option key={city?.id} value={city?.name!}>
            {city?.name}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default NeighborhoodsList;
