import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Professional } from '../../../../../API';
import icons from '../../../../../assets/icons';
import SendRequestButton from '../../../../../components/send_request_button';
import { BROWSE_WEBSITE, CAll_NOW, SERVICES_PACKAGE } from '../../../../../locales/strings';
import GenericButton from '../../../../../components/generic_button';
import { useHistory } from 'react-router-dom';
import { useFeatures } from 'flagged';
import { GIG_SERVICE_CLIENT } from '../../../../../app/settings';
import * as analytics from '../../../../../analytics';
import { SharedStateContext, SharedStateInterface } from '../../../../../context/shared_state_context';
import { useMainContext } from '../../../../../app/providers/main';
interface Props {
  item: Professional;
}
function ProfContactInfo({ item }: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const mobileNumber = item?.client?.mobile;
  const blog = item?.client?.blog;
  const features = useFeatures();
  const { isProfessional } = useContext(SharedStateContext) as SharedStateInterface;

  const getWebsiteUrl = () => {
    if (!blog?.includes('http')) {
      return blog?.replace(blog, `http://${blog}`);
    }
    return blog;
  };

  return (
    <div className="prof-contact-wrapper">
      <div className="info">
        <div className="contact-info">
          {mobileNumber && (
            <a href={`tel:${mobileNumber}`}>
              <div className="phone-info">
                <img src={icons.prof_list_mobile} alt="phone" />
                <p className="phone-title">{t(CAll_NOW)}</p>
              </div>
            </a>
          )}
          {blog && (
            <a href={`${getWebsiteUrl()}`} target="_blank" rel="noreferrer">
              <div className="web-info">
                <img src={icons.prof_list_web} alt="web" />
                <p className="web-title">{t(BROWSE_WEBSITE)}</p>
              </div>
            </a>
          )}
        </div>

        <div className="btn-container">
          {!isProfessional ? <SendRequestButton item={item} width="fit-content" padding="6px 12.5px" /> : null}

          {item?.is_gig_professional && item?.gigs_count && features[GIG_SERVICE_CLIENT] ? (
            <GenericButton
              btnText={t(SERVICES_PACKAGE)}
              backgroundColor="#56D49B"
              onButtonClick={() => {
                history.push(`/professional/${item?.client?.id}`);
                analytics.PublishEvent(new analytics.AnalyticsOpenProGigs('professional list', item?.client?.id!));
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProfContactInfo;
