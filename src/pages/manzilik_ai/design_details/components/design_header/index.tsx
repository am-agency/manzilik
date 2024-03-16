import React, { useContext, useState } from 'react';
import FilterToggle from '../../../components/filter_toggle';
import DesignShare from '../design_share';
import { AFTER, BEFORE } from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { ManzilikAiContext, ManzilikAiProps } from '../../../manzilik_ai_context';
import ImageViewer from 'react-simple-image-viewer';

export enum CurrentToggle {
  BEFORE = 'before',
  AFTER = 'after',
}

function DesignHeader() {
  const [currentToggle, setCurrentToggle] = useState<string>(CurrentToggle.AFTER);
  const { t } = useTranslation();
  const onFilterToggle = (id: string) => {
    setCurrentToggle(id);
  };
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const closeImageViewer = () => setIsViewerOpen(false);
  const selectedDesign = JSON.parse(localStorage.getItem('selectedDesign') || '{}');
  const originalImageURL = selectedDesign?.sourceImageUrl;
  const afterImageURL = selectedDesign?.processedImagesPath[selectedDesign?.selectedImageIndex];

  return (
    <div className="design-header-wrapper">
      <img
        className="generatedImage"
        src={currentToggle === CurrentToggle.BEFORE ? originalImageURL : afterImageURL}
        alt=""
      />
      <DesignShare setIsViewerOpen={setIsViewerOpen} />
      <div className="selected-design-toggle">
        <FilterToggle
          currentToggle={currentToggle}
          onFilterToggle={onFilterToggle}
          listOfFilters={[
            {
              id: 1,
              name: t(BEFORE),
              value: CurrentToggle.BEFORE,
            },
            {
              id: 2,
              name: t(AFTER),
              value: CurrentToggle.AFTER,
            },
          ]}
        />
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={[`${currentToggle === CurrentToggle.BEFORE ? originalImageURL : afterImageURL}`]}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
          rightArrowComponent={<div className="right-arrow"></div>}
          leftArrowComponent={<div className="left-arrow"></div>}
        />
      )}
    </div>
  );
}

export default DesignHeader;
