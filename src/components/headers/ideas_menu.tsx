import React from 'react';
import { Col, Row } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { IDEAS_ROUTE } from '../../utils/routes';
import { MenuCategory } from '../../app/providers/types';
import { MenuWrapper } from './menu_wrapper';
import { getSearchPagePath } from './utils';
import { useTranslation } from 'react-i18next';
import { MORE } from '../../locales/strings';

interface Props {
  ideas: (MenuCategory | null)[];
  item: { label: string; icon: string };
}

export const IdeasMenu = ({ item, ideas }: Props) => {
  const history = useHistory();
  const { t } = useTranslation();
  const updatedStyle = { minHeight: 300 };

  return (
    <MenuWrapper icon={item.icon} label={item.label} labelLink={IDEAS_ROUTE} sectionId="ideas-popover">
      <Row style={updatedStyle} className="ideas-popover-container">
        {ideas?.map((elm, index) => {
          return (
            <Col xl={4} lg={4} md={8} sm={8} xs={8} key={index} className="left-col">
              <p className="title">{elm?.title}</p>
              {elm?.children?.slice(0, 3).map((item) => {
                const title = item?.title;
                return (
                  <p className="item clickable" key={item?.id}>
                    {item && <Link to={getSearchPagePath(item!)}>{title}</Link>}
                  </p>
                );
              })}
              {elm?.children && elm?.children?.length > 3 ? (
                <p className="item clickable" onClick={() => history.push('/ideas')}>
                  {t(MORE)}
                </p>
              ) : null}
            </Col>
          );
        })}
      </Row>
    </MenuWrapper>
  );
};
