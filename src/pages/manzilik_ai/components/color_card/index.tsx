import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { aiIcons } from '../../../../assets/icons/ai';
import { Tooltip } from 'antd';
import { AIDesignStyle } from '../../types';
import { useTranslation } from 'react-i18next';
import { EN } from '../../../../locales/constants';

interface ColorFilterCardProps {
  item: AIDesignStyle;
  setSelectedFilter?: (filter: string) => void;
  selectedFilter?: string;
  onFilterSelect?: (filter: string) => void;
}

const ColorCard = (props: ColorFilterCardProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const { item, selectedFilter, setSelectedFilter, onFilterSelect } = props;
  const { name } = item;
  const { t, i18n } = useTranslation();

  const onItemSelect = () => {
    setIsChecked(true);
    setSelectedFilter && setSelectedFilter(name);
    onFilterSelect!(item.slug);
  };

  return (
    <div className={`color-card ${isChecked && selectedFilter === name ? 'checked' : ''}`} onClick={onItemSelect}>
      <div className="box-container">
        <div
          className={`color-box-card ${isChecked && selectedFilter === name ? 'checked' : ''} ${
            selectedFilter && 'unchecked'
          }`}
          style={{
            backgroundColor: '#000000',
          }}
        ></div>
        <div
          className={`color-box-card ${isChecked && selectedFilter === name ? 'checked' : ''} ${
            selectedFilter && 'unchecked'
          }`}
          style={{
            backgroundColor: 'gray',
          }}
        ></div>
        <div
          className={`color-box-card ${isChecked && selectedFilter === name ? 'checked' : ''} ${
            selectedFilter && 'unchecked'
          }`}
          style={{
            backgroundColor: 'tomato',
          }}
        ></div>
        <div
          className={`color-box-card ${isChecked && selectedFilter === name ? 'checked' : ''} ${
            selectedFilter && 'unchecked'
          }`}
          style={{
            backgroundColor: 'green',
          }}
        ></div>
        {isChecked && selectedFilter === name && (
          <div className="check-icon">
            <img src={aiIcons.check} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorCard;
