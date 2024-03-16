import React, { useContext, useEffect, useMemo, useState } from 'react';
import icons from '../../../../assets/icons';
import { DirectoryGigService, GigService } from '../../../../API';
import { useTranslation } from 'react-i18next';
import { BY, SAR } from '../../../../locales/strings';
import { Tooltip } from 'antd';
import { getValueAndUpdateSearchUrl, modifyImageUrl, textSubstring } from '../../../../utils';
import { useHistory } from 'react-router-dom';
import { GigsStepsContext } from '../../../../context/gigs_steps_context';
import { Loading } from '../../../../components/loading';
import DefaultImage from '../../../../assets/images/default/Defult-Image-147.png';
import { REQUEST_GIG_SERVICE_ROUTE } from '../../../../utils/routes';
import * as analytics from '../../../../analytics';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';

interface GigCardProps {
  item: GigService | null;
  listOfGigServices?: GigService[];
  width?: string;
  backgroundColor?: string;
  border?: string;
}

const GigCard = (props: GigCardProps) => {
  const { item, listOfGigServices, width = '167px', backgroundColor = '', border = '1px solid #f5f5f5' } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = history.location;
  const contextValue = useContext(GigsStepsContext);
  const { currentScreenName } = useContext(SharedStateContext) as SharedStateInterface;

  if (!contextValue) {
    return <Loading />;
  }
  const { currentStep, updateStep, setSelectedServiceItem, setFilteredServices, selectedService, selectedCityName } =
    contextValue;

  const handleProfRedirect = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    window.open(`/professional/${item?.professional?.id}`, '_blank');
  };

  const handleUpdateFilteredServices = () => {
    const filteredServices = listOfGigServices?.filter((service) => service.id !== item?.id);

    setFilteredServices!([...filteredServices!, item!]);
  };

  const isGigUrl =
    pathname.includes('professional') ||
    pathname.includes('idea') ||
    pathname.includes('magazine') ||
    pathname.includes('discussion');
  const handleGigOnClick = () => {
    setSelectedServiceItem!(item);
    localStorage.setItem('selectedServiceItem', JSON.stringify(item));
    getValueAndUpdateSearchUrl!(history, 'gigId', `${item?.id}`);
    getValueAndUpdateSearchUrl!(history, 'step', '4');
    if (isGigUrl) {
      history.push({
        pathname: REQUEST_GIG_SERVICE_ROUTE,
        search: `?step=4&gigId=${item?.id}&fromProfile=true`,
      });
    }
    if (currentStep === 3) {
      analytics.PublishEvent(new analytics.AnalyticsSelectSimilarGig());
    }
    analytics.PublishEvent(
      new analytics.AnalyticsSelectGig(
        selectedService?.title!,
        selectedCityName!,
        item?.id!,
        item?.title!,
        item?.professional?.id!,
        currentScreenName
      )
    );

    handleUpdateFilteredServices();
    setTimeout(() => {
      updateStep(3);
    }, 500);
  };

  const itemImage = useMemo(() => {
    if (item?.photos[0]!) {
      return modifyImageUrl(item?.photos[0]!, 145);
    } else {
      return DefaultImage;
    }
  }, [item?.photos[0]]);

  return (
    <div
      className="card-container"
      style={{
        width,
        backgroundColor,
        border,
      }}
      onClick={handleGigOnClick}
    >
      <div className="card">
        <div className="img-wrapper">
          <img src={itemImage} alt="arrow" />
        </div>
        <div className="content-wrapper">
          <div className="service-type">
            <img src={icons.my_gigs.arrow_left_small} alt="arrow" />
            <span>
              <Tooltip title={item?.title}>{textSubstring(item?.title! || '', 15)}</Tooltip>
            </span>
          </div>
          <div className="service-description">
            <p className="description">
              <Tooltip title={item?.description}>{textSubstring(item?.description! || '', 40)}</Tooltip>
            </p>
            <span>{t(BY)}</span>
            <span onClick={handleProfRedirect}>
              <Tooltip title={item?.professional?.company_name}>
                {textSubstring(item?.professional?.company_name! || '', 15)}
              </Tooltip>
            </span>
          </div>
          <div className="price">
            <img src={icons.my_gigs.price_icon} alt="price" />
            <span>{`${item?.price} ${t(SAR)}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
