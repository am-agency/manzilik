/* eslint-disable no-console */
import React from 'react';

interface ShareProps {
  urlToShare: string;
}

const ShareComponent: React.FC<ShareProps> = ({ urlToShare }) => {
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: urlToShare,
        });
        console.log('Link shared successfully');
      } catch (error) {
        console.error('Error sharing link:', error);
      }
    } else {
      console.warn('Web Share API is not supported in this browser.');
    }
  };

  return (
    <div>
      <button onClick={handleShareClick}>Share Link</button>
    </div>
  );
};

export default ShareComponent;
