import React from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '../../assets/gifs/spinner.svg';
import { LOADING } from '../../locales/strings';

interface Props {
  label?: string;
}

export const Loading = (props: Props) => {
  const { t } = useTranslation();
  return (
    <span className="loader">
      <img src={Spinner} />
      <span>{t(props.label || LOADING)}</span>
    </span>
  );
};
