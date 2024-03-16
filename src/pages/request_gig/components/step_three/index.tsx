import React, { useContext, useEffect } from 'react';
import GigCard from '../gig_card';
import { DirectoryGigService, GigService } from '../../../../API';
import ServiceItem from '../service_item';
import { GigsStepsContext } from '../../../../context/gigs_steps_context';
import HelpComponent from '../help_component';
import { useGigsServicesList } from '../../hooks/useGigsServicesList';
import { Loading } from '../../../../components/loading';
import RfqCard from '../../../requests_for_quotations/components/rfq_card';
import { useFeatures } from 'flagged';
import { REQUEST_FOR_QUOTATION } from '../../../../app/settings';
import { useMainContext } from '../../../../app/providers/main';
import { UserRole } from '../../../../app/types';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';

const StepThree = () => {
  const contextValue = useContext(GigsStepsContext);
  if (!contextValue) {
    return <Loading />;
  }
  const { selectedService } = contextValue;
  const [renderedList, setRenderedList] = React.useState<GigService[]>([]);
  const listFromLocalStorage = localStorage.getItem('gigsServicesList');
  const features = useFeatures();
  const { userState } = useMainContext();
  const { isProfessional } = useContext(SharedStateContext) as SharedStateInterface;
  const isRfqFlag = features[REQUEST_FOR_QUOTATION];

  const { data, isLoading, loadingCardsArray } = useGigsServicesList() as {
    data: GigService[];
    isLoading: boolean;
    loadingCardsArray: JSX.Element[];
  };

  useEffect(() => {
    if (listFromLocalStorage) {
      setRenderedList(listFromLocalStorage ? JSON.parse(listFromLocalStorage) : []);
    } else {
      setRenderedList(data);
    }
  }, [data, listFromLocalStorage]);

  return (
    <div className="step-three">
      <div>{selectedService && <ServiceItem item={selectedService} withShortDescription={false} />}</div>

      {isRfqFlag && !isProfessional ? <RfqCard isHomeView={false} /> : null}
      <div className="list-cards">
        {isLoading ? (
          <div className="gigs-services-list-loader">{loadingCardsArray}</div>
        ) : (
          renderedList &&
          renderedList?.map((item: GigService) => {
            return <GigCard key={item.id} item={item} listOfGigServices={renderedList || []} />;
          })
        )}
      </div>

      <HelpComponent />
    </div>
  );
};

export default StepThree;
