import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GigService, PriceSorting, ProfessionalGigsList, Service } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { ListGigsServicesItem } from '../api';
import { useHistory } from 'react-router-dom';
import { GigsStepsContext } from '../../../context/gigs_steps_context';
import { Skeleton } from 'antd';
import { Loading } from '../../../components/loading';
import { getValueAndUpdateSearchUrl } from '../../../utils';
import * as analytics from '../../../analytics';

export const useGigsServicesList = () => {
  const { t } = useTranslation();
  const [data, setData] = React.useState<(GigService | null)[] | null>([]);
  const [count, setCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const history = useHistory();
  const { requestApi } = useMainContext();
  const contextValue = useContext(GigsStepsContext);
  if (!contextValue) {
    return <Loading />;
  }
  const { updateStep, isCitySelected, selectedCityId, selectedService, redirectionLink } = contextValue;

  const getGigsServicesItemList = (
    limit = 100,
    offset = 0,
    city: string,
    service: string,
    price_sorting: PriceSorting
  ) => {
    setIsLoading(true);
    requestApi(
      ListGigsServicesItem,
      {
        limit,
        offset,
        city,
        service,
        price_sorting,
      },
      (response: ProfessionalGigsList, error: unknown) => {
        if (error) {
          return;
        }
        localStorage.setItem('gigsServicesList', JSON.stringify(response?.results));
        setData(response?.results! || []);
        setCount(response?.count);
        setIsLoading(false);
        analytics.PublishEvent(new analytics.AnalyticsSelectGigCity(selectedService?.title!, selectedCityId!));
        if (response?.count > 0) {
          updateStep(2);
          getValueAndUpdateSearchUrl!(history, 'step', '3');
        } else {
          history.push(redirectionLink!);
          analytics.PublishEvent(new analytics.AnalyticsEmptyGig(selectedService?.title!, selectedCityId!));
        }
      }
    );
  };

  const loadingCardsArray = Array.from({ length: 8 }).map((_, index) => {
    return (
      <Skeleton.Button
        key={index}
        active
        size="large"
        shape="round"
        style={{
          width: '167px',
          height: '305px',
        }}
      />
    );
  });

  useEffect(() => {
    if (selectedService && isCitySelected && selectedCityId) {
      getGigsServicesItemList(100, 0, selectedCityId, selectedService.id, PriceSorting.ASC);
    }
  }, [selectedService, isCitySelected, selectedCityId]);

  return {
    data,
    count,
    isLoading,
    loadingCardsArray,
  };
};
