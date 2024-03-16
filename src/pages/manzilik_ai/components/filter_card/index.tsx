import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { aiIcons } from '../../../../assets/icons/ai';
import { Tooltip } from 'antd';
import { AIDesignStyle } from '../../types';
import { useTranslation } from 'react-i18next';
import { EN } from '../../../../locales/constants';
import { ManzilikAiContext, ManzilikAiProps } from '../../manzilik_ai_context';

interface FormFilterCardProps {
  item: AIDesignStyle;
  setSelectedFilter?: (filter: string) => void;
  selectedFilter?: string;
  onFilterSelect?: (filter: string) => void;
  defaultFilter?: string;
}

const FilterCard = (props: FormFilterCardProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const { item, selectedFilter, setSelectedFilter, onFilterSelect, defaultFilter } = props;
  const { name } = item;
  const { t, i18n } = useTranslation();
  const { selectedDesignObject } = useContext(ManzilikAiContext) as ManzilikAiProps;

  useEffect(() => {
    if (defaultFilter) {
      setSelectedFilter!(defaultFilter);
      setIsChecked(true);
    }
  }, [selectedDesignObject]);

  const onItemSelect = () => {
    setIsChecked(true);
    setSelectedFilter && setSelectedFilter(name);
    onFilterSelect!(item.slug);
  };

  return (
    <div className={`filter-card ${isChecked && selectedFilter === name ? 'checked' : ''}`} onClick={onItemSelect}>
      <div className="image-container">
        <img
          className={`image ${isChecked && selectedFilter === name ? 'checked' : ''} ${selectedFilter && 'unchecked'}`}
          src={item.image || 'https://www.teioak.com/product/image/pics/NoPicture_type.png'}
          alt="Card Image"
        />
        {isChecked && selectedFilter === name && (
          <div className="check-icon">
            <img src={aiIcons.check} />
          </div>
        )}
      </div>
      <Tooltip title={name && name.length > 8 ? name : ''}>
        <p className="text">{name && name.length > 8 ? name.slice(0, 8) + '...' : name}</p>
      </Tooltip>
    </div>
  );
};

export default FilterCard;
