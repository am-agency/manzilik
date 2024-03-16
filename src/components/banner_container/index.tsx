import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const BannerContainer = ({ children }: Props) => {
  return <div className="banner-container">{children}</div>;
};

export default BannerContainer;
