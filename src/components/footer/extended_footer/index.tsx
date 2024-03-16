import { Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Category, RoomType, Service } from '../../../API';
import { getIdeasMenu, getShoppingMenu } from '../../../app/providers/api';
import { useMainContext } from '../../../app/providers/main';
import { DepartmentsMenu, Menu } from '../../../app/providers/types';
import {
  PROFESSIONAL_SERVICES,
  READ_MORE,
  ROOM_TYPES,
  SERVICES,
  STORIES_FROM_MANZILIK,
  THE_DISCUSSIONS,
  THE_MAGAZINE,
  THE_TV,
} from '../../../locales/strings';
import { populateRoute } from '../../../utils';
import { DISCUSSIONS_ROUTE, IDEAS_ROUTE, MAGAZINES_ROUTE, PROFESSIONALS_ROUTE, TV_ROUTE } from '../../../utils/routes';
import { GigsServicesContext, GigsServicesInterface } from '../../../context/services_context';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';
import { useFeature } from 'flagged';
import { ECOMMERCE_FEATURE } from '../../../app/settings';

interface FooterMenuItem {
  title: string;
  url: string;
  id: number;
}
interface FooterMenu {
  menu: FooterMenuItem[];
  title: string;
  url: string;
  order: number;
}

type footerMenuKey = 'ideas' | 'tvs' | 'magazines' | 'discussions' | 'SERVICES' | 'ROOM_TYPES';

const FooterMenu = ({ footerMenu: { menu, title, url } }: { footerMenu: FooterMenu }) => {
  const { t } = useTranslation();

  return (
    <div className="extended-footer-menu-wrapper">
      <h1 className="extended-footer-menu-title">
        <a href={url}>{title}</a>
      </h1>
      <Row gutter={46}>
        <Col>
          <ul className="extended-footer-menu">
            {menu.slice(0, 4).map((menuItem) => (
              <li key={menuItem.id} className="extended-footer-menu-item">
                <a href={menuItem.url}>{menuItem.title}</a>
              </li>
            ))}
          </ul>
        </Col>
        <Col>
          <ul className="extended-footer-menu">
            {menu.slice(4, 7).map((menuItem) => (
              <li key={menuItem.id} className="extended-footer-menu-item">
                <a href={menuItem.url}>{menuItem.title}</a>
              </li>
            ))}
            {menu.length > 7 && (
              <li className="extended-footer-menu-read-more">
                <a href={url}>{t(READ_MORE)}</a>
              </li>
            )}
          </ul>
        </Col>
      </Row>
    </div>
  );
};

const getFooterMenuMetaByKey = (parentKey: footerMenuKey, childKey?: string) => {
  const footerMenuKeyMap = {
    ideas: {
      url: childKey ? `${IDEAS_ROUTE}?c=${childKey}` : IDEAS_ROUTE,
      title: STORIES_FROM_MANZILIK,
      order: 1,
    },
    tvs: {
      url: TV_ROUTE,
      title: THE_TV,
      order: 5,
    },
    magazines: {
      url: MAGAZINES_ROUTE,
      title: THE_MAGAZINE,
      order: 4,
    },
    discussions: {
      url: populateRoute(DISCUSSIONS_ROUTE, { id: '' }),
      title: THE_DISCUSSIONS,
      order: 6,
    },
    SERVICES: {
      title: PROFESSIONAL_SERVICES,
      url: childKey ? `${PROFESSIONALS_ROUTE}?services=${childKey}` : PROFESSIONALS_ROUTE,
      order: 3,
    },
    ROOM_TYPES: {
      title: ROOM_TYPES,
      url: childKey ? `${IDEAS_ROUTE}?c=${childKey}` : IDEAS_ROUTE,
      order: 2,
    },
  };
  return footerMenuKeyMap[parentKey] || { url: '/', title: parentKey };
};

export type SubDepartmentMenu =
  | { title: string | null | undefined; url: string; id: string | null | undefined }[]
  | undefined;

const EcommerceFooterMenu = ({
  menu,
  title,
  url,
}: {
  menu: SubDepartmentMenu;
  title: string | null | undefined;
  url: string;
}) => {
  return (
    <div className="extended-footer-menu-wrapper">
      <h1 className="extended-footer-menu-title">
        <a href={url}>{title}</a>
      </h1>
      <Row gutter={46}>
        <Col>
          <ul className="extended-footer-menu">
            {menu?.map((menuItem) => (
              <li key={menuItem.id} className="extended-footer-menu-item">
                <a href={menuItem.url}>{menuItem.title}</a>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </div>
  );
};

const ExtendedFooter = () => {
  const { t, i18n } = useTranslation();
  const { requestApi } = useMainContext();
  const [menuItems, setMenuItems] = useState<FooterMenu[]>([]);
  const [services, setServices] = useState<FooterMenu[]>([]);
  const [departments, setDepartments] = useState<DepartmentsMenu[]>([]);
  const [roomTypes, setRoomTypes] = useState<FooterMenu[]>([]);
  const { data, isLoading } = useContext(GigsServicesContext) as GigsServicesInterface;
  const isEcommerce = useFeature(ECOMMERCE_FEATURE);

  const {
    roomTypes: roomTypesList,
    isRoomTypesLoading,
    ideasMenu,
    shoppingMenu,
    isShoppingMenuLoading,
  } = useContext(SharedStateContext) as SharedStateInterface;
  useEffect(() => {
    const { title, url, order } = getFooterMenuMetaByKey(SERVICES);
    if (data?.length > 0) {
      setServices([
        {
          title: t(title),
          url,
          order,
          menu: data
            .map((service) => {
              if (!service.title) {
                return;
              }
              return {
                title: service.title,
                id: service.id,
                url: getFooterMenuMetaByKey(SERVICES, service.title).url,
              };
            })
            .filter((item) => item) as unknown as FooterMenuItem[],
        },
      ]);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (roomTypesList?.length > 0) {
      const { title, url, order } = getFooterMenuMetaByKey(ROOM_TYPES);
      setRoomTypes([
        {
          title: t(title),
          url,
          order,
          menu: roomTypesList
            .map((roomType) => {
              if (!roomType.title) {
                return;
              }
              return {
                title: i18n.language === 'en' ? roomType.english_title : roomType.title,
                id: roomType.id,
                url: getFooterMenuMetaByKey(ROOM_TYPES, roomType.title).url,
              };
            })
            .filter((item) => item) as unknown as FooterMenuItem[],
        },
      ]);
    }
  }, [roomTypesList, isRoomTypesLoading]);

  useEffect(() => {
    setMenuItems((pre) => [...pre]);
  }, [i18n.language]);

  useEffect(() => {
    if (!isShoppingMenuLoading) {
      setDepartments(shoppingMenu);
    }
  }, [i18n.language, shoppingMenu, isShoppingMenuLoading]);

  const getMenu = () => {
    setMenuItems([
      ...Object.entries(ideasMenu)
        .map(([key, footerMenuItems], index): FooterMenu => {
          const { title, url, order } = getFooterMenuMetaByKey(key as footerMenuKey);
          return {
            title: t(title),
            url,
            order,
            menu: footerMenuItems
              .flatMap((footerMenuItem: { children: Array<Category | null> | null }) => {
                if (footerMenuItem) {
                  return footerMenuItem.children || [];
                }
              })
              .map((menuItem: Category) => ({
                ...menuItem,
                url: getFooterMenuMetaByKey(key as footerMenuKey, menuItem.title!).url,
              })) as unknown as FooterMenuItem[],
          };
        })
        .filter((menuItem: FooterMenu) => menuItem.menu.length),
    ]);
  };

  useEffect(() => {
    getMenu();
  }, [i18n.language]);

  const getDepartmentMenu = (department: DepartmentsMenu) => {
    const subDepartmentsMenu: SubDepartmentMenu = [];
    department.children?.forEach((sub_department) => {
      const breadcrumb = sub_department?.breadcrumbs!;
      subDepartmentsMenu.push({
        title: sub_department?.title,
        // @ts-ignore
        url: `/products/${breadcrumb[0].slug!}/${breadcrumb[1]?.slug}?c=${breadcrumb[1]?.slug}`,
        id: sub_department?.id,
      });
    });

    return subDepartmentsMenu;
  };

  return (
    <Row justify="center" className="extended-footer">
      <Col xs={20}>
        {[...services, ...roomTypes, ...menuItems]
          .sort((a, b) => {
            return a.order - b.order;
          })
          .map((footerMenu) => (
            <FooterMenu key={footerMenu.title} footerMenu={footerMenu} />
          ))}
      </Col>
      <Col xs={20}>
        {departments?.length > 0 &&
          isEcommerce &&
          departments?.map((department, index) => (
            <EcommerceFooterMenu
              key={department.slug}
              title={department.title}
              url={`/products/${department.slug}?c=${department.slug}`}
              menu={getDepartmentMenu(department)}
            />
          ))}
      </Col>
    </Row>
  );
};

export default ExtendedFooter;
