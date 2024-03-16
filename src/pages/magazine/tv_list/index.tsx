import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { TVCard } from './components/tv_card';
import { CaretRightOutlined } from '@ant-design/icons';
import { HOME_PAGE_SEO_DESCRIPTION, MANZILIK, NEW_VIDEO_ON_MANZILIK, TV, WATCH_NOW } from '../../../locales/strings';
import { TV as TTV } from '../../../components/idea/types';
import Separator from '../../../components/separator';
import { useMainContext } from '../../../app/providers/main';
import { listTVs } from '../api';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import icons from '../../../assets/icons';
import Pagination from '../home/components/pagination';
import { replaceSpaceWithDash } from '../../../utils';
import { MetaTags } from '../../../components/meta_tags';
import { TV_ROUTE } from '../../../utils/routes';

interface Props {
  tvList: TTV[];
  currentPage: number;
}

export const listMaxLengthForMagazine = 8;

const TVList: FunctionComponent<Props> = () => {
  const [tvList, setTVList] = useState<TTV[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { t } = useTranslation();

  const [totalPages, setTotalPages] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const page = parseInt(query.get('page')!) - 1 || 0;
  const [currentPage, setCurrentPage] = useState(page);

  const {
    requestApi,
    userState: { isAuthenticated },
  } = useMainContext();

  const getTVList = (refresh: boolean = false) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const current = page;
    const currentOffset = listMaxLengthForMagazine * current;
    let pagination = { offset: currentOffset, limit: listMaxLengthForMagazine, resourceId: id };

    if (refresh) {
      pagination = { offset: currentOffset, limit: listMaxLengthForMagazine, resourceId: id };
    }

    requestApi(
      listTVs,
      { input: pagination, isAuthenticated },
      (response: { tvList: TTV[]; count: number }, error: string) => {
        const { count } = response;
        setTotalPages(Math.ceil(count / listMaxLengthForMagazine));
        if (error) {
          return;
        }
        if (response.tvList?.length == 0) {
          setHasMore(false);
          setTVList(response.tvList);
          return;
        }
        setTVList(response.tvList);
      }
    );
  };

  useEffect(() => {
    getTVList(true);
  }, [id]);

  useEffect(() => {
    getTVList(false);
  }, [currentPage]);

  return (
    <Row className="tv-list-page" justify="center">
      <MetaTags title={`${t(MANZILIK)} | ${t(TV)}`} description={t(HOME_PAGE_SEO_DESCRIPTION)} />
      <Col span={24}>
        <Carousel
          className="carousal-container"
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          selectedItem={1}
          autoPlay={false}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(index, item: any) => {}}
          renderArrowPrev={(onClickHandler, hasPrev) => {
            const clickFunction = hasPrev ? onClickHandler : () => {};
            return (
              <Button className={`prev-btn carousal-btns`} onClick={clickFunction}>
                <img src={icons.leftArrow.icon} />
              </Button>
            );
          }}
          renderArrowNext={(onClickHandler, hasNext) => {
            const clickFunction = hasNext ? onClickHandler : () => {};
            return (
              <Button className="next-btn carousal-btns" onClick={clickFunction}>
                <img src={icons.rightArrow.icon} />
              </Button>
            );
          }}
        >
          {tvList?.slice(0, 3).map((item, index) => {
            return (
              <div key={index} className="heading-container">
                <img className="img-fit-content" src={item?.photo!} />
                <Row justify="center" align="middle" className="tv-details-overlay">
                  <div>
                    <Typography.Title level={2} className="heading">
                      {item?.title}
                    </Typography.Title>
                    <Row justify="center" align="middle">
                      <Button
                        type="primary"
                        className="icon-wrapper"
                        icon={<CaretRightOutlined />}
                        onClick={() => {
                          history.push(`${TV_ROUTE}/${replaceSpaceWithDash(item?.title!)}/${item?.id}`);
                        }}
                      >
                        {t(WATCH_NOW)}
                      </Button>
                    </Row>
                  </div>
                </Row>
              </div>
            );
          })}
        </Carousel>

        <Row justify="center">
          <Col span={22}>
            <Separator vertical={40} />
            <div className="section-title">{t(NEW_VIDEO_ON_MANZILIK)}</div>
            <Separator vertical={30} />
            <Row gutter={{ xs: 4, sm: 4, md: 4, lg: 32, xl: 32 }}>
              {tvList?.map((tvStory, i) => (
                <Col lg={8} md={8} sm={12} xs={12} key={i}>
                  <TVCard tv={tvStory} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          hasMore={hasMore}
          totalPages={totalPages}
        />
      </Col>
    </Row>
  );
};

export default TVList;
