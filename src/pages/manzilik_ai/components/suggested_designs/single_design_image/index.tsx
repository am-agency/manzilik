/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { aiIcons } from '../../../../../assets/icons/ai';
import { ManzilikAiContext, ManzilikAiProps } from '../../../manzilik_ai_context';
import { useMainContext } from '../../../../../app/providers/main';
import { selectAIDesignImage } from '../../../api';
interface SingleDesignImageProps {
  image: {
    id: string;
    image: string;
  };
  setCurrentImage: (index: number) => void;
  setIsViewerOpen: (isOpen: boolean) => void;
  index: number;
  currentImage: number;
  setSelectedImage?: (id: string) => void;
  selectedImage?: string;
  setSelectedIndex?: (index: number) => void;
  renderedImages: {
    id: string;
    image: string;
  }[];
}

function SingleDesignImage(props: SingleDesignImageProps) {
  const {
    image,
    setIsViewerOpen,
    setCurrentImage,
    index,
    setSelectedImage,
    selectedImage,
    renderedImages,
    setSelectedIndex,
  } = props;
  const { id, image: imageSrc } = image;
  const [isChecked, setIsChecked] = useState(false || selectedImage === image.id!);
  const { setSelectedImageIndex, selectedDesignObject, setAfterImageURL } = useContext(
    ManzilikAiContext
  ) as ManzilikAiProps;
  const { requestApi } = useMainContext();

  const openImageViewer = useCallback((e, index) => {
    e.stopPropagation();
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const onItemSelect = () => {
    setIsChecked(true);
    setSelectedImage && setSelectedImage(image.id);
    setSelectedImageIndex!(index);
    setAfterImageURL!(image.image);
    setSelectedIndex!(index);
  };

  useEffect(() => {
    if (selectedImage === image.id) {
      setIsChecked(true);
      setAfterImageURL!(renderedImages[0]?.image);
    }
  }, []);
  return (
    <div className="suggested-image-item" onClick={onItemSelect}>
      <img src={imageSrc} alt="" className={`${selectedImage !== image.id && 'unchecked'}`} />
      <img src={aiIcons.fullScreen} alt="" className="full-screen" onClick={(e) => openImageViewer(e, index)} />
      {isChecked && selectedImage === image.id && (
        <div className="check-icon">
          <img src={aiIcons.check} />
        </div>
      )}
    </div>
  );
}

export default SingleDesignImage;
