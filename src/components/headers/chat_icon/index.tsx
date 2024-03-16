import { Badge } from 'antd';
import React, { useContext } from 'react';
import { headerIcons } from '../../../assets/icons/header';

import i18n from '../../../app/i18n';
import { useSendBirdContext } from '../../../context/sendbird_context';
import * as analytics from '../../../analytics';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';

export const ChatIcon = () => {
  const { totalUnreadMessageCount } = useSendBirdContext();
  const history = useHistory();
  const { isProfessional } = useContext(SharedStateContext) as SharedStateInterface;

  const handleRedirect = () => {
    analytics.PublishEvent(new analytics.AnalyticsOpenChatList('main bar', 'sender'));
    history.push(isProfessional ? '/edit-profile/requests-works-on' : '/edit-profile/service-requests');
  };

  // make object style for disable the section if there is no unread messages

  const disableStyle: React.CSSProperties = {
    pointerEvents: totalUnreadMessageCount === 0 ? 'none' : 'auto',
    opacity: totalUnreadMessageCount === 0 ? 0.5 : 1,
  };

  return (
    <section
      style={disableStyle}
      className={`notifications-container ${i18n.language === 'ar' ? 'rtl' : 'ltr'} `}
      onClick={handleRedirect}
    >
      <section>
        <Badge count={totalUnreadMessageCount || 0} className="badge">
          <img src={headerIcons.chat} />
        </Badge>
      </section>
    </section>
  );
};
