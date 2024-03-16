import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ARContent from './ar';
import ENContent from './en';

const HowManzilikAiWorks = () => {
  const { i18n } = useTranslation();
  const [isArabicContent, setIsArabicContent] = React.useState(false);

  useEffect(() => {
    if (i18n.language === 'ar') {
      setIsArabicContent(true);
    } else {
      setIsArabicContent(false);
    }
  }, [i18n.language]);

  return <>{isArabicContent ? <ARContent /> : <ENContent />}</>;
};

export default HowManzilikAiWorks;
