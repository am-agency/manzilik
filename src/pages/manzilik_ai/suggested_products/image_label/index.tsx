import React, { useState, useEffect, useRef } from 'react';
import { ImageLabelProps } from './types';
import { useHistory } from 'react-router-dom';
import { SIMILAR_PRODUCTS } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { aiIcons } from '../../../../assets/icons/ai';
import { AI_OBJECT_RECOGNITION } from '../../../../app/settings';
import { useFeature } from 'flagged';
import { useMainContext } from '../../../../app/providers/main';

const ImageLabel: React.FC<ImageLabelProps> = ({ imageSrc, labels, onLabelClicked, onViewSimilarClicked }) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState({ x: 0, y: 0 });
  const history = useHistory();
  const { t } = useTranslation();
  const isAIRecognitionEnabled = useFeature(AI_OBJECT_RECOGNITION);
  const { userState } = useMainContext();
  const { isAuthenticated } = userState;

  const updateImageSize = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateImageSize);

    // Call once on mount to get initial size
    updateImageSize();

    return () => {
      window.removeEventListener('resize', updateImageSize);
    };
  }, []);

  const handleSimilarProductsRedirect = (id: string, isPurchased: boolean) => {
    if (!isAuthenticated) {
      history.push('/login');
      return;
    }
    history.push(`/manzilik-ai/suggested-products/${id}?&isPurchased=${isPurchased}`);
  };

  const handleSetSelectedCoordinates = (x: number, y: number) => {
    if (selectedCoordinates.x === x && selectedCoordinates.y === y) {
      setSelectedCoordinates({ x: 0, y: 0 });
    } else {
      setSelectedCoordinates({ x, y });
    }
  };

  return (
    <>
      <img className="list-img" ref={imageRef} src={imageSrc} alt="Analyzed" />
      {isAIRecognitionEnabled &&
        labels.map((label) => {
          const sumOfX = label.coordinates.reduce((acc, curr) => acc + curr.x, 0);
          const sumOfY = label.coordinates.reduce((acc, curr) => acc + curr.y, 0);
          const averageX = sumOfX / label.coordinates.length;
          const averageY = sumOfY / label.coordinates.length;

          return (
            <div
              className="label"
              key={label.id}
              style={{
                left: `${averageX * 100}%`,
                top: `${averageY * 100}%`,
              }}
              onClick={() => {
                handleSetSelectedCoordinates(averageX, averageY);
                onLabelClicked!(label);
              }}
            >
              <img src={aiIcons.label} alt="Label" />
              {selectedCoordinates.x === averageX && selectedCoordinates.y === averageY && (
                <div className="label-container">
                  <p className="label-name">{label.name}</p>
                  <p className="label-desc">{label.description}</p>
                  <button
                    className="label-button"
                    onClick={() => {
                      handleSimilarProductsRedirect(label.id, label.is_purchased!);
                      onViewSimilarClicked!();
                    }}
                  >
                    {t(SIMILAR_PRODUCTS)}
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </>
  );
};

export default ImageLabel;
