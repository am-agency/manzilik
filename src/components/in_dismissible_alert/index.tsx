import React from 'react';
import icons from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import { COMPLETE_BTN, COMPLETE_NOTIFICATION } from '../../locales/strings';
import { useHistory } from 'react-router-dom';
import { COMPLETE_PROFILE_ROUTE } from '../../utils/routes';

interface InDismissibleAlertProps {
  isBlocked?: boolean;
  onMessageClick?: () => void;
  message?: string;
  actionBtnText?: string;
  actionBtnClick?: () => void;
}

const InDismissibleAlert = (props: InDismissibleAlertProps) => {
  const { t, i18n } = useTranslation();
  const {
    isBlocked = false,
    onMessageClick,
    actionBtnText = t(COMPLETE_BTN),
    actionBtnClick,
    message = t(COMPLETE_NOTIFICATION),
  } = props;
  const history = useHistory();
  return (
    <div
      className="inadmissible-container"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      onClick={() => {
        onMessageClick!();
      }}
      style={{
        position: isBlocked ? 'unset' : 'fixed',
        transform: isBlocked ? 'unset' : 'translate(-50%, -50%)',
        width: isBlocked ? '100%' : 'fit-content',
      }}
    >
      <div className="right-side">
        <div className="icon">
          <img src={icons.warning} alt="icon" />
        </div>
        <div className="text">{message}</div>
      </div>
      <button
        className="button"
        onClick={() => {
          actionBtnClick!();
        }}
      >
        {actionBtnText}
      </button>
    </div>
  );
};

export default InDismissibleAlert;
