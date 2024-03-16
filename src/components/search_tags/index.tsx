import React from 'react';
import { Row, Tag, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { CLEAR_ALL } from '../../locales/strings';

export interface TSearchTag {
  title: string;
  onClear: () => void;
}

interface Props {
  tags: TSearchTag[];
  onClearAllTags: (tags: TSearchTag[]) => void;
}

export const SearchTags = ({ tags, onClearAllTags }: Props) => {
  const { t } = useTranslation();
  return tags.length ? (
    <section className="search-tags">
      {tags.map((tag) => {
        return (
          <Tag key={tag.title} className="search-tag" closable onClose={tag.onClear}>
            {tag.title}
          </Tag>
        );
      })}

      {tags.length ? (
        <Typography.Text className="clear-all clickable">
          <div className="inner-content" onClick={() => onClearAllTags(tags)}>
            {t(CLEAR_ALL)}
          </div>
        </Typography.Text>
      ) : null}
    </section>
  ) : null;
};
