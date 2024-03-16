import React from 'react';
import { profileIcons } from '../../../../../assets/icons/profile';
import { FIVE_POINTS, SAR, TO_USE_IN_AI, WILL_ADDED } from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';

interface PriceCardProps {
  actualPrice: string;
  discountPrice: string;
  info?: string;
}

const RfqPriceCard: React.FC<PriceCardProps> = ({ actualPrice, discountPrice, info }) => {
  const { t } = useTranslation();
  return (
    <div className="rfq-price-card">
      <img src={profileIcons.coins} alt="price icon" />
      <div className="prices">
        <span className="actual-price">{`${actualPrice} ${t(SAR)}`} </span>
        <span className="discount-price">{`${discountPrice} ${t(SAR)}`}</span>
        <div className="info">
          {info ? (
            <p>{info}</p>
          ) : (
            <p>
              {t(WILL_ADDED)} <span> {t(FIVE_POINTS)} </span> {t(TO_USE_IN_AI)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RfqPriceCard;
