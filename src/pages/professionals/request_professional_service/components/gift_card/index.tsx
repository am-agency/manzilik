import React from 'react';
import { profileIcons } from '../../../../../assets/icons/profile';

interface GiftCardProps {
  message: string;
  title?: string;
}

const GiftCard: React.FC<GiftCardProps> = ({ message, title }) => {
  return (
    <div className="gift-card">
      <div className="gift-card-icon">
        <img src={profileIcons.gift} alt="gift card" />
      </div>

      <div className="gift-card-message">
        <p className="gift-card-title">{title}</p>
        <p className="gift-card-subtitle">{message}</p>
      </div>
    </div>
  );
};

export default GiftCard;
