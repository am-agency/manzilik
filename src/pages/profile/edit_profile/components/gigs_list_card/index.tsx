import React from 'react';
import Image from '../../../../../assets/images/Empty.svg';
import icons from '../../../../../assets/icons';
import { ACTIVATED, NOT_AVAILABLE, SAR } from '../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { GigsListItem } from '../../my_gigs/types';
import DefaultImage from '../../../../../assets/images/default/Defult-Image-147.png';
import { Tooltip } from 'antd';
import { modifyImageUrl, textSubstring } from '../../../../../utils';

interface GigsListCardProps {
  gig?: GigsListItem;
  onGigClick?: () => void;
}
const GigsListCard = (props: GigsListCardProps) => {
  const { gig, onGigClick } = props;
  const listOfCities = gig?.cities.map((city) => city.name).join(', ');
  const { t } = useTranslation();
  return (
    <div className="gigs-list-card-container" onClick={() => onGigClick!()}>
      <div className="img-wrapper">
        <img src={modifyImageUrl(gig?.photos[0]!, 167) || DefaultImage} alt="image" />
      </div>
      <div className="content">
        <div className="title">
          <img src={icons.my_gigs.arrow_left_small} alt="arrow" />
          <span>{gig?.title}</span>
        </div>
        <div className="description">
          <Tooltip title={gig?.description}> {textSubstring(gig?.description! || '', 50)}</Tooltip>
        </div>
        <div className="details">
          <div className="price">
            {gig?.price}
            <span>{t(SAR)}</span>
          </div>
          <div
            className="status"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}
          >
            <span
              style={{
                backgroundColor: gig?.is_enabled == true ? '#56D49B' : '#FF3B30',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                display: 'inline-block',
                marginInlineStart: '0px',
              }}
            />
            {gig?.is_enabled == true ? t(ACTIVATED) : t(NOT_AVAILABLE)}
          </div>
          <div className="location">{listOfCities}</div>
        </div>
      </div>
    </div>
  );
};

export default GigsListCard;
