import React, { useContext } from 'react';
import { Col, Row } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { REQUEST_GIG_SERVICE_ROUTE } from '../../utils/routes';
import { MenuCategory } from '../../app/providers/types';
import { MenuWrapper } from './menu_wrapper';
import { useTranslation } from 'react-i18next';
import ServiceItem from '../../pages/request_gig/components/service_item';
import { GigsStepsContext } from '../../context/gigs_steps_context';
import { Loading } from '../loading';
import * as analytics from '../../analytics';
import { GigsServicesContext, GigsServicesInterface } from '../../context/services_context';

interface Props {
  ideas: (MenuCategory | null)[];
  item: { label: string; icon: string };
}

export const ServicesMenu = ({ item, ideas }: Props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { data, isLoading, loadingCardsArray } = useContext(GigsServicesContext) as GigsServicesInterface;

  const contextValue = useContext(GigsStepsContext);
  if (!contextValue) {
    return <Loading />;
  }
  const { updateStep, setSelectedService } = contextValue;

  const onLabelClick = () => {
    updateStep(0);
    analytics.PublishEvent(new analytics.AnalyticsClickGigs());
  };

  return (
    <MenuWrapper
      icon={item.icon}
      label={item.label}
      onLabelClick={onLabelClick}
      sectionId="request-gigs-popover"
      labelLink={`${REQUEST_GIG_SERVICE_ROUTE}?step=1`}
    >
      <Row className="request-gigs-popover-container">
        {isLoading ? (
          <div className="gigs-services-list-loader">{loadingCardsArray}</div>
        ) : (
          data?.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedService!(item);

                history.push({
                  pathname: REQUEST_GIG_SERVICE_ROUTE,
                  search: `?serviceId=${item.id}&step=2`,
                });
              }}
            >
              <ServiceItem item={item} />
            </div>
          ))
        )}
      </Row>
    </MenuWrapper>
  );
};
