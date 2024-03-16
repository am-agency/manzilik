import { Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SAR } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { aiIcons } from '../../../../assets/icons/ai';
import { ObjectRecognitionContext, ObjectRecognitionProps } from '../object_recognation_context';

interface PremiumCardProps {
  title?: string;
  imageSrc?: string;
  subtitle?: string;
  count?: number;
  sourceLogo?: string;
  link?: string;
  onPremiumCardClick?: () => void;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  title = 'Product Image',
  imageSrc = 'https://makhzan-qa.manzilik.com/media/Category/%D8%AD%D9%85%D8%A7%D9%85.jpg',
  subtitle = 'ايكيا',
  count = 8,
  sourceLogo = 'https://makhzan-qa.manzilik.com/media/Category/%D8%AD%D9%85%D8%A7%D9%85.jpg',
  link = '',
  onPremiumCardClick,
}) => {
  const { t } = useTranslation();
  const [premiumVendorsPhotos, setPremiumVendorsPhotos] = useState<string[]>([]);
  const [premiumVendorsNames, setPremiumVendorsNames] = useState<string[]>([]);
  const [premiumVendorsCount, setPremiumVendorsCount] = useState<number>(0);
  const { listPremiumVendors } = useContext(ObjectRecognitionContext) as ObjectRecognitionProps;

  useEffect(() => {
    if (listPremiumVendors.length > 0) {
      const photos = listPremiumVendors.map((vendor) => vendor.photo) as string[];
      const names = listPremiumVendors.map((vendor) => vendor.name) as string[];
      const counts = listPremiumVendors.reduce((acc, vendor) => {
        acc += vendor.products_count!;
        return acc;
      }, 0 as number);

      setPremiumVendorsPhotos(photos!);
      setPremiumVendorsNames(names);
      setPremiumVendorsCount(counts);
    }
  }, [listPremiumVendors]);

  return (
    <div className="premiumCard" onClick={onPremiumCardClick}>
      <div className="upper-area">
        <div className="images-wrapper">
          <img
            src={'https://makhzan-qa.manzilik.com/media/Category/%D9%85%D8%B7%D8%A8%D8%AE.jpg' || imageSrc}
            alt="Product Image"
            className="right-image"
          />
          <img
            src={
              'https://makhzan-qa.manzilik.com/media/Category/%D8%BA%D8%B1%D9%81%D8%A9_%D9%85%D8%B9%D9%8A%D8%B4%D8%A9.png' ||
              imageSrc
            }
            alt="Product Image"
            className="left-image"
          />
          <div className="middle-image">
            <img
              src={
                'https://makhzan-qa.manzilik.com/media/Category/%D8%BA%D8%B1%D9%81%D8%A9_%D9%86%D9%88%D9%85.png' ||
                imageSrc
              }
              alt="Product Image"
            />
          </div>
        </div>
        <div className="lock-section">
          <img src={aiIcons.lock} alt="Lock" />
        </div>
      </div>
      <div className="lower-area">
        <p className="productTitle"></p>
        <div className="productSubtitleContainer">
          <img
            src={sourceLogo || 'https://makhzan-qa.manzilik.com/media/Category/%D8%AD%D9%85%D8%A7%D9%85.jpg'}
            alt="Small Image"
            className="productSubtitleImage"
          />
          <p className="productSubtitle">
            <Tooltip title={premiumVendorsNames.join(',')}>
              <span>
                {premiumVendorsNames.join(',').length > 20
                  ? `${premiumVendorsNames.join(',').slice(0, 20)}...`
                  : premiumVendorsNames.join(',')}
              </span>
            </Tooltip>
          </p>
        </div>
        <p className="productPrice">{`${`${premiumVendorsCount} ${t('منتج')}`}`}</p>
      </div>
    </div>
  );
};

export default PremiumCard;
