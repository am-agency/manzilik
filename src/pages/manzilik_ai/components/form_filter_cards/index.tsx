import React, { useEffect, useState } from 'react';
import FilterCard from '../filter_card';
import { useTranslation } from 'react-i18next';
import { OPTIONAL, THE_STYLE } from '../../../../locales/strings';
import { AIDesignRoomType, AIDesignStyle, AIOption } from '../../types';
interface ColorFilterCardsProps {
  listOfFilters: AIDesignStyle[] | AIDesignRoomType[] | AIOption[];
  title: string;
  subTitle?: string;
  onFilterSelect?: (filter: string) => void;
  withFlag?: boolean;
  defaultFilter?: string;
}

function ColorFilterCards(props: ColorFilterCardsProps) {
  const { t } = useTranslation();
  const { listOfFilters, title = '', subTitle = '', onFilterSelect, withFlag = false, defaultFilter } = props;

  const [selectedFilter, setSelectedFilter] = useState('');
  useEffect(() => {
    setSelectedFilter!(listOfFilters[0]?.name!);
  }, []);
  useEffect(() => {
    setSelectedFilter(defaultFilter!);
  }, [defaultFilter]);

  return (
    <>
      {listOfFilters.length > 0 ? (
        <div className="styles">
          <div className="titles">
            <p className="bold-text">
              {title}
              {withFlag && <span className="optional">{` (${t(OPTIONAL)})`}</span>}
            </p>
            <p className="normal-text"> {subTitle}</p>
          </div>
          <div className="filter-cards">
            {listOfFilters.map((filter) => (
              <FilterCard
                key={filter.slug}
                item={filter}
                setSelectedFilter={setSelectedFilter}
                selectedFilter={selectedFilter}
                onFilterSelect={onFilterSelect}
                defaultFilter={defaultFilter}
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ColorFilterCards;
