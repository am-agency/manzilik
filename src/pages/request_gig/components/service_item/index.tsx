import React from 'react';
import { Service } from '../../../../API';
import { Tooltip } from 'antd';
import { textSubstring } from '../../../../utils';
import { useMediaQuery } from 'react-responsive';

interface ServiceItemProps {
  item: Service;
  onItemClicked?: (item: Service) => void;
  withShortDescription?: boolean;
}

const ServiceItem = (props: ServiceItemProps) => {
  const { item, onItemClicked, withShortDescription = true } = props;
  const { image, title, short_description, long_description } = item;
  const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });
  return (
    <div
      className="service-item"
      onClick={() => {
        onItemClicked?.(item);
      }}
    >
      <div className="img-wrapper">
        <img src={image!} alt="" />
      </div>

      <div className="vertical-line"></div>
      <div className="service-item-details">
        <p className="title">{title}</p>
        <p className="sub-title">
          {withShortDescription ? (
            short_description
          ) : isSmallScreen ? (
            <Tooltip title={long_description}>{textSubstring(long_description!, 190)}</Tooltip>
          ) : (
            long_description
          )}
        </p>
      </div>
    </div>
  );
};

export default ServiceItem;
