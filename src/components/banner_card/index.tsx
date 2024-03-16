import React, { useContext, useEffect } from 'react';
import AIImage from '../../assets/images/AI-card.png';
import Circles from '../../assets/images/circles.svg';
import AIResponsive from '../../assets/images/AI-res.svg';
import YellowShadow from '../../assets/images/yellow-shadow.svg';
import { useTranslation } from 'react-i18next';
import {
  DESIGN_YOUR_HOME_NOW,
  START_THE_EXPERIENCE_NOW,
  USE_AI_TO_DESIGN_YOUR_HOME,
  USE_AI_TO_DESIGN_YOUR_HOME2,
} from '../../locales/strings';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import * as analytics from '../../analytics';
import { useClient } from '../../app/hooks/use_client';
import { Banner as GlobalBanner } from '../../API';

interface BannerCardProps {
  onCardClick?: () => void;
  banner?: GlobalBanner;
  isDynamicContent?: boolean;
}

const BannerCard = (props: BannerCardProps) => {
  const { onCardClick, banner, isDynamicContent = false } = props;
  const { t } = useTranslation();
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' });
  const history = useHistory();
  const pathName = history.location.pathname;
  const currentScreen = pathName.includes('discussions') ? 'DiscussionsPage' : 'HomePage';
  const handleOnClick = () => {
    if (isDynamicContent) {
      window.location.href = banner?.url!;
    } else {
      history.push('/manzilik-ai');
    }
    if (onCardClick) {
      onCardClick();
    }
  };

  const { client } = useClient();

  useEffect(() => {
    analytics.PublishEvent(new analytics.AnalyticsInitiateGenerationAIEvent(currentScreen));
    analytics.PublishEvent(
      new analytics.AnalyticsClickAIBannerEvent(
        currentScreen,
        client?.balance!,
        client?.is_purchased ? 'Purchased' : 'Free'
      )
    );
  }, [currentScreen]);

  return (
    <>
      {isTablet ? (
        <div className="ai-card-responsive" onClick={handleOnClick}>
          <img src={YellowShadow} alt="yellow-shadow" className="yellow-shadow" />
          <img src={AIResponsive} alt="ai" className="upload-img" onClick={handleOnClick} />
          <div className="ai-content-res">
            <p>{isDynamicContent ? banner?.title! : t(DESIGN_YOUR_HOME_NOW)}</p>
            <p>{isDynamicContent ? banner?.sub_title! : t(USE_AI_TO_DESIGN_YOUR_HOME2)}</p>
          </div>
        </div>
      ) : (
        <div className="ai-card" onClick={handleOnClick}>
          <div className="image-container">
            <img src={isDynamicContent ? banner?.photo_url! : AIImage} alt="AI" />
            <div className="overlay"></div>
          </div>
          <div className="content">
            <div className="content-main">
              <p className="title">{isDynamicContent ? banner?.title! : t(DESIGN_YOUR_HOME_NOW)}</p>
              <p>{isDynamicContent ? banner?.sub_title : t(USE_AI_TO_DESIGN_YOUR_HOME)}</p>
              <button onClick={handleOnClick}>
                {isDynamicContent ? banner?.button_title! : t(START_THE_EXPERIENCE_NOW)}
              </button>
            </div>
            <img src={Circles} alt="cirlces" className="circles-img" />
          </div>
        </div>
      )}
    </>
  );
};

export default BannerCard;
