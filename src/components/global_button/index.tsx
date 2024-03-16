import React from 'react';
import { useTranslation } from 'react-i18next';
import icons from '../../assets/icons';

interface GlobalButtonProps {
  text: string;
  actionFunction: () => void;
  padding?: string;
}

const GlobalButton = (props: GlobalButtonProps) => {
  const { t } = useTranslation();
  const { text, actionFunction, padding } = props;
  return (
    <div
      className="send-request"
      onClick={actionFunction}
      style={{
        width: 'auto',
        padding: padding || '7px 15.5px',
        backgroundImage: '',
      }}
    >
      <p>{text}</p>
      <img src={icons.prof_arrow_white} width="24" height="24" alt="arrow" />
    </div>
  );
};

export default GlobalButton;
