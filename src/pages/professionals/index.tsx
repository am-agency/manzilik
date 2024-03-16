/* A React component that is used to search for professionals. */
import { Col, Input, Row, Select, Typography } from 'antd';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Container } from '../../components/container';
import Separator from '../../components/separator';
import { TagsList } from './components/tags_list';

import { getLayoutDirection } from '../../app/layouts';
import { useMainContext } from '../../app/providers/main';

import { Professional, ProfessionalSearchSortBy, SearchData } from '../../API';
import { search } from '../ideas/api';

import i18n from '../../app/i18n';
import {
  ALL,
  CITY,
  CLEAR_ALL,
  FIND_PROFESSIONAL,
  REGION,
  SERVICES,
  UNVERIFIED,
  VERIFICATION,
  VERIFIED,
  PROFESSIONALS,
  HOME_PAGE_SEO_DESCRIPTION,
  MANZILIK,
  RESULTS,
  PROFESSIONAL,
  HOMEOWNER,
  INCOMPLETE_RFQ,
  COMPLETE_BTN,
} from '../../locales/strings';

import { FilterKey } from '../../app/hooks/search/useSearchFilters';
import icons from '../../assets/icons';
import { MetaTags } from '../../components/meta_tags';
import { checkEmptySimpleString, getPaginationOffset } from '../../utils';
import { COMPLETE_PROFILE_ROUTE, PROFESSIONALS_ROUTE } from '../../utils/routes';
import { useCitiesByRegions } from './hooks/useCitiesByRegions';
import { useRegions } from './hooks/useRegions';
import { useSearchProfessionals } from './hooks/useSearchProfessionals';
import { useServices } from './hooks/useServices';
import { TagsMetaItem } from './types';
import { useVerified, VerifiedStatus } from './hooks/useVerified';
import * as analytics from '../../analytics';
import { ProfessionalList } from './components/professionals_list';
import { ProfessionalSort } from './components/professionals_list/professionals_sort';
import { GigsServicesContext, GigsServicesInterface } from '../../context/services_context';
import InDismissibleAlert from '../../components/in_dismissible_alert';
import { CompleteProfileContext } from '../../context/complete_profile_context';
import { searchProfessionalsRequest } from './api';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';
import { BannerSlug } from '../../constants';
import { useClient } from '../../app/hooks/use_client';

/* A React component that is responsible for showing the list of professionals. */
const Professionals = () => {
  const [totalProfessionals, setTotalProfessionals] = useState<number>(0);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const { t } = useTranslation();
  const { requestApi, userState } = useMainContext();
  const history = useHistory();

  const searchProfessionals = useSearchProfessionals();
  const [keyword, setKeyword] = useState<string>();
  const langDirection = getLayoutDirection(i18n.language);
  const [isProfessionalsLoading, setIsProfessionalsLoading] = useState<boolean>(false);
  const { hasDraftRfq } = useClient();

  const { isProfessionalCompleteProfile } = useContext(CompleteProfileContext) as {
    isProfessionalCompleteProfile: boolean;
  };
  const { isVerified, setIsVerified, clearVerified, verifiedToString, verifiedToValue, getVerifiedLabelKey } =
    useVerified();

  const { banner, isBannerLoading, setBannerSlug } = useContext(SharedStateContext) as SharedStateInterface;

  useEffect(() => {
    setBannerSlug!(BannerSlug.PROFESSIONALS_BANNER);
  }, []);

  const {
    clearSelectedRegions,
    regions,
    selectRegionsById,
    selectedRegions,

    regionsReady,
    deselectRegionById,
  } = useRegions();

  const { deselectCityById, clearSelectedCities, cities, selectCitiesById, selectedCities, citiesReady } =
    useCitiesByRegions(selectedRegions);

  const {
    deselectServiceById,
    clearSelectedServices,
    data: services,
    selectServicesById,
    selectedServices,
    servicesReady,
  } = useContext(GigsServicesContext) as GigsServicesInterface;

  /**
   * Basic filters are loaded and ready
   */
  const filtersReady = useMemo(() => {
    return regionsReady && servicesReady;
  }, [regionsReady, servicesReady]);

  /**
   * It makes a request to the server and sets the state of the component with the response
   */
  const getProfessionals = () => {
    setIsProfessionalsLoading(true);
    const [isVerifiedParam] = searchProfessionals.filters[FilterKey.IS_VERIFIED] || [];
    const isVerified =
      isVerifiedParam !== undefined && isVerifiedParam === 'true'
        ? true
        : isVerifiedParam === 'false'
        ? false
        : undefined;
    const rate = searchProfessionals.filters[FilterKey.RATING];

    requestApi(
      searchProfessionalsRequest,
      {
        text: searchProfessionals.keywords,
        pagination: {
          limit: searchProfessionals.searchOptions.recordsLimit,
          offset: searchProfessionals.searchOptions.offset,
        },
        regions: selectedRegions.map((region) => region.name) as string[],
        cities: selectedCities.map((city) => city.name) as string[],
        services: selectedServices.map((service) => service.title) as string[],
        sortBy: searchProfessionals.searchOptions.sortMethod || ProfessionalSearchSortBy.VERIFIED,
        is_verified: isVerified || '',
      },
      (response: { results: Professional[]; count: number }, error: string) => {
        if (error) {
          return;
        }
        setIsProfessionalsLoading(false);
        const { results, count } = response;
        setProfessionals(results as Professional[]);
        setTotalProfessionals(count);
      }
    );
  };

  useEffect(() => {
    if (filtersReady) {
      setKeyword(searchProfessionals.keywords);
      getProfessionals();
    }
  }, [
    selectedRegions,
    selectedCities,
    selectedServices,
    isVerified,
    i18n.language,
    filtersReady,
    searchProfessionals.keywords,
    searchProfessionals.searchOptions,
  ]);

  const onCityChange = (values: string[]) => {
    selectCitiesById(values);
  };

  /**
   * reactively set cities filters on select cities
   */
  useEffect(() => {
    const selectedCitiesNames = selectedCities.map((city) => city.name) as string[];
    searchProfessionals.setFilters({
      ...searchProfessionals.filters,
      [FilterKey.LOCATIONS]: selectedCitiesNames,
    });
    searchProfessionals.setOffset(0);
  }, [selectedCities]);

  const onRegionsChange = (regionsIds: string[]) => {
    selectRegionsById(regionsIds);
  };

  /**
   * reactively set regions filters on select regions
   */
  useEffect(() => {
    const selectedRegionsNames = selectedRegions.map((region) => region.name) as string[];
    searchProfessionals.setFilters({
      ...searchProfessionals.filters,
      [FilterKey.REGIONS]: selectedRegionsNames,
    });
    searchProfessionals.setOffset(0);
  }, [selectedRegions]);

  const onServicesChange = (values: string[]) => {
    selectServicesById(values);
  };

  /**
   * reactively set services filters on select regions
   */
  useEffect(() => {
    const selectedServicesTitles = selectedServices.map((service) => service.title) as string[];
    searchProfessionals.setFilters({
      ...searchProfessionals.filters,
      [FilterKey.SERVICES]: selectedServicesTitles,
    });
    searchProfessionals.setOffset(0);
  }, [selectedServices]);

  const onPageChange = (page: number, pageSize?: number) => {
    const offset = getPaginationOffset(page, pageSize);
    searchProfessionals.setOffset(offset);
  };

  const onTagClose = (tag: TagsMetaItem) => {
    switch (tag.type) {
      case FilterKey.REGIONS:
        deselectRegionById(tag.id);
        searchProfessionals.removeFilter(FilterKey.REGIONS, tag.title);
        break;
      case FilterKey.LOCATIONS:
        searchProfessionals.removeFilter(FilterKey.LOCATIONS, tag.title);
        deselectCityById(tag.id);
        break;
      case FilterKey.SERVICES:
        deselectServiceById(tag.id);
        searchProfessionals.removeFilter(FilterKey.SERVICES, tag.title);
        break;
      case FilterKey.IS_VERIFIED:
        searchProfessionals.removeFilter(FilterKey.IS_VERIFIED, '');
        break;
    }
  };

  const onPressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = checkEmptySimpleString(keyword!);
    if (value !== '') {
      analytics.PublishEvent(new analytics.AnalyticsSearchEvent(value));
      searchProfessionals.setKeywords(value);
      event.currentTarget.blur();
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setKeyword(value);
    searchProfessionals.setKeywords(value);
  };

  const clearFilters = () => {
    clearSelectedRegions();
    clearSelectedCities();
    clearSelectedServices();
    clearVerified();
    searchProfessionals.clear();
  };

  const prevQueryString = useRef(searchProfessionals.queryString);

  /**
   * update url on filters change
   */
  useEffect(() => {
    const url = PROFESSIONALS_ROUTE + searchProfessionals.queryString;
    // Only update the history if the query string has changed
    if (prevQueryString.current !== searchProfessionals.queryString) {
      history.push(url);
      prevQueryString.current = searchProfessionals.queryString; // Update the ref to the new query string
    }
  }, [searchProfessionals.queryString]);

  const onChangeVerifiedFilter = (value: string) => {
    if (value === undefined) {
      searchProfessionals.removeFilter(FilterKey.IS_VERIFIED, '');
    } else {
      searchProfessionals.setFilter(FilterKey.IS_VERIFIED, [value as string]);
      setIsVerified(verifiedToValue(value));
      searchProfessionals.setOffset(0);
    }
  };

  const selectedRegionsId = useMemo(() => {
    return selectedRegions.map((region) => region.id);
  }, [selectedRegions]);

  const selectedCitiesId = useMemo(() => {
    return selectedCities.map((city) => city.id);
  }, [selectedCities]);

  const selectedServicesId = useMemo(() => {
    return selectedServices.map((service) => service.id);
  }, [selectedServices]);

  const tags: TagsMetaItem[] = useMemo(() => {
    const title = t(getVerifiedLabelKey(isVerified));
    const verifiedTag = isVerified !== undefined ? [{ id: 'isVerified', title, type: FilterKey.IS_VERIFIED }] : [];
    return [
      selectedRegions.map<TagsMetaItem>((region) => ({
        id: region.id,
        title: region.name as string,
        type: FilterKey.REGIONS,
      })),
      selectedCities.map<TagsMetaItem>((city) => ({
        id: city.id,
        title: city.name as string,
        type: FilterKey.LOCATIONS,
      })),
      selectedServices.map<TagsMetaItem>((service) => ({
        id: service.id,
        title: service.title as string,
        type: FilterKey.SERVICES,
      })),
      verifiedTag,
    ].flat();
  }, [selectedRegions, selectedCities, selectedServices, isVerified]);

  /**
   * url initial filters must be set after filters data is loaded so ui updates it's state correctly
   */
  useEffect(() => {
    if (filtersReady && searchProfessionals.initialFilters) {
      // force initial filters after load
      searchProfessionals.setFilters(searchProfessionals.initialFilters);
    }
  }, [searchProfessionals.initialFilters, filtersReady]);

  /**
   * set services from url on ready
   */
  useEffect(() => {
    if (servicesReady && searchProfessionals.initialFilters) {
      const servicesInitialFilters = searchProfessionals.initialFilters[FilterKey.SERVICES];
      if (servicesInitialFilters?.length) {
        const selectedInitialServices = servicesInitialFilters
          .map((serviceName) => {
            const service = services.find((service) => service.title === serviceName);
            return service?.id;
          })
          .filter((id) => id !== undefined) as string[];
        selectServicesById(selectedInitialServices);
      }
    }
  }, [searchProfessionals.initialFilters, servicesReady]);

  /**
   * set regions from url on ready
   */
  useEffect(() => {
    if (regionsReady && searchProfessionals.initialFilters) {
      const regionsInitialFilters = searchProfessionals.initialFilters[FilterKey.REGIONS];
      if (regionsInitialFilters?.length) {
        const selectedInitialRegions = regionsInitialFilters
          .map((regionName) => {
            const region = regions.find((region) => region.name === regionName);
            return region?.id;
          })
          .filter((id) => id !== undefined) as string[];
        selectRegionsById(selectedInitialRegions);
      }
    }
  }, [searchProfessionals.initialFilters, regionsReady]);

  /**
   * set cities from url on ready
   */
  useEffect(() => {
    if (citiesReady && searchProfessionals.initialFilters) {
      const citiesInitialFilters = searchProfessionals.initialFilters[FilterKey.LOCATIONS];
      if (citiesInitialFilters?.length) {
        const selectedInitialCities = citiesInitialFilters
          .map((cityName) => {
            const city = cities.flatMap((cityRegion) => cityRegion.cities).find((city) => city.name === cityName);
            return city?.id;
          })
          .filter((id) => id !== undefined) as string[];
        selectCitiesById(selectedInitialCities);
      }
    }
  }, [searchProfessionals.initialFilters, citiesReady]);

  /**
   * update verified initial value
   */
  useEffect(() => {
    const _isVerified = searchProfessionals.filters[FilterKey.IS_VERIFIED]?.[0];
    setIsVerified(verifiedToValue(_isVerified));
  }, [searchProfessionals.filters]);

  // update params on global search value selected
  useEffect(() => {
    searchProfessionals.updateSearchParamsFromUrl();
  }, [window.location.search]);

  return (
    <>
      <MetaTags title={`${t(MANZILIK)} | ${t(PROFESSIONALS)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />

      <div className="professional select-wrapper">
        <div className="filters-wrapper">
          <Container>
            {!isProfessionalCompleteProfile &&
            userState?.isAuthenticated &&
            userState?.client?.type === PROFESSIONAL ? (
              <InDismissibleAlert
                isBlocked
                onMessageClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
                actionBtnClick={() => history.push(COMPLETE_PROFILE_ROUTE)}
              />
            ) : null}
            {hasDraftRfq && (
              <InDismissibleAlert
                message={t(INCOMPLETE_RFQ)}
                onMessageClick={() => {
                  history.push('/request-quotation-service');
                }}
                actionBtnText={t(COMPLETE_BTN)}
                actionBtnClick={() => {
                  history.push('/request-quotation-service');
                }}
                isBlocked
              />
            )}

            <Row>
              <Col xl={3} lg={3} md={24} sm={24} xs={24}>
                <Select
                  placeholder={t(REGION)}
                  mode="multiple"
                  showSearch
                  showArrow
                  onChange={onRegionsChange}
                  maxTagCount={0}
                  optionFilterProp={'label'}
                  maxTagPlaceholder={<div>{t(REGION)}</div>}
                  value={selectedRegionsId}
                >
                  {regions.map((region) => {
                    return (
                      <Select.Option value={region.id} label={region.name} key={region.id} className={langDirection}>
                        {region.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col>
              <Separator horizontal={9} />
              <Col xl={3} lg={3} md={24} sm={24} xs={24}>
                <Select
                  placeholder={t(CITY)}
                  mode="multiple"
                  showSearch
                  showArrow
                  onChange={onCityChange}
                  maxTagCount={0}
                  optionFilterProp={'label'}
                  maxTagPlaceholder={<div>{t(CITY)}</div>}
                  value={selectedCitiesId}
                  disabled={selectedRegions.length === 0}
                >
                  {cities.map((regionCity) =>
                    regionCity.cities.map((city) => (
                      <Select.Option value={city.id} label={city.name} key={city.id} className={langDirection}>
                        {city.name}, <small>{regionCity.region.name}</small>
                      </Select.Option>
                    ))
                  )}
                </Select>
              </Col>
              <Separator horizontal={9} />
              <Col xl={3} lg={3} md={24} sm={24} xs={24}>
                <Select
                  onChange={onServicesChange}
                  placeholder={t(SERVICES)}
                  mode="multiple"
                  dropdownClassName="category-select-dropdown"
                  showSearch
                  showArrow
                  optionFilterProp={'label'}
                  value={selectedServicesId}
                  maxTagCount={0}
                  maxTagPlaceholder={<div>{t(SERVICES)}</div>}
                >
                  {services.map((service) => {
                    return (
                      <Select.Option
                        className={langDirection}
                        key={service.id}
                        value={service.id}
                        label={service.title}
                      >
                        {service.title}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col>
              <Separator horizontal={9} />
              <Col xl={3} lg={3} md={24} sm={24} xs={24}>
                <Select
                  onChange={onChangeVerifiedFilter}
                  placeholder={t(VERIFICATION)}
                  showSearch
                  showArrow
                  optionFilterProp={'label'}
                  value={verifiedToString(isVerified)}
                  maxTagCount={0}
                  maxTagPlaceholder={<div>{t(VERIFICATION)}</div>}
                >
                  <Select.Option className={langDirection} value={verifiedToString(undefined)} label={ALL}>
                    {t(ALL)}
                  </Select.Option>
                  <Select.Option
                    className={langDirection}
                    value={verifiedToString(VerifiedStatus.VERIFIED)}
                    label={VERIFIED}
                  >
                    {t(VERIFIED)}
                  </Select.Option>
                  <Select.Option
                    className={langDirection}
                    value={verifiedToString(VerifiedStatus.UNVERIFIED)}
                    label={UNVERIFIED}
                  >
                    {t(UNVERIFIED)}
                  </Select.Option>
                </Select>
              </Col>
              <Separator horizontal={14} />

              <Separator horizontal={14} />
              <Col xl={6} lg={6} md={24} sm={24} xs={24}>
                <Input
                  placeholder={t(FIND_PROFESSIONAL)}
                  prefix={<img src={icons.search.icon} />}
                  onPressEnter={onPressEnter}
                  onChange={onInputChange}
                  value={keyword}
                />
              </Col>
            </Row>
            <Separator vertical={10} />
            <Row align="middle">
              <TagsList tags={tags} onTagClose={onTagClose} />
              {tags.length ? (
                <Typography.Text className="clear-all clickable">
                  <div className="inner-content" onClick={() => clearFilters()}>
                    {t(CLEAR_ALL)}
                  </div>
                </Typography.Text>
              ) : null}
            </Row>
          </Container>
        </div>

        <Container>
          <Row justify="space-between" align="middle">
            <section>
              <Typography.Text>{t(RESULTS)}</Typography.Text>
              &nbsp;
              <Typography.Text strong>({totalProfessionals})</Typography.Text>
            </section>
            <ProfessionalSort
              sortedValue={searchProfessionals.searchOptions.sortMethod}
              onSortchange={(value) => {
                searchProfessionals.setSortMethod(value);
              }}
            />
          </Row>

          {filtersReady ? (
            <ProfessionalList
              recordsLimit={searchProfessionals.searchOptions.recordsLimit}
              professionals={professionals}
              onPageChange={onPageChange}
              total={totalProfessionals}
              currentPage={searchProfessionals.getCurrentPage()}
              isProfessionalsLoading={isProfessionalsLoading}
            />
          ) : null}
        </Container>
      </div>
    </>
  );
};

export default Professionals;
