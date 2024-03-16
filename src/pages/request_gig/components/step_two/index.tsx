import React, { useEffect, useState, ChangeEvent, useContext, useRef } from 'react';
import icons from '../../../../assets/icons';
import ServiceItem from '../service_item';
import { Button, Divider, Input, Radio, Row, Skeleton, Spin } from 'antd';
import type { RadioChangeEvent } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { City, DirectoryGigService, PriceSorting, Service } from '../../../../API';
import { GigsStepsContext } from '../../../../context/gigs_steps_context';
import { useTranslation } from 'react-i18next';
import { CONFIRM_CITY, SEARCH_CITY, SELECT_CITY, THERE_ARE_NO_DATA } from '../../../../locales/strings';
import { SearchOutlined } from '@ant-design/icons';
import { useGigsServicesList } from '../../hooks/useGigsServicesList';
import { useProfessional } from '../../../professionals/hooks/useProfessional';
import { useMainContext } from '../../../../app/providers/main';
import { useRegions } from '../../../professionals/hooks/useRegions';
import { Loading } from '../../../../components/loading';
import { listCities } from '../../../profile/api';
import { toArrayOrEmpty } from '../../../idea/utils';
import { debounceFunction, getValueAndUpdateSearchUrl } from '../../../../utils';
import Loader from 'react-spinners/ClipLoader';
import { useHistory } from 'react-router-dom';
import * as analytics from '../../../../analytics';
import { useCompletePersonalProfile } from '../../../auth/signup/components/complete_basic_profile/hooks/useCompletePersonalProfile';

const StepTwo = () => {
  const citiesLimit = 100;
  const { requestApi } = useMainContext();
  const resourceId = 'a8358a7e-4fae-4fbe-8e48-ecefccf440b8';
  const [defaultCities, setDefaultCities] = useState<City[]>([]);
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const { t, i18n } = useTranslation();
  const contextValue = useContext(GigsStepsContext);
  if (!contextValue) {
    return <Loading />;
  }
  const {
    selectedService,
    selectedCityId,
    setSelectedCityId,
    setIsCitySelected,
    setRedirectionLink,
    setSelectedCityName,
  } = contextValue;
  const { getRegionById } = useRegions();
  const history = useHistory();
  const { isLoading: isListServicesLoading } = useGigsServicesList() as {
    isLoading: boolean;
  };

  const { submitWithoutValidation } = useCompletePersonalProfile();

  const getCities = (refresh: boolean = false, query?: string) => {
    let prevTopicsList = citiesList;
    let currentOffset = offset;
    setLoading(true);

    if (refresh) {
      prevTopicsList = [];
      currentOffset = 0;
    }

    requestApi(
      listCities,
      { resourceId, offset: currentOffset, limit: citiesLimit, query },
      (response: City[], error: string) => {
        if (error) {
          return;
        }
        const newTopicsList = toArrayOrEmpty(prevTopicsList).concat(toArrayOrEmpty(response));
        setCitiesList(newTopicsList);
        setDefaultCities(newTopicsList);
        setLoading(false);

        if (response?.length == 0) {
          setHasMore(false);
          return;
        }

        setOffset(offset + citiesLimit);
      }
    );
  };
  const onNext = () => {
    !loading && getCities();
  };
  const debouncedSearch = debounceFunction((value: string) => {
    if (value.length === 0) {
      getCities();
    } else {
      getCities(true, value);
    }
  }, 1000);
  useEffect(() => {
    getCities(true);
  }, [i18n.language]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    setSelectedCityId!(e.target.value);
    setSelectedCityName!(citiesList.find((item) => item.id === e.target.value)?.name!);
  };

  const { professional } = useMainContext();

  useEffect(() => {
    const cityId = professional?.client?.city?.id;
    if (cityId) {
      setSelectedCityId!(cityId);
    }
  }, [selectedService && professional?.client?.city?.id]);

  const handleConfirmCity = () => {
    setIsCitySelected!(true);
    getValueAndUpdateSearchUrl!(history, 'cityId', `${selectedCityId}`);
    submitWithoutValidation({
      country_id: resourceId,
      city_id: selectedCityId,
    });
  };

  useEffect(() => {
    return () => {
      setIsCitySelected!(false);
    };
  }, []);

  useEffect(() => {
    if (selectedCityId) {
      const regionId = citiesList.find((item) => item.id === selectedCityId)?.region_id!;
      const currentCity = citiesList.find((item) => item.id === selectedCityId);
      const region = getRegionById(regionId);
      const regionName = region?.name;
      const cityName = currentCity?.name;
      const serviceName = selectedService?.title;
      const redirectionLink = `/professionals?o=0&l=15&m=regions:${regionName}&m=locations:${cityName}&m=services:${serviceName}`;
      setRedirectionLink!(redirectionLink);
    }
  }, [selectedCityId]);

  const ref = useRef();

  return (
    <div className="step-two">
      <div>{selectedService && <ServiceItem item={selectedService} withShortDescription={false} />}</div>

      <p className="select-city"> {t(SELECT_CITY)}</p>
      <Input
        placeholder={t(SEARCH_CITY)}
        value={searchValue}
        onChange={handleSearchChange}
        prefix={<SearchOutlined />}
      />
      <div className="option-list" ref={(ref) => ref}>
        <InfiniteScroll
          pageStart={offset / citiesLimit}
          loadMore={onNext}
          hasMore={hasMore}
          useWindow={false}
          getScrollParent={ref.current}
          loader={
            <div className="option-item-loader">
              <Skeleton.Input active size="small" />
              <Skeleton.Avatar active size="small" shape="circle" />
            </div>
          }
        >
          {citiesList.length > 0 ? (
            citiesList.map((option) => (
              <div key={option.id} className="option-item">
                <div
                  className="item"
                  onClick={() => {
                    setSelectedCityId!(option.id);
                  }}
                >
                  <Radio value={option.id} checked={selectedCityId === option.id} onChange={handleRadioChange} />
                  <span>{option.name}</span>
                </div>
                <div className="line"></div>
              </div>
            ))
          ) : (
            <div className="no-results">{t(THERE_ARE_NO_DATA)}</div>
          )}
        </InfiniteScroll>
      </div>

      <div className="step-two-footer">
        <Button className="next-btn" onClick={handleConfirmCity} disabled={!selectedCityId}>
          {t(CONFIRM_CITY)}
          {isListServicesLoading && <Loader color="#fff" size={20} />}
        </Button>
      </div>
    </div>
  );
};

export default StepTwo;
