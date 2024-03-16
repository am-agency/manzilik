import { Divider } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  icon?: string;
  text?: string;
  count?: number;
  onClick?: () => void;
  className?: string;
}
const GreyButton = ({ className = '', ...props }: Props) => {
  const { t } = useTranslation();
  const { icon, text, count, onClick } = props;
  return (
    <button className={`${className} grey-btn`} onClick={onClick}>
      {icon && (
        <span className={`grey-btn__img ${text || count ? '' : 'solo'}`}>
          <img src={icon} />
        </span>
      )}

      {text && (
        <>
          &nbsp; <span>{text}</span>
        </>
      )}
      {count! >= 0 && (
        <>
          &nbsp;
          <Divider type="vertical" />
          <span>{count}</span>
        </>
      )}
    </button>
  );
};

export default GreyButton;
