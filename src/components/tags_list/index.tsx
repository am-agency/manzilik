import { Row, Tag } from 'antd';
import React, { FunctionComponent } from 'react';
import Separator from '../separator';

interface TagsListProps {
  className?: string;
  tags?: string[];
  selectedTags?: number[];
  onTagSelect?: Function;
}

export const TagsList: FunctionComponent<TagsListProps> = (props: TagsListProps) => {
  const { tags, selectedTags, onTagSelect, className } = props;

  return (
    <Row align="middle" className="tags-list">
      {tags?.map(
        (tag: string, index: number) =>
          tag && (
            <span key={index}>
              <Tag
                onClick={() => onTagSelect?.(index)}
                className={`tag ${className} ${selectedTags?.includes(index) ? 'selected' : ''}`}
                key={index}
              >
                {tag}
              </Tag>
              <Separator horizontal={6} />
            </span>
          )
      )}
    </Row>
  );
};
