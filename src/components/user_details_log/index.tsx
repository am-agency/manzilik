import React, { FunctionComponent, ReactNode, useState } from 'react';
import { Button, Divider } from 'antd';
import lock from '../../assets/backgrounds/lock.png';
import Separator from '../separator';
import { useTranslation } from 'react-i18next';
import { CONTACT_INFO, SHOW_CONTACT_INFO } from '../../locales/strings';
import i18n from '../../app/i18n';
import { UserEvent } from '../../app/firebase_config';
import { useMainContext } from '../../app/providers/main';
import { VISITOR } from '../../app/settings';
import { gifIcons } from '../../assets/gifs';
import * as analytics from '../../analytics';

interface Props {
  renderContent: ReactNode;
  user: UserEvent;
  analyticsContactName: string;
}
export const UserDetailsLog: FunctionComponent<Props> = ({ renderContent, analyticsContactName }: Props) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [animatedLock, showAnimatedLock] = useState<boolean>(false);
  const { t } = useTranslation();
  const {
    userState: { isAuthenticated, client },
  } = useMainContext();

  const onShowInformation = () => {
    showAnimatedLock(true);
    setTimeout(() => {
      setIsUnlocked(true);
      analytics.PublishEvent(
        new analytics.AnalyticsShowContactInformationEvent(analyticsContactName, client?.email!, isAuthenticated)
      );
    }, 2000);
  };

  if (isUnlocked) {
    return (
      <div className="user-details-log">
        <strong>{t(CONTACT_INFO)}:</strong>
        <Divider type="horizontal" />
        {renderContent}
      </div>
    );
  }

  return (
    <div className="locked-wrapper">
      <div>
        {animatedLock ? (
          <img src={gifIcons.lock} className="lock-img animated-lock" />
        ) : (
          <img src={lock} alt="lock" className="lock-img" />
        )}
        <Separator vertical={2} />
        <Button type="primary" onClick={onShowInformation}>
          {t(SHOW_CONTACT_INFO)}
        </Button>
      </div>
    </div>
  );
};
