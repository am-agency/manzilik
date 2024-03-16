import React from 'react';
import { Rate, Row } from 'antd';
import { colorsHexCode } from '../../pages/ideas/utils';
import { FilterOption } from '../../app/hooks/filters/types';
import Separator from '../separator';

interface Props {
  option: FilterOption;
}

export const CheckboxOptionLabel = {
  Default: (props: Props) => {
    return (
      <Row align="middle" className="checkbox-option-wrapper">
        <span className="code-title">{props.option.title}</span>
      </Row>
    );
  },
  Rating: (props: Props) => {
    return (
      <Row align="middle" className="checkbox-option-wrapper" wrap={false}>
        <span className="code-title">{props.option.title}</span>
        <Rate className="option-rating" disabled value={parseInt(props.option.title)} />
      </Row>
    );
  },
  Color: (props: Props) => {
    const colors = props.option.title
      .split('|')
      .map((title) => title.trim())
      .map((title) => ({ title, style: { background: colorsHexCode[title.trim()] } }));
    return (
      <Row align="middle" className="checkbox-option-wrapper">
        {colors.map(({ style }) => (
          <>
            <span className="color-box" style={style}></span>
          </>
        ))}
        <Separator horizontal={2} />
        <span className="code-title">{props.option.title}</span>
      </Row>
    );
  },
};
