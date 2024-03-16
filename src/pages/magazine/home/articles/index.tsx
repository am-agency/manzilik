import React, { useContext, useEffect } from 'react';
import { Col, List, Row } from 'antd';
import MainArticle from '../components/main_article';
import { Magazine as MagazineFromApi } from '../../../../API';
import Separator from '../../../../components/separator';
import { MagazineCard } from '../components/magazine_card';
import { CustomPagination } from '../../../../components/pagination_item';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../../../app/layouts';
import i18n from '../../../../app/i18n';
import { getPaginationOffset } from '../../../../utils';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';
import Loader from 'react-spinners/ClipLoader';
import BannerContainer from '../../../../components/banner_container';
import { BannerSlug } from '../../../../constants';
import BannerCard from '../../../../components/banner_card';

interface Props {
  magazines: MagazineFromApi[];
  currentPage: number;
  postPageChange: Function;
  total: number;
}

export const Articles = (props: Props) => {
  const { magazines, currentPage, postPageChange, total } = props;
  const { t } = useTranslation();
  const isEmptyArray = magazines.length <= 0;
  const dataSource = magazines.slice(2, magazines.length);
  const { banner, isBannerLoading, setBannerSlug } = useContext(SharedStateContext) as SharedStateInterface;

  useEffect(() => {
    setBannerSlug!(BannerSlug.MAGAZINE_BANNER);
  }, []);

  const onPageChange = (page: number, pageSize?: number) => {
    const pagnation = getPaginationOffset(page, pageSize);
    postPageChange(pagnation, page);
  };

  return (
    <>
      <Row justify="space-between" gutter={[20, 20]}>
        <Col xxl={16} xl={16} lg={16} md={24} sm={24} xs={24}>
          {!isEmptyArray && <MainArticle magazine={magazines[0]} />}
        </Col>
        <Col xxl={8} xl={8} lg={8} md={24} sm={24} xs={24}>
          {!isEmptyArray && magazines[1] && <MagazineCard magazine={magazines[1]} />}
        </Col>
      </Row>
      <Separator vertical={14} />
      <>
        {isBannerLoading ? (
          <div className="loader-banner">
            <Loader />
          </div>
        ) : (
          <BannerContainer>
            <BannerCard banner={banner} isDynamicContent />
          </BannerContainer>
        )}
      </>

      <List
        grid={{ gutter: 20, xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
        pagination={{
          showTitle: false,
          onChange: onPageChange,
          pageSize: 9,
          total,
          itemRender: (page, type) => CustomPagination(page, type, t),
          className: `pagination ${getLayoutDirection(i18n.language)}`,
          hideOnSinglePage: true,
          current: currentPage,
        }}
        dataSource={dataSource}
        itemLayout="vertical"
      >
        {dataSource.length === 0 ? (
          <div className="no-data">{t('There are no data')}</div>
        ) : (
          <div className="list-container-magazines">
            {dataSource.map((item, index) => {
              return (
                <>
                  <List.Item key={item.id} className="magazine-list-item">
                    <MagazineCard magazine={item} withCategory withDescription />
                  </List.Item>
                </>
              );
            })}
          </div>
        )}
      </List>
    </>
  );
};
