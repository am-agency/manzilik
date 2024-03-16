/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { aiIcons } from '../../../../assets/icons/ai';
import ImageViewer from 'react-simple-image-viewer';
import SingleDesignImage from './single_design_image';
import UserHeaderAI from '../user_header';
import { useHistory } from 'react-router-dom';
import { CONTINUE_BTN, ORIGINAL, SELECT_IMAGE } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import ShareComponent from '../../../../components/share';
import { uuid4 } from '@sentry/utils';
import {
  ManzilikAILayouts,
  ManzilikAiContext,
  ManzilikAiProps,
  ManzilikMobileViews,
  ManzilikViews,
} from '../../manzilik_ai_context';
import * as analytics from '../../../../analytics';
import { MANZILIK_AI_DESIGN_DETAILS } from '../../../../utils/routes';
import { useMediaQuery } from 'react-responsive';
import { useMainContext } from '../../../../app/providers/main';
import { selectAIDesignImage } from '../../api';

const arrayOfSuggestedImages = [
  {
    id: '1',
    image: 'https://makhzan-qa.manzilik.com/media/Category/حمام.jpg',
  },
  {
    id: '2',
    image: 'https://makhzan-qa.manzilik.com/media/Category/حمام.jpg',
  },
  {
    id: '3',
    image: 'https://makhzan-qa.manzilik.com/media/Category/حمام.jpg',
  },
  {
    id: '4',
    image: 'https://makhzan-qa.manzilik.com/media/Category/حمام.jpg',
  },
];
interface SuggestedDesignsProps {
  listImages?: string[];
}

const SuggestedDesigns = (props: SuggestedDesignsProps) => {
  const arrayOfImagesString = arrayOfSuggestedImages.map((item) => item.image);
  const { listImages = arrayOfImagesString } = props;
  const [renderedImages, setRenderedImages] = useState<
    {
      id: string;
      image: string;
    }[]
  >([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isTabletView = useMediaQuery({ query: '(max-width: 768px)' });
  const history = useHistory();
  const { t } = useTranslation();
  const { selectedDesignObject, setCurrentMobileView, setCurrentLayoutView } = useContext(
    ManzilikAiContext
  ) as ManzilikAiProps;
  const { requestApi } = useMainContext();

  const [selectedImage, setSelectedImage] = useState(renderedImages[0]?.id!);

  useEffect(() => {
    const renderedImages = listImages.map((item, index) => {
      return {
        id: uuid4(),
        image: item,
      };
    });
    setRenderedImages(renderedImages);
    setSelectedImage(renderedImages[0]?.id!);
  }, [listImages]);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const onSelectAIDesignImage = () => {
    requestApi(
      selectAIDesignImage,
      { id: selectedDesignObject?.id, index: selectedIndex },
      (response: any, error: any) => {
        const design = response.data.selectAIDesignImage;
        localStorage.setItem('selectedDesign', JSON.stringify(design));
        if (error) {
          return;
        }
      }
    );
  };

  const HandleRedirection = () => {
    onSelectAIDesignImage();
    history.push(`${MANZILIK_AI_DESIGN_DETAILS}/${selectedDesignObject?.id}`);
    setCurrentLayoutView!(ManzilikAILayouts.DEFAULT);
    const isFirstImage = selectedImage === renderedImages[0]?.id!;
    analytics.PublishEvent(new analytics.AnalyticsSelectDesignAIEvent(isFirstImage ? 'Default' : 'Other'));
  };

  const handleReSelectOptions = () => {
    setCurrentMobileView!(ManzilikMobileViews.LIST);
  };

  return (
    <>
      <div className="suggested-designs-wrapper">
        {/* <UserHeaderAI title={t(SELECT_IMAGE)} /> */}
        <div className="suggested-designs-content">
          {/* <div className="user-upload-img">
            <img src={originalImageURL} alt="" />
            <p>{t(ORIGINAL)}</p>
          </div> */}
          <div className="suggested-images-wrapper">
            <div className="suggested-image">
              {renderedImages.map((item, index) => {
                return (
                  <SingleDesignImage
                    key={index}
                    setCurrentImage={setCurrentImage}
                    setIsViewerOpen={setIsViewerOpen}
                    setSelectedImage={setSelectedImage}
                    selectedImage={selectedImage}
                    index={index}
                    image={item}
                    currentImage={currentImage}
                    renderedImages={renderedImages}
                    setSelectedIndex={setSelectedIndex}
                  />
                );
              })}
            </div>
            {isViewerOpen && (
              <ImageViewer
                src={renderedImages.map((item) => item.image)}
                currentIndex={currentImage}
                disableScroll={false}
                closeOnClickOutside={true}
                onClose={closeImageViewer}
                rightArrowComponent={<div className="right-arrow"></div>}
                leftArrowComponent={<div className="left-arrow"></div>}
              />
            )}
          </div>
          <div className="actions-wrapper">
            {isTabletView && (
              <button className="select-design" onClick={handleReSelectOptions}>
                {t('إعادة التخصيص')}
              </button>
            )}

            <button className="continue" onClick={HandleRedirection}>
              {t(CONTINUE_BTN)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuggestedDesigns;
