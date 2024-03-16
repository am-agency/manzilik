import React, { useEffect, useState } from 'react';
import { Col, Row, Tabs, Typography, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import Separator from '../../../../../components/separator';

import { STORIES_FROM_MANZILIK, MANZILIK_TV, CATEGORIES, MANZILIK_DISCUSSIONS } from '../../../../../locales/strings';
import { GENERIC_DISCUSSIONS_ROUTE, TV_ROUTE } from '../../../../../utils/routes';
import { staticMagazineTabs } from '../../../constants';
import { Category } from '../../../types';
import { CustomCarousal } from '../../../../../components/carousal';
import { magazineIcons } from '../../../../../assets/icons/magazine';
import { Link } from 'react-router-dom';
const { CheckableTag } = Tag;

const { TabPane } = Tabs;
interface Props {
  id: string;
  tab: Category;
  selectTab: Function;
  categories: Category[];
  setCategoryId: Function;
}

export const MagazineHeader = (props: Props) => {
  const { selectTab, categories, setCategoryId, id, tab } = props;
  const { popular } = staticMagazineTabs;
  const { t, i18n } = useTranslation();
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const onTabChange = (key: string) => {
    selectTab(key);
  };

  const onCategoryChange = (id: string) => {
    if (id !== selectedTagId) {
      setSelectedTagId(id);
      setCategoryId(id);
    } else {
      setSelectedTagId('');
      setCategoryId('');
    }
  };

  useEffect(() => {
    setSelectedTagId('');
  }, [id]);

  return (
    <div className="magazine-page-header">
      <Row align="middle" justify="space-between">
        <Col xxl={18} xl={18} lg={18} md={24} sm={24} xs={24}>
          <Row align="middle" className="magazine-tabs">
            <div className="main-title">{t(STORIES_FROM_MANZILIK)}</div>
            <Separator horizontal={16} />
            <Tabs defaultActiveKey={tab.id || popular.id} className="tabs" onChange={onTabChange}>
              {Object.values(staticMagazineTabs).map((value) => {
                return <TabPane tab={t(value.title)} key={value.id} />;
              })}
            </Tabs>
          </Row>
        </Col>
        <Col>
          <Row>
            <Link to={TV_ROUTE}>
              <div className="tv-and-discussion">
                <img src={magazineIcons.tv} />
                {t(MANZILIK_TV)}
              </div>
            </Link>
            <Separator horizontal={16} />
            <Link to={GENERIC_DISCUSSIONS_ROUTE}>
              <div className="tv-and-discussion">
                <img src={magazineIcons.discussion} />
                {t(MANZILIK_DISCUSSIONS)}
              </div>
            </Link>
          </Row>
        </Col>
      </Row>
      <Separator vertical={12} />
      {categories.length > 0 && (
        <>
          <Row align="middle" wrap={false} className="mag-categories no-scroll">
            <Typography.Text className="categories-title">{t(CATEGORIES)}:</Typography.Text>
            <Separator horizontal={20} />
            <span className="custom-carousal-wrapper" id="magazine-categories">
              <CustomCarousal id="magazine-categories" action={categories} hideArrows={false}>
                {categories.map((category) => {
                  return (
                    <>
                      <CheckableTag
                        checked={category.id == selectedTagId}
                        key={category.id}
                        className="category-tag clickable"
                        onClick={() => onCategoryChange(category.id!)}
                      >
                        {t(category.title!)}
                      </CheckableTag>
                      <Separator horizontal={8} />
                    </>
                  );
                })}
              </CustomCarousal>
            </span>
          </Row>
          <Separator vertical={12} />
        </>
      )}
    </div>
  );
};
