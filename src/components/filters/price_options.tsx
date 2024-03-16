import React, { FunctionComponent, useEffect, useState } from 'react';
import { Row, Slider, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import Separator from '../separator';
import { PriceRange } from '../../app/hooks/filters/types';
import { defaultPriceRange } from '../../pages/ideas/ideas_filter/filters_form/filters_options';

interface Props {
  value: PriceRange;
  range: [number, number];
  onChange: (values: [number, number]) => void;
}

export const PriceSlider: FunctionComponent<Props> = ({ onChange, value, range }: Props) => {
  const [currentValue, setCurrentValue] = useState(range);
  const { t } = useTranslation();
  const onPriceChange = (value: PriceRange) => {
    setCurrentValue(value);
    onChange(value);
  };

  useEffect(() => {
    if (value) {
      setCurrentValue(value);
    } else {
      setCurrentValue(defaultPriceRange);
    }
  }, [value]);

  return (
    <Col span={24} className="price-slider-container">
      <Row justify="center" align="middle" gutter={8} wrap={false}>
        <div className="slider-max-min-val">
          {currentValue[0]} {t('SAR')}
        </div>
        <Separator horizontal={4} />
        <Slider range min={range[0]} max={range[1]} value={currentValue} step={10} onChange={onPriceChange} />
        <Separator horizontal={4} />
        <div className="slider-max-min-val">
          {currentValue[1]} {t('SAR')}
        </div>
      </Row>
    </Col>
  );
};
