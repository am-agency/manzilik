/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import icons from '../../../../assets/icons';
import { useTranslation } from 'react-i18next';
import { BACK_HISTORY } from '../../../../locales/strings';
import ImageLabel from '../image_label';
import { useHistory, useLocation } from 'react-router-dom';
import { Tooltip } from 'antd';
import * as analytics from '../../../../analytics';

interface Tag {
  id: number;
  name: string;
}
interface OriginalImageComponentProps {
  imagePath?: string;
  listOfTags?: Tag[];
  selectedTagId?: string;
}

const OriginalImageComponent: React.FC<OriginalImageComponentProps> = ({
  imagePath = 'https://makhzan-qa.manzilik.com/uploads/ee1f665d-1b34-479c-8bc2-c705f97df8ad/PUBLIC/6067289e1b5b4db19dc92e3287c63dc3/3.png',
}) => {
  const { t } = useTranslation();
  const selectedDesignObject = JSON.parse(localStorage.getItem('selectedDesignObject')!) || {};
  const [selectedTagId, setSelectedTagId] = React.useState<string | undefined>(undefined);
  const location = useLocation();
  const { pathname } = location;
  const objectId = pathname.split('/')[3];
  const history = useHistory();

  return (
    <div className="original-image-container">
      <div className="header">
        <div className="title" onClick={() => window.history.back()}>
          <img src={icons.rightArrowSlim} alt="Back" />
          <span>{t(BACK_HISTORY)}</span>
        </div>
      </div>
      <div className="image-container">
        <ImageLabel
          imageSrc={
            selectedDesignObject?.processedImagesPath
              ? selectedDesignObject?.processedImagesPath[selectedDesignObject?.selectedImageIndex]
              : ''
          }
          labels={selectedDesignObject?.objects! as any}
          onLabelClicked={() => {
            analytics.PublishEvent(new analytics.AnalyticClickLabelEvent('Selected Design'));
            return;
          }}
          onViewSimilarClicked={() => {
            analytics.PublishEvent(new analytics.AnalyticViewSimilarEvent('Selected Design'));
          }}
        />
      </div>
      <div className="footer">
        <div className="tags-container">
          {selectedDesignObject &&
            selectedDesignObject?.objects?.map((tag: any) => {
              return (
                <div
                  key={tag?.id}
                  className={objectId === tag?.id ? 'tag active' : 'tag'}
                  onClick={() => {
                    history.push(`/manzilik-ai/suggested-products/${tag?.id}?isPurchased=${tag?.is_purchased}`);
                  }}
                >
                  {tag?.name && tag?.name.length > 10 ? (
                    <Tooltip title={tag?.name} placement="top">
                      <span>{tag?.name.length > 10 ? tag?.name.slice(0, 10) + '...' : tag?.name}</span>
                    </Tooltip>
                  ) : (
                    <span>{tag?.name}</span>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default OriginalImageComponent;
