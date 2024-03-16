import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  PREVIEW_YOUR,
  PROCEED_TO,
  PROFILE_DETAILS_UPDATED_SUCCESSFULLY,
  PUBLIC_PROFILE,
  YOUR_MANZILIK_PROJECTS,
} from '../../../../locales/strings';

export const SuccessMessage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography.Text>{t(PROFILE_DETAILS_UPDATED_SUCCESSFULLY)}</Typography.Text>
      <br />
      <Typography.Text>
        {t(PROCEED_TO)} <Link to="/projects"> {t(YOUR_MANZILIK_PROJECTS)}</Link>
      </Typography.Text>
    </div>
  );
};
