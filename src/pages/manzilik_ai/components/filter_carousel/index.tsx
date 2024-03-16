import React, { useState, useRef, useContext } from 'react';
import icons from '../../../../assets/icons';
import { useTranslation } from 'react-i18next';
import { ManzilikAiContext, ManzilikAiProps } from '../../manzilik_ai_context';
import { AIDesignStyle } from '../../types';
import { aiIcons } from '../../../../assets/icons/ai';

interface SliderTabProps {
  tab: AIDesignStyle;
  onFilterClick?: (id: string) => void;
}

const SliderTab: React.FC<SliderTabProps> = ({ tab, onFilterClick }) => {
  const { setSelectedStyleFilter, selectedStyleFilter } = useContext(ManzilikAiContext) as ManzilikAiProps;
  const { i18n } = useTranslation();

  return (
    <div
      className={`slider-tab ${selectedStyleFilter === tab.slug ? 'active' : ''}`}
      onClick={() => {
        setSelectedStyleFilter!(tab.slug);
        onFilterClick!(tab.slug);
      }}
    >
      {tab.name}
    </div>
  );
};

interface SliderProps {
  tabs: AIDesignStyle[];
  onFilterClick?: (id: string) => void;
}

const FilterCarousel: React.FC<SliderProps> = ({ tabs, onFilterClick }) => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const scrollTo = (scrollOffset: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += scrollOffset;
      setScrollLeft(sliderRef.current.scrollLeft);
    }
  };

  return (
    <div className="filter-slider-container">
      <img
        className="icon"
        src={!isRtl ? aiIcons.left : aiIcons.right}
        alt=""
        onClick={() => scrollTo(isRtl ? 100 : -100)}
      />

      <div className="slider" ref={sliderRef}>
        {tabs.map((tab, index) => (
          <SliderTab key={index} tab={tab} onFilterClick={onFilterClick} />
        ))}
      </div>
      <img
        className="icon"
        src={!isRtl ? aiIcons.right : aiIcons.left}
        alt=""
        onClick={() => scrollTo(isRtl ? -100 : 100)}
      />
    </div>
  );
};

export default FilterCarousel;
