import React, { useContext, ElementType } from 'react';
import ServiceItem from '../service_item';
import HelpComponent from '../help_component';
import { useTranslation } from 'react-i18next';
import { KNOW_YOUR_NEEDS, KNOW_YOUR_NEEDS2, MANZILIK } from '../../../../locales/strings';
import { GigsStepsContext } from '../../../../context/gigs_steps_context';
import { Loading } from '../../../../components/loading';
import { useHistory } from 'react-router-dom';
import { getValueAndUpdateSearchUrl } from '../../../../utils';
import * as analytics from '../../../../analytics';
import { Service } from '../../../../API';
import RfqCard from '../../../requests_for_quotations/components/rfq_card';
import { useFeatures } from 'flagged';
import { REQUEST_FOR_QUOTATION } from '../../../../app/settings';
import { useMainContext } from '../../../../app/providers/main';
import { UserRole } from '../../../../app/types';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';

interface StepOneProps {
  data: Service[];
  isLoading: boolean;
  loadingCardsArray: React.ReactNode[];
}

const StepOne = (props: StepOneProps) => {
  const { data, isLoading, loadingCardsArray } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const contextValue = useContext(GigsStepsContext);
  const features = useFeatures();
  const { userState } = useMainContext();
  const isRfqFlag = features[REQUEST_FOR_QUOTATION];
  const { isProfessional } = useContext(SharedStateContext) as SharedStateInterface;

  if (!contextValue) {
    return <Loading />;
  }
  const { setSelectedService, updateStep } = contextValue;

  return (
    <div className="step-one">
      <div className="step-one-header">
        <p className="step-one-title">
          <span>{t(MANZILIK)}</span> {t(KNOW_YOUR_NEEDS)}
        </p>
        <p className="sub-title">{t(KNOW_YOUR_NEEDS2)}</p>
      </div>
      {isRfqFlag && !isProfessional ? <RfqCard isHomeView={false} /> : null}

      <div className="gigs-services">
        {isLoading ? (
          <div className="gigs-services-list-loader">{loadingCardsArray}</div>
        ) : (
          data?.map((item) => {
            return (
              <ServiceItem
                key={item.id}
                item={item}
                onItemClicked={() => {
                  setSelectedService!(item);
                  getValueAndUpdateSearchUrl!(history, 'serviceId', `${item.id}`);
                  getValueAndUpdateSearchUrl!(history, 'step', '2');
                  updateStep(1);
                  analytics.PublishEvent(new analytics.AnalyticsSelectGigService(item?.title!));
                }}
              />
            );
          })
        )}

        <HelpComponent />
      </div>
    </div>
  );
};

export default StepOne;
