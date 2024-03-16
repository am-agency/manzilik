import { Select } from 'antd';
import React, { useContext, useState } from 'react';
import { CITY, JOBS, SERVICES } from '../../../../locales/strings';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import { useTranslation } from 'react-i18next';
import { RfqContext, RfqProps } from '../../requests_for_quotations_context';
import CitiesList from '../../../../components/cities_list';

function QuotationsFilters() {
  const { listOfServices, cities } = useContext(SharedStateContext) as SharedStateInterface;
  const { t } = useTranslation();
  const [servicesSelectedIdsCount, setServicesSelectedIdsCount] = useState(0);
  const [citiesSelectedIdsCount, setCitiesSelectedIdsCount] = useState(0);

  const { setProfSelectedServicesFilter, setProfSelectedCitiesFilter } = useContext(RfqContext) as RfqProps;

  const onServicesChange = (ids: [string]) => {
    setProfSelectedServicesFilter(ids);
    setServicesSelectedIdsCount(ids.length);
  };
  const onCitiesChange = (ids: [string]) => {
    setProfSelectedCitiesFilter(ids);
    setCitiesSelectedIdsCount(ids.length);
  };

  return (
    <div className="selectors-container">
      <p>{t(JOBS)}</p>
      <div className="dropdowns">
        <Select
          placeholder={t(SERVICES)}
          mode="multiple"
          showSearch={false}
          showArrow
          maxTagCount={0}
          optionFilterProp={'label'}
          maxTagPlaceholder={
            <div>
              {t(SERVICES)}
              <span className="badge">{servicesSelectedIdsCount}</span>
            </div>
          }
          onChange={onServicesChange}
        >
          {listOfServices!.map((option) => {
            return (
              <Select.Option key={option.id} value={option.id}>
                {option.title}
              </Select.Option>
            );
          })}
        </Select>

        <Select
          placeholder={t(CITY)}
          mode="multiple"
          showSearch={false}
          showArrow
          maxTagCount={0}
          optionFilterProp={'label'}
          maxTagPlaceholder={
            <div>
              {t(CITY)}
              <span className="badge">{citiesSelectedIdsCount}</span>
            </div>
          }
          onChange={onCitiesChange}
        >
          {cities!.map((option) => {
            return (
              <Select.Option key={option.id} value={option.id}>
                {option.name}
              </Select.Option>
            );
          })}
        </Select>
      </div>
    </div>
  );
}

export default QuotationsFilters;
