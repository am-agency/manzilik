import React, { useState, useEffect, useContext } from 'react';
import { Col, Divider, Menu, Row, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

// hooks
import { useMainContext } from '../../app/providers/main';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';

// api
import { breadcrumb, Department } from '../../API';
import { getShoppingMenu } from '../../app/providers/api';

// components
import DropdownPopover from '../dropdown_popover';

import { toArrayOrEmpty } from '../../pages/idea/utils';
import { getLayoutDirection } from '../../app/layouts';
import { MenuItemsElements } from './menu_items';
import Separator from '../separator';
import { DepartmentsMenu } from '../../app/providers/types';
import { MORE } from '../../locales/strings';
import { photos } from './mock';
import { QueryStringKeys } from '../../app/hooks/search/useSearchQuery';
import { Link } from 'react-router-dom';
import { PRODUCTS_MAIN_ROUTE } from '../../utils/routes';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';

interface Props {
  item: MenuItemsElements;
}

// should redesign the shopping menu to match with other menu's style
export const ShoppingMenu = ({ item }: Props) => {
  const { t, i18n } = useTranslation();
  const { requestApi } = useMainContext();
  const [menuItems, setMenuItems] = useState<DepartmentsMenu[]>([]);
  const history = useHistory();
  const location = useLocation();
  const [subMenuContent, setSubMenuContent] = useState<(Department | null)[]>();
  const [defaultSelectedKey, setDefaultSelectedKey] = useState<string>();
  const isHomePage = location.pathname === '/';
  const [height, setHeight] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const updatedStyle = { minHeight: 300 };
  const itemsMaxNumber = 6;
  const titleMaxLength = 20;
  const { shoppingMenu, isShoppingMenuLoading } = useContext(SharedStateContext) as SharedStateInterface;

  const onVisibleChange = () => {
    setIsOpen(true);
  };

  const getMenu = () => {
    if (!isShoppingMenuLoading) {
      setMenuItems(shoppingMenu);
      const defaultSubMenuContent = shoppingMenu && shoppingMenu[0]?.children;
      const defaultKey = shoppingMenu && shoppingMenu[0]?.title;
      setSubMenuContent(toArrayOrEmpty(defaultSubMenuContent!));
      setDefaultSelectedKey(defaultKey!);
    }
  };

  const onMouseLeave = () => {
    setSubMenuContent(toArrayOrEmpty(menuItems[0]?.children!));
    setDefaultSelectedKey(menuItems[0]?.title!);
  };

  const onMenuItemHover = (item: (Department | null)[] | DepartmentsMenu[]) => {
    setSubMenuContent(toArrayOrEmpty(item));
    setDefaultSelectedKey('');
  };

  const onItemClick = (elm: DepartmentsMenu) => {
    history.push(`/products/${elm.slug}?${QueryStringKeys.CATEGORIES}=${elm.slug}`);
    setSubMenuContent(toArrayOrEmpty(menuItems[0]?.children!));
    setDefaultSelectedKey(menuItems[0]?.title!);
  };

  const handleSubMenuItemsClick = (breadcrumb: (breadcrumb | null)[]) => {
    setSubMenuContent(toArrayOrEmpty(menuItems && menuItems[0]?.children!));
    setDefaultSelectedKey(menuItems[0]?.title!);
    if (breadcrumb?.length == 1) {
      history.push(`/products/${breadcrumb[0]?.slug}?${QueryStringKeys.CATEGORIES}=${breadcrumb[0]?.slug}`);
    } else if (breadcrumb?.length == 2) {
      history.push(
        `/products/${breadcrumb[0]?.slug}/${breadcrumb[1]?.slug}?${QueryStringKeys.CATEGORIES}=${breadcrumb[1]?.slug}`
      );
    } else if (breadcrumb?.length == 3) {
      history.push(
        `/products/${breadcrumb[0]?.slug}/${breadcrumb[1]?.slug}/${breadcrumb[2]?.slug}?${QueryStringKeys.CATEGORIES}=${breadcrumb[2]?.slug}`
      );
    }
  };

  useEffect(() => {
    getMenu();
  }, [i18n.language, shoppingMenu?.length]);

  useEffect(() => {
    const element = document.getElementById('shopping-popover');
    if (element) {
      setHeight(element.clientHeight!);
    }
  }, [isOpen]);

  const slicedMenuItems = menuItems?.slice(5, menuItems.length);
  const slicedMenuItemsChildren = (slicedMenuItems as DepartmentsMenu[])?.map((elm) => {
    return { ...elm, children: [] };
  }) as DepartmentsMenu[];

  return (
    <div onMouseLeave={onMouseLeave}>
      <DropdownPopover
        content={
          <Row
            justify="center"
            style={updatedStyle}
            id={`${!isHomePage && 'shopping-popover'}`}
            className={`${!isHomePage ? 'popover-content' : ''}`}
          >
            <Col
              xl={isHomePage ? 21 : 24}
              lg={isHomePage ? 21 : 24}
              md={isHomePage ? 23 : 24}
              sm={isHomePage ? 23 : 24}
              xs={isHomePage ? 23 : 24}
              className="popover-container"
            >
              <div
                id="shopping-popover"
                style={updatedStyle}
                className={`shopping-menu content-wrapper ${isHomePage && 'popover-content'} ${getLayoutDirection(
                  i18n.language
                )}`}
              >
                <Row align="middle" justify="center" className="shopping-menu-container">
                  <Col
                    xl={isHomePage ? 24 : 23}
                    lg={isHomePage ? 24 : 23}
                    md={isHomePage ? 24 : 23}
                    sm={isHomePage ? 24 : 23}
                    xs={isHomePage ? 24 : 23}
                  >
                    <Row>
                      <Menu mode="horizontal" selectedKeys={[menuItems[0]?.title!]} className="shopping-menu-items">
                        {menuItems?.slice(0, 5)?.map((elm, index) => {
                          const isDefaultSelected = defaultSelectedKey == elm.title;
                          return (
                            <>
                              <Col className={`sub-menu-title ${index == 0 ? 'first-item' : ''}`} key={elm.title}>
                                <Menu.Item
                                  className={isDefaultSelected ? 'menu-item-title selected-key' : 'menu-item-title'}
                                  key={elm.title}
                                  onClick={() => onItemClick(elm)}
                                  onMouseMove={() => onMenuItemHover(elm?.children!)}
                                >
                                  <Typography.Text className="item-heading">{elm.title}</Typography.Text>
                                </Menu.Item>
                              </Col>
                            </>
                          );
                        })}
                        {
                          <Col className="sub-menu-title">
                            <Menu.Item
                              className="menu-item-title"
                              key="shopping-menu"
                              onMouseMove={() => {
                                setSubMenuContent(toArrayOrEmpty(slicedMenuItemsChildren!));
                              }}
                            >
                              <Typography.Text className="item-heading">{t(MORE)}</Typography.Text>
                            </Menu.Item>
                          </Col>
                        }
                      </Menu>
                    </Row>
                  </Col>
                </Row>

                <div className="sub-menu-content">
                  <Row className="wrapper" justify="center">
                    <Col
                      xl={isHomePage ? 24 : 23}
                      lg={isHomePage ? 24 : 23}
                      md={isHomePage ? 24 : 23}
                      sm={isHomePage ? 24 : 23}
                      xs={isHomePage ? 24 : 23}
                    >
                      <Row>
                        {subMenuContent?.map((elm, index) => {
                          return (
                            <Col xl={4} lg={4} md={8} sm={12} xs={12} key={index} className="left-col">
                              <p className="title clickable" onClick={() => handleSubMenuItemsClick(elm?.breadcrumbs!)}>
                                <strong>
                                  {elm?.title?.length! > titleMaxLength
                                    ? elm?.title?.substring(0, titleMaxLength) + ' ...'
                                    : elm?.title}
                                </strong>

                                <span className="menu-arrow-icon-wrapper">
                                  {i18n.language === 'en' ? <RightOutlined /> : <LeftOutlined />}
                                </span>
                              </p>
                              {elm?.sub_departments?.slice(0, 3).map((item, index) => {
                                return (
                                  <p
                                    className="item clickable"
                                    key={index}
                                    onClick={() => handleSubMenuItemsClick(item?.breadcrumbs!)}
                                  >
                                    {item?.title}
                                  </p>
                                );
                              })}

                              {menuItems.length < itemsMaxNumber &&
                              elm?.sub_departments &&
                              elm?.sub_departments?.length > 3 ? (
                                <p
                                  className="item clickable"
                                  onClick={() => handleSubMenuItemsClick(elm?.breadcrumbs!)}
                                >
                                  {t(MORE)}
                                </p>
                              ) : null}
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        }
        trigger={['hover', 'click']}
        className={`menu-dropdown ${isHomePage ? 'homepage-popover' : 'default-popover'}`}
        onVisibleChange={onVisibleChange}
      >
        <Link to={PRODUCTS_MAIN_ROUTE} className="menu-item-label">
          <Separator horizontal={8} responsive />
          <img src={item.icon} className="menu-item-icon" />
          <Separator horizontal={3} />
          <span className="menu-item-text"> {t(item.label)}</span>
          <Separator horizontal={10} responsive />
        </Link>
      </DropdownPopover>
    </div>
  );
};
