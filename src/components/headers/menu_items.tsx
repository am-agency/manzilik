import React, { useContext, useEffect, useState } from 'react';
import { Row } from 'antd';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  GET_IDEAS,
  MORE,
  PROFESSIONALS,
  PROJECTS,
  SHOPPING,
  DISCUSSIONS_SEARCH,
  MAGAZINES,
  SERVICES,
  MANZILIK_AI_TAB,
  QUOTATIONS,
  TRENDING,
} from '../../locales/strings';
import {
  PROFESSIONALS_ROUTE,
  PRODUCTS_MAIN_ROUTE,
  GENERIC_DISCUSSIONS_ROUTE,
  MAGAZINES_ROUTE,
  REQUEST_GIG_SERVICE_ROUTE,
  REQUESTS_FOR_QUOTATIONS,
} from '../../utils/routes';

import Separator from '../separator';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { IdeasMenu } from './ideas_menu';
import { ShoppingMenu } from './shopping_menu';
import { useMainContext } from '../../app/providers/main';
import { headerIcons } from '../../assets/icons/header';
import { MoreMenu } from './more_menu';
import i18n from '../../app/i18n';
import { getIdeasMenu } from '../../app/providers/api';
import { getLayoutDirection } from '../../app/layouts';
import { useFeature, useFeatures } from 'flagged';
import { ECOMMERCE_FEATURE, GIG_SERVICE_CLIENT, MANZILIK_AI_FLOW, REQUEST_FOR_QUOTATION } from '../../app/settings';
import { Menu } from '../../app/providers/types';
import { QueryStringKeys } from '../../app/hooks/search/useSearchQuery';
import { SortMethod } from '../../app/hooks/search/useSearchOptions';
import { ServicesMenu } from './services_menu';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';
import * as analytics from '../../analytics';
import { UserRole } from '../../app/types';

export interface MenuItemsElements {
  icon: string;
  label: string;
  link?: string;
  withChildren?: boolean;
}

export const MenuItems = () => {
  const { t } = useTranslation();
  const { xs, sm } = useBreakpoint();
  const { requestApi, userState } = useMainContext();
  const [menuItems, setMenuItems] = useState<Menu>();
  const isEcommerce = useFeature(ECOMMERCE_FEATURE);
  const features = useFeatures();
  const { ideasMenu, isIdeasMenuLoading, isProfessional } = useContext(SharedStateContext) as SharedStateInterface;
  const professionalFromLocalStorage = JSON.parse(localStorage.getItem('Professional')!);

  const isQuotationFlagOn = useFeature(REQUEST_FOR_QUOTATION) && isProfessional;
  const isGigsFlagOn = useFeature(GIG_SERVICE_CLIENT) && !isProfessional;

  const handleManzilikAiClick = () => {
    const userType = userState.isAuthenticated ? 'registered' : 'guest';
    analytics.PublishEvent(new analytics.AnalyticsOpenManzilikAIEvent(userType));
  };

  const [menuItemsElements, setMenuItemsElements] = useState<MenuItemsElements[]>([
    { icon: headerIcons.ideas, label: GET_IDEAS },
    { icon: headerIcons.professional, label: PROFESSIONALS, link: PROFESSIONALS_ROUTE },
    {
      icon: headerIcons.shopping,
      label: SHOPPING,
      link: PRODUCTS_MAIN_ROUTE,
    },
    { icon: headerIcons.discussions, label: DISCUSSIONS_SEARCH, link: GENERIC_DISCUSSIONS_ROUTE },
    { icon: headerIcons.magazines, label: MAGAZINES, link: MAGAZINES_ROUTE },

    {
      icon: headerIcons.more,
      label: MORE,
    },
  ]);
  useEffect(() => {
    const newMenuItems = [...menuItemsElements];

    if (features[MANZILIK_AI_FLOW]) {
      const aiMenuItem = {
        icon: headerIcons.ai_icon,
        label: MANZILIK_AI_TAB,
        link: '/manzilik-ai',
      };
      // Insert the AI menu item at index 2
      newMenuItems.splice(2, 0, aiMenuItem);
    }

    if (isGigsFlagOn && isQuotationFlagOn) {
      newMenuItems.unshift(
        {
          icon: headerIcons.gigs_icon,
          label: SERVICES,
          link: REQUEST_GIG_SERVICE_ROUTE,
        },
        {
          icon: headerIcons.gigs_icon,
          label: QUOTATIONS,
          link: REQUESTS_FOR_QUOTATIONS,
        }
      );
    } else if (isGigsFlagOn) {
      newMenuItems.unshift({
        icon: headerIcons.gigs_icon,
        label: SERVICES,
        link: REQUEST_GIG_SERVICE_ROUTE,
      });
    } else if (isQuotationFlagOn) {
      newMenuItems.unshift({
        icon: headerIcons.gigs_icon,
        label: QUOTATIONS,
        link: REQUESTS_FOR_QUOTATIONS,
      });
    }

    if (isEcommerce) {
      const shoppingMenuItem = {
        icon: headerIcons.shopping,
        label: SHOPPING,
        link: PRODUCTS_MAIN_ROUTE,
        withChildren: true,
      };
      // Insert the Shopping menu item at a specific position
      newMenuItems.splice(3, 0, shoppingMenuItem);
    }

    setMenuItemsElements(newMenuItems);
  }, [isGigsFlagOn, isEcommerce, features[MANZILIK_AI_FLOW], isQuotationFlagOn, isProfessional]);

  const isMobile = xs || sm;

  const getMenu = () => {
    if (!isIdeasMenuLoading) {
      setMenuItems(ideasMenu as Menu);
    }
  };

  const renderDefaultItem = (item: MenuItemsElements) => (
    <div className="items-wrapper">
      <Link to={item.link!}>
        <div className="menu-item-label">
          <Separator horizontal={8} responsive />
          <img src={item.icon} className={`menu-item-icon ${getLayoutDirection(i18n.language)}`} alt={item.label} />
          <Separator horizontal={3} />
          <span className="menu-item-text"> {t(item.label)}</span>
          <Separator horizontal={8} responsive />
        </div>
      </Link>
    </div>
  );

  const renderListItems = (item: MenuItemsElements) => {
    switch (item.label) {
      case SERVICES:
        return (
          <div className="items-wrapper">
            <ServicesMenu item={item} ideas={menuItems?.ideas!} />
          </div>
        );

      case GET_IDEAS:
        return (
          <div className="items-wrapper">
            <IdeasMenu item={item} ideas={menuItems?.ideas!} />
          </div>
        );
      case PROJECTS:
        return <>{!userState.isAuthenticated ? <div /> : renderDefaultItem(item)}</>;
      case SHOPPING:
        return <div className="items-wrapper">{isEcommerce && <ShoppingMenu item={item} />}</div>;
      case MORE:
        return (
          <div className="items-wrapper">
            <MoreMenu item={item} menuItems={menuItems!} />
          </div>
        );
      case MANZILIK_AI_TAB:
        return (
          <Link to={item.link!} onClick={handleManzilikAiClick}>
            <div className="items-wrapper">
              <div className="menu-item-label">
                <Separator horizontal={8} responsive />
                <img
                  src={item.icon}
                  className={`menu-item-icon ${getLayoutDirection(i18n.language)}`}
                  alt={item.label}
                />
                <Separator horizontal={3} />
                <span className="menu-item-text"> {t(item.label)}</span>
                <span className="new-label">{t(TRENDING)}</span>
                <Separator horizontal={8} responsive />
              </div>
            </div>
          </Link>
        );
      default:
        return renderDefaultItem(item);
    }
  };

  useEffect(() => {
    getMenu();
  }, [i18n.language, ideasMenu.ideas?.length]);

  return (
    <Row className="menu-items-wrapper" wrap={false} justify={isMobile ? 'space-around' : 'center'} align="middle">
      {menuItemsElements.map((item) => {
        return renderListItems(item);
      })}
    </Row>
  );
};
