import React from 'react';
import { Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../../app/layouts';

import { ALL, DISCUSSIONS, FILTER_BY, MAGAZINE, PHOTOS, TV } from '../../../locales/strings';
import { FilterTag } from '../types';
import { IDEA } from '../../../app/settings';
import { searchIcons } from '../../../assets/icons/search';
import { ideaIcons } from '../../../assets/icons/idea';

interface Props {
  onFilterClick: Function;
  tag: string;
}

export const ProjectFilters = ({ onFilterClick, tag }: Props) => {
  const { t, i18n } = useTranslation();
  const filters = [
    { icon: ideaIcons.all, label: t(ALL) },
    { icon: searchIcons.ideas, label: t(PHOTOS), key: IDEA },
    { icon: searchIcons.discussion, label: t(DISCUSSIONS), key: FilterTag.DISCUSSION },
    { icon: searchIcons.magazine, label: t(MAGAZINE), key: FilterTag.MAGAZINE },
    { icon: searchIcons.tv, label: t(TV), key: FilterTag.TV },
  ];

  return (
    <div className="filter">
      <span className={`title ${getLayoutDirection(i18n.language)}`}>{t(FILTER_BY)}</span>
      {filters.map((elm) => (
        <Tag
          key={elm.key}
          className={`filter-tag clickable ${elm.key == tag ? 'selected' : ''}`}
          onClick={() => onFilterClick(elm.key)}
        >
          <img src={elm.icon} className="filter-icon" /> <Typography.Text> {elm.label} </Typography.Text>
        </Tag>
      ))}
    </div>
  );
};
