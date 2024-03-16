import React from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { BRANDS, DISCUSSION, MAGAZINE, TV } from '../../../locales/strings';
import { Menu } from '../../../API';
import { getCategoryTitleBasedOnLanguage } from '../../../utils';
import Separator from '../../separator';
import { headerIcons } from '../../../assets/icons/header';
import { BRAND_PAGE, DISCUSSIONS, IDEAS, MAGAZINES, TVS, TV as TV_ROUTE } from '../../../app/settings';
import { MenuCategory } from '../../../app/providers/types';
import { MenuWrapper } from '../menu_wrapper';

interface Props {
  menuItems: Menu;
  item: { label: string; icon: string };
}

export const MoreMenu = ({ item, menuItems }: Props) => {
  const reverseObject = (obj: Menu) => {
    try {
      const entries = Object.entries(obj);
      const reversedEntries = entries.reverse();
      const reversedObj = Object.fromEntries(reversedEntries);
      return reversedObj;
    } catch (error) {
      return {};
    }
  };
  const reversedMenuItems = reverseObject(menuItems);
  const { t, i18n } = useTranslation();
  //@ts-ignore
  const menu: { [key: string]: MenuCategory[] } = menuItems;
  const history = useHistory();
  const updatedStyle = { height: 100 };

  const getListTitle = (key: string) => {
    switch (key) {
      case DISCUSSIONS:
        return t(DISCUSSION);
      case TVS:
        return t(TV);
      case MAGAZINES:
        return t(MAGAZINE);
      case BRAND_PAGE:
        return t(BRANDS);
    }
  };

  const onTitleClick = (key: string) => {
    history.push(`/${key.includes(TVS) ? TV_ROUTE : key}`);
  };

  return (
    <MenuWrapper icon={item.icon} label={item.label} labelLink={null} sectionId="more-entities-popover">
      <Row style={updatedStyle} className="ideas-popover-container">
        {menu &&
          Object.keys(reversedMenuItems)?.map((key: string, index) => {
            const keyValues = menu[key];
            return (
              <>
                {key !== IDEAS && (
                  <Col xl={3} lg={3} md={8} sm={8} xs={8} key={index}>
                    <div onClick={() => onTitleClick(key)} className="elm-wrapper">
                      {/**@ts-ignore // can't declare a type to the imported function */}
                      <img src={headerIcons[key]} width="12px" height="12px" />
                      <Separator horizontal={5} />
                      <Typography.Text className="title clickable">{getListTitle(key)}</Typography.Text>
                    </div>
                    {keyValues?.map((elm, index) => {
                      return (
                        <div key={index}>
                          <p className="title">
                            <strong>{elm?.title}</strong>
                          </p>
                          {elm?.children?.map((item, index) => {
                            return (
                              <p key={index} className="item clickable">
                                <Link to={`/${key}/${item?.id}`}>{getCategoryTitleBasedOnLanguage(item!)}</Link>
                              </p>
                            );
                          })}
                        </div>
                      );
                    })}
                  </Col>
                )}
              </>
            );
          })}
      </Row>
    </MenuWrapper>
  );
};
