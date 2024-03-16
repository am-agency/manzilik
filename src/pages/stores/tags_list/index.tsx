import React from 'react';
import { Row, Tag } from 'antd';
import { BrandTag, TagsState } from '../types';

interface Props {
  tags: BrandTag[];
  onTagClose: Function;
}

export const TagsList = ({ tags, onTagClose }: Props) => {
  return (
    <Row className="tags-list-container" align="middle">
      {tags.map((elm, index) => {
        return (
          <Tag key={index} className="store-tag" closable onClose={() => onTagClose(elm)}>
            {elm.title}
          </Tag>
        );
      })}
    </Row>
  );
};
