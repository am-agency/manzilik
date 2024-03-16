import React from 'react';
import { Checkbox, Row } from 'antd';
import { FilterChangeHandler, FilterViewItem, FilterViewOption } from '../../../../app/hooks/filters/types';
import { CheckboxOptionLabel } from '../../../../components/filters/checkbox_option_label';

interface Props {
  option: FilterViewOption;
  filterSource: FilterViewItem;
  onChange: FilterChangeHandler;
  checked?: boolean;
}

const CheckboxLabelSwitch = ({ option }: { option: FilterViewOption }) => {
  switch (option.type) {
    case 'checkbox':
      return <CheckboxOptionLabel.Default option={option} />;
    case 'rating':
      return <CheckboxOptionLabel.Rating option={option} />;
    default:
      return <CheckboxOptionLabel.Default option={option} />;
  }
};

export const FilterCheckbox = ({ option, onChange, filterSource, checked }: Props) => {
  const isColor = filterSource.title === 'color' || filterSource.title === 'اللون';
  return (
    <Checkbox
      checked={checked}
      className="checkbox-group filters-wrapper "
      onChange={(e) => {
        e.stopPropagation();
        onChange({ filterSource, option, value: e.target.checked });
      }}
    >
      <Row align="middle" className="checkbox-option-wrapper">
        {isColor ? <CheckboxOptionLabel.Color option={option} /> : <CheckboxLabelSwitch option={option} />}
      </Row>
    </Checkbox>
  );
};
