import { Tooltip } from 'antd';
import React from 'react';
import { SAR } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import * as analytics from '../../../../analytics';

interface ProductCardProps {
  title: string;
  imageSrc: string;
  subtitle: string;
  price: number;
  sourceLogo?: string;
  link?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, imageSrc, subtitle, price, sourceLogo, link }) => {
  const { t } = useTranslation();
  return (
    <div
      className="productCard"
      onClick={() => {
        if (link) {
          window.open(link, '_blank');
        }
        analytics.PublishEvent(new analytics.AnalyticViewProductEvent(subtitle));
      }}
    >
      <img src={imageSrc} alt={title} className="productImage" />
      <p className="productTitle">
        <Tooltip title={title}>{title.length > 15 ? title.slice(0, 15) + '...' : title}</Tooltip>
      </p>
      <div className="productSubtitleContainer">
        <img
          src={sourceLogo || 'https://ps.w.org/woo-aliexpress/assets/icon-128x128.png?rev=2162754'}
          alt="Small Image"
          className="productSubtitleImage"
        />
        <p className="productSubtitle">{subtitle}</p>
      </div>
      <p className="productPrice">{`${price > 0 ? price : '-'} ${t(SAR)}`}</p>
    </div>
  );
};

export default ProductCard;
