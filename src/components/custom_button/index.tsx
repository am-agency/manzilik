import { Badge, Tooltip } from 'antd';
import React, { ReactNode } from 'react';
import { useSendBirdContext } from '../../context/sendbird_context';
import { useTranslation } from 'react-i18next';
import {
  CONTACT_CS,
  CONTACT_NOW,
  MESSAGE,
  MESSAGES,
  START_CONTACT,
  UNREAD_MESSAGES,
  VIEW_CHAT,
} from '../../locales/strings';
import { useMainContext } from '../../app/providers/main';
import { useHistory } from 'react-router-dom';
import { CreateSendBirdChatGroupApi } from '../../pages/messenger/types';
import { createSendBirdChatGroup } from '../../pages/messenger/api';
import * as analytics from '../../analytics';
import { Quotation, ServiceInquiry } from '../../API';
import { useIntercom } from 'react-use-intercom';

interface ButtonProps {
  icon?: ReactNode;
  item?: ServiceInquiry;
  isCircular?: boolean;
  isDisabled?: boolean;
  quotationId?: string;
  isViewOnly?: boolean;
  btnColor?: string;
  applyUnreadLogic?: boolean;
}

const StartChatButton = ({
  icon,
  item,
  isCircular = false,
  isDisabled = false,
  quotationId,
  isViewOnly = false,
  btnColor,
  applyUnreadLogic = false,
}: ButtonProps) => {
  const { listOfChannels, setAccessToken } = useSendBirdContext();
  const { t } = useTranslation();
  const { requestApi } = useMainContext();
  const history = useHistory();
  const { boot, show } = useIntercom();

  const getUnreadMessagesCount = () => {
    const channel = listOfChannels!.find((channel) => channel.url === item?.sendbird_channel_url);
    return channel?.unreadMessageCount || 0;
  };
  const isUserHaveUnreadMessages = item?.sendbird_channel_url && getUnreadMessagesCount() > 0;
  const isUserAlreadyContacted = item?.sendbird_channel_url && getUnreadMessagesCount() == 0;
  const isRejected = item?.status === 'REJECTED';
  const isRemoved = (isRejected! as boolean) && (!isUserAlreadyContacted as boolean | undefined);

  const text = isUserHaveUnreadMessages
    ? t(UNREAD_MESSAGES)
    : isRejected && isUserAlreadyContacted
    ? t(VIEW_CHAT)
    : isUserAlreadyContacted
    ? t(START_CONTACT)
    : t(CONTACT_NOW);

  const theme = isUserHaveUnreadMessages ? 'blue' : 'green';

  const onCreateGroupChat = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (item?.sendbird_channel_url) {
      analytics.PublishEvent(new analytics.AnalyticsOpenChat('sender', 'inquiries list'));
      history.push(`/messenger/${item?.sendbird_channel_url}`);
    } else {
      requestApi(
        createSendBirdChatGroup,
        { service_inquiry_id: item?.id, resource_id: quotationId },
        (response: CreateSendBirdChatGroupApi, error: string) => {
          if (error) {
            return;
          }
          analytics.PublishEvent(new analytics.AnalyticsInitChat('sender', 'inquiries list'));
          setAccessToken(response?.sendbird_access_token);
          localStorage.setItem('sendbird_access_token', response?.sendbird_access_token);
          history.push(`/messenger`);
        }
      );
    }
  };

  return applyUnreadLogic && !isUserHaveUnreadMessages ? null : (
    <Tooltip
      title={isDisabled ? t(CONTACT_CS) : ''}
      placement="top"
      onVisibleChange={(visible) => {
        if (visible) {
          show();
        }
      }}
    >
      <button
        className={`custom-button ${isViewOnly ? 'view-only' : theme} ${isDisabled ? 'disabled' : ''}`}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onCreateGroupChat(e)}
        style={{
          opacity: isRemoved ? 0.5 : 1,
          minWidth: isCircular ? 'auto' : '138px',
          width: isCircular ? '38px' : 'auto',
          height: isCircular ? '38px' : 'auto',
          backgroundColor: btnColor ? btnColor : '',
        }}
        disabled={isRemoved}
      >
        <div className="badge-icon">
          <span className={`badge ${isViewOnly ? 'view-only-position' : ''}`}>
            <Badge count={getUnreadMessagesCount()} />
          </span>
          {icon && !isViewOnly ? <span className="icon">{icon}</span> : null}
        </div>

        {!isCircular && <span className="text">{isViewOnly ? t(MESSAGES) : text}</span>}
      </button>
    </Tooltip>
  );
};

export default StartChatButton;
