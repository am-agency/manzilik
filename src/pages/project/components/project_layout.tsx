import { Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import layoutIcon from '../../../assets/icons/layout.svg';
import { CHANGE_TO_GALLERY_VIEW } from '../../../locales/strings';

export const ProjectLayout = () => {
  const { t } = useTranslation();
  return (
    <>
      <Tooltip placement="top" title={t(CHANGE_TO_GALLERY_VIEW)}>
        <img className="change-layout-btn" src={layoutIcon} />
      </Tooltip>
    </>
  );
};
