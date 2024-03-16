import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VIEW_LESS, VIEW_MORE } from '../../locales/strings';

interface DescriptionProps {
  descriptionText: string;
  descriptionTextLength?: number;
}

const DescriptionToggle: React.FC<DescriptionProps> = ({ descriptionText, descriptionTextLength = 50 }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { t } = useTranslation();

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const renderDescription = () => {
    if (descriptionText.length <= descriptionTextLength || showFullDescription) {
      return (
        <>
          <p>
            {descriptionText}
            {descriptionText.length > descriptionTextLength && (
              <>
                <span className="dots">...</span>
                <span className="view-more-less" onClick={toggleDescription}>
                  {showFullDescription ? t(VIEW_LESS) : t(VIEW_MORE)}
                </span>
              </>
            )}
          </p>
        </>
      );
    }

    const shortenedText = `${descriptionText.substring(0, descriptionTextLength)}`;
    return (
      <>
        <p>
          {shortenedText}
          <span className="dots">...</span>
          <span className="view-more-less" onClick={toggleDescription}>
            {showFullDescription ? t(VIEW_LESS) : t(VIEW_MORE)}
          </span>
        </p>
      </>
    );
  };

  return <div className="description">{renderDescription()}</div>;
};

export default DescriptionToggle;
