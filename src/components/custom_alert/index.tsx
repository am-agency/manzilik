import React from 'react';
import icons from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import { COMPLETE_BTN, COMPLETE_NOTIFICATION } from '../../locales/strings';
import { useHistory } from 'react-router-dom';
import { COMPLETE_PROFILE_ROUTE } from '../../utils/routes';

interface CustomAlertProps {
  isBlocked?: boolean;
  text: string;
  btnText?: string;
  bgColor?: string;
  btnBgColor?: string;
  btnAction?: () => void;
}

const CustomAlert = (props: CustomAlertProps) => {
  const { isBlocked = false, btnAction, text, btnText, bgColor = '#fff8eb', btnBgColor = '#ffba3c' } = props;
  const { t, i18n } = useTranslation();
  const history = useHistory();
  return (
    <div
      className="custom-alert-container"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      onClick={btnAction}
      style={{
        position: isBlocked ? 'unset' : 'fixed',
        transform: isBlocked ? 'unset' : 'translate(-50%, -50%)',
        width: isBlocked ? '100%' : 'fit-content',
        backgroundColor: bgColor,
      }}
    >
      <div className="right-side">
        <div className="icon">
          <img src={icons.warning} alt="icon" />
        </div>
        <div className="text">{text}</div>
      </div>
      {btnText && (
        <button className="button" onClick={btnAction}>
          {btnText}
        </button>
      )}
    </div>
  );
};

export default CustomAlert;
