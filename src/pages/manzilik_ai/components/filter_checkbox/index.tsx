import React, { useState } from 'react';
import { aiIcons } from '../../../../assets/icons/ai';
import { Tooltip } from 'antd';
import * as analytics from '../../../../analytics';

interface FilterCheckBoxProps {
  onHandleCheckboxChange?: (type: string) => void;
  arrayOfOptions?: { label: string; hint: string; value: string; isDisabled?: boolean }[];
  title?: string;
  tooltip?: string;
}

const FilterCheckBox = (props: FilterCheckBoxProps) => {
  const { onHandleCheckboxChange, arrayOfOptions = [], title = '', tooltip = '' } = props;
  const [currentOption, setCurrentOption] = useState(arrayOfOptions![0].value || '');

  const handleCheckboxChange = (type: string) => {
    setCurrentOption(type);
    if (onHandleCheckboxChange) {
      onHandleCheckboxChange(type as string);
    }
  };

  return (
    <div className="filter-checkbox-container">
      <div className="title-container">
        <p className="normal-text">{title}</p>
        <Tooltip
          title={tooltip}
          onVisibleChange={() => {
            analytics.PublishEvent(new analytics.AnalyticsViewInfoAIEvent('manzilikAIPrivacy'));
          }}
        >
          <img src={aiIcons.info} />
        </Tooltip>
      </div>
      <div className="checkboxes">
        {arrayOfOptions!.map((option, index) => (
          <label
            key={index}
            className={`checkbox-label ${currentOption === option.value ? 'checked' : ''} ${
              option.isDisabled ? 'disabled' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={currentOption === option.value}
              onChange={() => handleCheckboxChange(option.value)}
              disabled={option.isDisabled}
            />
            <p className="label-text">
              {option.label} <span>{option.hint}</span>
            </p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterCheckBox;

{
  /* <label className={`checkbox-label ${optionOne ? 'checked' : ''}`}>
<input type="checkbox" checked={optionOne} onChange={() => handleCheckboxChange('private')} />
عام
</label>
<label className={`checkbox-label ${optionTwo ? 'checked' : ''}`}>
<input type="checkbox" checked={optionTwo} onChange={() => handleCheckboxChange('public')} />
خاص
</label> */
}
