/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { headerIcons } from '../../../assets/icons/header';
import { MenuItemsElements } from '../../headers/menu_items';
import { LANG, SHOPPING, GET_IDEAS, TV, SERVICES, MANZILIK_AI_TAB, QUOTATIONS } from '../../../locales/strings';
import ItemComponent from './itemComponent';
import { useHistory } from 'react-router-dom';
import { firstLevelMenu } from './first_level_menu';
import i18n from '../../../app/i18n';
import { AR, EN } from '../../../locales/constants';
import { saveLanguageToStorage } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { getIdeasMenu, getShoppingMenu } from '../../../app/providers/api';
import { useMainContext } from '../../../app/providers/main';
import { DepartmentsMenu, Menu } from '../../../app/providers/types';
import { breadcrumb } from '../../../API';
import { getSearchPagePath } from '../../headers/utils';
import useClickOutside from '../../../hooks/useClickOutside';
import { QueryStringKeys } from '../../../app/hooks/search/useSearchQuery';
import { GigsStepsContext } from '../../../context/gigs_steps_context';
import { Loading } from '../../loading';
import { useFeature, useFeatures } from 'flagged';
import { GIG_SERVICE_CLIENT, MANZILIK_AI_FLOW, ECOMMERCE_FEATURE, REQUEST_FOR_QUOTATION } from '../../../app/settings';
import { PRODUCTS_MAIN_ROUTE, REQUESTS_FOR_QUOTATIONS, REQUEST_GIG_SERVICE_ROUTE } from '../../../utils/routes';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import * as analytics from '../../../analytics';
import { UserRole } from '../../../app/types';

interface MobileSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
}

const MobileSidebar = (props: MobileSidebarProps) => {
  const { showSidebar, setShowSidebar } = props;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [menuItemsElements, setMenuItemsElements] = useState<MenuItemsElements[]>(firstLevelMenu);
  const [selectedMenuLevelTwo, setSelectedMenuLevelTwo] = useState<any>();
  const [selectedLabel, setSelectedLabel] = useState('');
  const { push, location } = useHistory();
  const { pathname } = location;
  const [isProfilePage, setIsProfilePage] = useState<boolean>(false);
  const { t } = useTranslation();
  const { userState, requestApi, dispatchUser } = useMainContext();
  const [ideasMenu, setIdeasMenu] = useState<any>();
  const [shoppingMenu, setShoppingMenu] = useState<any>();
  const features = useFeatures();
  const contextValue = useContext(GigsStepsContext);
  const isEcommerce = useFeature(ECOMMERCE_FEATURE);
  const professionalFromLocalStorage = JSON.parse(localStorage.getItem('Professional')!);
  const {
    ideasMenu: ideasMenuResponse,
    isIdeasMenuLoading,
    shoppingMenu: shoppingMenuResponse,
    isShoppingMenuLoading,
    isProfessional,
  } = useContext(SharedStateContext) as SharedStateInterface;
  const isGigsFlagOn = useFeature(GIG_SERVICE_CLIENT) && !isProfessional;

  const isQuotationFlagOn = useFeature(REQUEST_FOR_QUOTATION) && isProfessional;
  const handleManzilikAiClick = () => {
    const userType = userState.isAuthenticated ? 'registered' : 'guest';
    analytics.PublishEvent(new analytics.AnalyticsOpenManzilikAIEvent(userType));
  };
  if (!contextValue) {
    return <Loading />;
  }
  const { updateStep } = contextValue;

  const menuRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = () => {
    setShowSidebar(false);
  };
  useClickOutside(menuRef, handleOutsideClick);

  const onLanguageChange = (lng: string) => {
    saveLanguageToStorage(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    if (pathname.includes('profile')) {
      setIsProfilePage(true);
    } else {
      setIsProfilePage(false);
    }
  }, [pathname]);

  const getMenu = () => {
    if (!isIdeasMenuLoading) {
      const menuItems = ideasMenuResponse?.ideas?.map((item: any) => {
        return {
          ...item,
          link: `/${getSearchPagePath(item)}`,
        };
      });
      setIdeasMenu(menuItems);
    }
  };
  const getShoppingMenuList = () => {
    if (!isShoppingMenuLoading) {
      setShoppingMenu(shoppingMenuResponse);
    }
  };

  useEffect(() => {
    getMenu();
    getShoppingMenuList();
  }, [i18n.language, ideasMenuResponse?.ideas?.length, shoppingMenuResponse?.length]);

  const onItemClick = (elm: any) => {
    if (elm?.breadcrumbs) {
      push(
        `/products/${elm?.breadcrumbs[0]?.slug}/${elm?.breadcrumbs[1]?.slug}/?${QueryStringKeys.CATEGORIES}=${elm?.breadcrumbs[1]?.slug}`
      );
    } else {
      push(`/ideas/?${QueryStringKeys.CATEGORIES}=${elm.title}`);
    }
    setShowSidebar(false);
  };

  const handleSubMenuItemsClick = (breadcrumb: (breadcrumb | null)[]) => {
    if (breadcrumb?.length == 1) {
      push(`/products/${breadcrumb[0]?.slug}/?${QueryStringKeys.CATEGORIES}=${breadcrumb[0]?.slug}`);
    } else if (breadcrumb?.length == 2) {
      push(
        `/products/${breadcrumb[0]?.slug}/${breadcrumb[1]?.slug}/?${QueryStringKeys.CATEGORIES}=${breadcrumb[1]?.slug}`
      );
    } else if (breadcrumb?.length == 3) {
      push(
        `/products/${breadcrumb[0]?.slug}/${breadcrumb[1]?.slug}/${breadcrumb[2]?.slug}?${QueryStringKeys.CATEGORIES}=${breadcrumb[2]?.slug}`
      );
    }
  };

  const handleSelectedMenu = (itemLabel: string) => {
    switch (itemLabel) {
      case GET_IDEAS:
        setSelectedMenu(ideasMenu);
        break;
      case SHOPPING:
        setSelectedMenu(shoppingMenu);
        break;
      default:
        return;
    }
  };

  const onLevelOneClicked = (item: MenuItemsElements) => {
    setSelectedLabel(item.label);
    if (item.label == SERVICES) {
      updateStep(0);
    }
    if (item.withChildren) {
      setCurrentLevel(2);
      handleSelectedMenu(item.label);
    } else {
      push(item.link!);
      setShowSidebar(false);
    }
  };

  const onLevelTwoClicked = (item: any) => {
    setSelectedLabel(item.title);
    if (item.children) {
      setCurrentLevel(3);
      setSelectedMenuLevelTwo(item.children);
    } else {
      onItemClick(item);
      setShowSidebar(false);
    }
  };

  const onLevelThreeClicked = (item: any) => {
    handleSubMenuItemsClick(item.breadcrumbs);
    setShowSidebar(false);
  };

  const handleRenderLevelThree = (item: any) => {
    if (item.children) {
      return item.children.map((child: any) => {
        return (
          <>
            <ItemComponent
              key={child.title}
              item={child}
              withIcon={false}
              onItemClicked={() => onLevelThreeClicked(child)}
            />
          </>
        );
      });
    }
  };

  useEffect(() => {
    const newMenuItems = [...menuItemsElements];

    if (features[MANZILIK_AI_FLOW]) {
      const aiMenuItem = {
        icon: headerIcons.mobile_ai_icon,
        label: MANZILIK_AI_TAB,
        link: '/manzilik-ai',
      };
      // Insert the AI menu item at index 2
      newMenuItems.splice(2, 0, aiMenuItem);
    }

    if (isGigsFlagOn && isQuotationFlagOn) {
      newMenuItems.unshift(
        {
          icon: headerIcons.services_dark,
          label: SERVICES,
          link: REQUEST_GIG_SERVICE_ROUTE,
        },
        {
          icon: headerIcons.services_dark,
          label: QUOTATIONS,
          link: REQUESTS_FOR_QUOTATIONS,
        }
      );
    } else if (isGigsFlagOn) {
      newMenuItems.unshift({
        icon: headerIcons.services_dark,
        label: SERVICES,
        link: REQUEST_GIG_SERVICE_ROUTE,
      });
    } else if (isQuotationFlagOn) {
      newMenuItems.unshift({
        icon: headerIcons.services_dark,
        label: QUOTATIONS,
        link: REQUESTS_FOR_QUOTATIONS,
      });
    }

    if (isEcommerce) {
      const shoppingMenuItem = {
        icon: headerIcons.shopping_dark,
        label: SHOPPING,
        link: PRODUCTS_MAIN_ROUTE,
        withChildren: true,
      };
      // Insert the Shopping menu item at a specific position
      newMenuItems.splice(3, 0, shoppingMenuItem);
    }

    setMenuItemsElements(newMenuItems);
  }, [isGigsFlagOn, isEcommerce, features[MANZILIK_AI_FLOW], isQuotationFlagOn, isProfessional]);

  return (
    <div className="mobile-sidebar-wrapper">
      <div
        className={`mobile-sidebar ${showSidebar ? 'show overlay' : ''}`}
        ref={menuRef}
        style={{
          marginTop: isProfilePage ? '3rem' : '0',
        }}
      >
        <div className="mobile-sidebar-content">
          <ul>
            {currentLevel === 1 && (
              <div className="first-lvl">
                {menuItemsElements.map((item) => (
                  <ItemComponent
                    key={item.label}
                    item={item}
                    withIcon={true}
                    onItemClicked={() => {
                      if (item.label == MANZILIK_AI_TAB) {
                        handleManzilikAiClick();
                      }
                      onLevelOneClicked(item);
                    }}
                  />
                ))}
              </div>
            )}

            {currentLevel === 2 && (
              <>
                <div className="second-lvl">
                  <ItemComponent
                    item={{ label: selectedLabel, icon: headerIcons.arrow_dark }}
                    withIcon={true}
                    onItemClicked={() => setCurrentLevel(1)}
                    isHeader
                  />
                  {selectedMenu &&
                    selectedMenu.map((item: any) => (
                      <ItemComponent
                        key={item.title}
                        item={item}
                        withIcon={false}
                        onItemClicked={() => onLevelTwoClicked(item)}
                      />
                    ))}
                </div>
              </>
            )}

            {currentLevel === 3 && (
              <div className="third-lvl">
                <ItemComponent
                  item={{ label: selectedLabel, icon: headerIcons.arrow_dark }}
                  withIcon={true}
                  onItemClicked={() => setCurrentLevel(2)}
                  isHeader
                />
                {selectedMenuLevelTwo?.map((item: any) => {
                  return (
                    <>
                      <ItemComponent
                        key={item.title}
                        item={{ ...item, title: `${item.title} ${item.children.length > 0 ? '>' : ''}` }}
                        onItemClicked={() => onItemClick(item)}
                      />
                      {handleRenderLevelThree(item)}
                    </>
                  );
                })}
              </div>
            )}
          </ul>
        </div>
        <div className="lang-wrapper">
          <div className="mobile-lang">
            <p>{t(LANG)}</p>
            <div className="lang-options">
              <button className={i18n.language == EN ? 'selected' : ''} onClick={() => onLanguageChange(EN)}>
                English
              </button>
              <button className={i18n.language == AR ? 'selected' : ''} onClick={() => onLanguageChange(AR)}>
                عربي
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
