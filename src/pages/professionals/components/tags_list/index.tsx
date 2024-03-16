import React from 'react';
import { Row, Tag } from 'antd';
import { Category, City, Region } from '../../../../API';
import { TagsMetaItem } from '../../types';

interface Props {
  tags: TagsMetaItem[];
  onTagClose: Function;
}

export const TagsList = ({ tags, onTagClose }: Props) => {
  return (
    <Row className="tags-list-container" align="middle">
      {tags.map((elm) => {
        return (
          <Tag key={elm.id} className="professional-tag" closable onClose={() => onTagClose(elm)}>
            {elm.title}
          </Tag>
        );
      })}
    </Row>
  );
};
