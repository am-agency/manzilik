import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { WHITE } from '../../pages/projects/constants';
import i18n from '../../app/i18n';
import { getLayoutDirection } from '../../app/layouts';
import icons from '../../assets/icons';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { headerIcons } from '../../assets/icons/header';

interface Props {
  color?: string;
}

const Logo = ({ color }: Props) => {
  const isWhiteLogo = color === WHITE;
  const { xs, sm, md, lg, xl } = useBreakpoint();
  const isMobile = (xs || sm || md || lg) && !xl;

  return (
    <div className={`logo-wrapper ${getLayoutDirection(i18n.language)}`}>
      <Link to="/">
        {!isMobile ? (
          <img src={isWhiteLogo ? icons.whiteLogo : icons.logo} alt="Logo" className="logo-img" />
        ) : (
          <img src={isWhiteLogo ? headerIcons.mobileWhiteLogo : headerIcons.mobileLogo} alt="Logo" />
        )}
      </Link>
    </div>
  );
};

export default Logo;
