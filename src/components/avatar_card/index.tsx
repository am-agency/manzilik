import { Rate } from 'antd';
import React from 'react';
import DefaultImage from '../../assets/images/default/Prof.png';
import { getFloatRoundDown, getFloatRoundUp } from '../../pages/professionals/utils';

interface AvatarProps {
  imageUrl: string;
  name: string;
  title?: string | React.ReactNode;
  rate?: number;
  rateFontSize?: string;
  onNameClick?: () => void;
  center?: boolean;
}

const AvatarCard = ({ imageUrl, name, title, rate, rateFontSize, onNameClick, center = false }: AvatarProps) => (
  <div className={`avatar-container ${center ? 'center' : ''}`} onClick={onNameClick}>
    <img src={imageUrl || DefaultImage} alt="Avatar" className="avatar-image" />
    <div className="avatar-details">
      <p className="avatar-name">{name}</p>
      <p className="avatar-title">
        {title ? title : ''}
        &nbsp;&nbsp;&nbsp;
        {rate && <span className="rating-number">{(getFloatRoundUp(rate!) || '0.0') + '\t\t\t'}</span>}
        &nbsp;&nbsp;&nbsp;
        {rate ? (
          <Rate
            value={rate}
            disabled
            allowHalf
            style={{
              fontSize: rateFontSize,
            }}
          />
        ) : null}
      </p>
    </div>
  </div>
);

export default AvatarCard;
