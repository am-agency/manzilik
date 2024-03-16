import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ACCURACY, OPTIONAL } from '../../../../locales/strings';
import { Slider } from 'antd';
interface AccuracySliderProps {
  onSliderChange?: (value: number) => void;
}

const AccuracySlider = (props: AccuracySliderProps) => {
  const { onSliderChange } = props;
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(35);
  const onChange = (newValue: number) => {
    setInputValue(newValue);
  };
  return (
    <div className="accuracy-slider">
      <p className="accuracy-slider-title">
        {t(ACCURACY)}
        <span> ({t(OPTIONAL)}) </span>
      </p>
      <Slider
        min={1}
        max={100}
        onChange={onChange}
        onAfterChange={(newValue: number) => {
          onSliderChange!(newValue);
        }}
        value={typeof inputValue === 'number' ? inputValue : 0}
      />
      <div className="horizontal-line"></div>
    </div>
  );
};

export default AccuracySlider;
