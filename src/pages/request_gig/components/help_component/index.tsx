import React, { useContext } from 'react';
import icons from '../../../../assets/icons';
import GlobalButton from '../../../../components/global_button';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DO_YOU_NEED_HELP,
  FIND_A_PRO,
  PROVIDE_YOU_HELP,
  PROVIDE_YOU_HELP2,
  REQUEST_SERVICE_NOW,
} from '../../../../locales/strings';
import * as analytics from '../../../../analytics';
import { GigsStepsContext } from '../../../../context/gigs_steps_context';
import { Loading } from '../../../../components/loading';

interface HelpComponentProps {
  isGridView?: boolean;
  profId?: string;
}

const HelpComponent = (props: HelpComponentProps) => {
  const { isGridView = false, profId } = props;
  const history = useHistory();
  const { t } = useTranslation();
  const contextValue = useContext(GigsStepsContext);

  if (!contextValue) {
    return <Loading />;
  }
  const { selectedCityName, selectedService, currentStep } = contextValue;
  return (
    <>
      {!isGridView ? (
        <div className="help-container">
          <div className="img-wrapper">
            <img src={icons.my_gigs.help} alt="help" />
          </div>
          <div className="help-content">
            <div className="content">
              <p className="title">{t(DO_YOU_NEED_HELP)}</p>
              <p className="sub-title">{t(PROVIDE_YOU_HELP)}</p>
            </div>

            <div className="btn-wrapper">
              <GlobalButton
                text={t(FIND_A_PRO)}
                actionFunction={() => {
                  window.open('/professionals', '_blank');
                  const screenName = currentStep === 0 ? 'services step' : 'gigs list';
                  analytics.PublishEvent(
                    new analytics.AnalyticsFindPro(selectedService?.title!, selectedCityName!, screenName)
                  );
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="help-container-grid">
          <img src={icons.my_gigs.help_grid} alt="help" />
          <p className="title">{t(DO_YOU_NEED_HELP)}</p>
          <p className="sub-title">{t(PROVIDE_YOU_HELP2)}</p>
          <GlobalButton
            text={t(REQUEST_SERVICE_NOW)}
            padding="6px 11.5px"
            actionFunction={() => {
              window.open(`/request-professional-service?professional_id=${profId}`, '_blank');
            }}
          />
        </div>
      )}
    </>
  );
};

export default HelpComponent;
