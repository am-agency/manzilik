import React from 'react';
import { Empty, Typography } from 'antd';
import { publicProfileIcons } from '../../../../assets/icons/public_profile';
import { useTranslation } from 'react-i18next';
import { NO_IDEAS } from '../../../../locales/strings';

export const NoIdeas = () => {
  const { t } = useTranslation();

  return (
    <Empty
      image={<img src={publicProfileIcons.no_ideas.icon} alt="no_ideas" />}
      description={
        <div className="no-ideas-text">
          <Typography.Text className="title">{t(NO_IDEAS)}</Typography.Text> <br />
        </div>
      }
    />
  );
};
