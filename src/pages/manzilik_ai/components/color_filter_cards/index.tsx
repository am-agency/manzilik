import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OPTIONAL, THE_STYLE } from '../../../../locales/strings';
import { AIDesignRoomType, AIDesignStyle } from '../../types';
import ColorCard from '../color_card';
interface ColorFilterCardsProps {
  listOfFilters: AIDesignStyle[] | AIDesignRoomType[];
  title: string;
  subTitle?: string;
  onFilterSelect?: (filter: string) => void;
  withFlag?: boolean;
}

function ColorFilterCards(props: ColorFilterCardsProps) {
  const { t } = useTranslation();
  const { listOfFilters, title = '', subTitle = '', onFilterSelect, withFlag = false } = props;
  const [selectedFilter, setSelectedFilter] = useState('');
  useEffect(() => {
    setSelectedFilter!(listOfFilters[0]?.name!);
  }, []);

  return (
    <div className="styles">
      <div className="titles">
        <p className="bold-text">
          {title}
          {withFlag && <span className="optional">{` (${t(OPTIONAL)})`}</span>}
        </p>
        <p className="normal-text"> {subTitle}</p>
      </div>
      <div className="color-cards">
        {listOfFilters.map((filter) => (
          <ColorCard
            key={filter.id}
            item={filter}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
            onFilterSelect={onFilterSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorFilterCards;
