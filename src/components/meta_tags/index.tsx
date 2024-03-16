import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { MANZILIK } from '../../locales/strings';

interface Props {
  title: string;
  description?: string;
}

export const MetaTags = ({ title, description }: Props) => {
  const { t } = useTranslation();

  return (
    <Helmet>
      <title>{title || t(MANZILIK)}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};
