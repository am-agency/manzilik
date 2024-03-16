import React, { useMemo } from 'react';
import { Col, Row, Typography } from 'antd';
import Separator from '../../../../components/separator';
import { Slider } from '../../../../components/slider';
import { CategoryCard, HomeIdeaCard, HomeMagazineCard, HomeTVCard, ServiceCard } from '../home_card';
import { Container } from '../../../../components/container';
import {
  IdeasSlider,
  MagazineSlider,
  ProductCategorySlider,
  ProjectsSlider,
  RoomTypeSlider,
  ServicesSlider,
  StockRecordsSlider,
  TvSlider,
} from '../../types';
import { SHOW_ALL } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import {
  IDEAS_ROUTE,
  MAGAZINES_ROUTE,
  PRODUCTS_MAIN_ROUTE,
  PROFESSIONALS_ROUTE,
  TV_ROUTE,
} from '../../../../utils/routes';
import { SubDepartmentCard } from '../../../shopping/departments_page/components/sub_department_card';
import ProductCard from '../../../shopping/components/product_card';
import { Link } from 'react-router-dom';

export type HomeSliderData = MagazineSlider &
  TvSlider &
  IdeasSlider &
  RoomTypeSlider &
  ProjectsSlider &
  ServicesSlider &
  StockRecordsSlider &
  ProductCategorySlider;

interface Props {
  index: number;
  data: HomeSliderData;
}
const sectionUrlMapping: Record<string, string> = {
  idea: IDEAS_ROUTE,
  tv: TV_ROUTE,
  service: PROFESSIONALS_ROUTE,
  magazine: MAGAZINES_ROUTE,
  room_type: IDEAS_ROUTE,
  project: IDEAS_ROUTE,
  product_category: PRODUCTS_MAIN_ROUTE,
  stockrecord: PRODUCTS_MAIN_ROUTE,
};

export const CardsSection = ({ index, data }: Props) => {
  const isSectionEven = index % 2 == 0;

  const { t } = useTranslation();

  const showAllUrl = useMemo(() => {
    return (sectionUrlMapping[data.show_all_url.replace('/', '')] || '') as string;
  }, [data.show_all_url]);

  return (
    <>
      {data && (
        <div
          className={`section-content ${data.services ? 'services-section' : ''}
           ${!isSectionEven ? 'section-wrapper' : ''}`}
        >
          <Separator vertical={25} />
          <Container>
            <>
              <Row justify="space-between" align="middle" className="section-header-wrapper">
                <Col>
                  <Typography.Text className="title">{data?.title}</Typography.Text>
                </Col>
                <Col className="clickable">
                  {data?.show_all_url && (
                    <Typography.Text className="show-all-url">
                      <Link to={showAllUrl}>{t(SHOW_ALL)}</Link>
                    </Typography.Text>
                  )}
                </Col>
              </Row>
              {data?.services ? (
                <div className="services-slider">
                  <Slider
                    slidesToScroll={{ xl: 5, lg: 3, md: 2, sm: 1 }}
                    slidesToShow={{ xl: 5, lg: 3, md: 2, sm: 1 }}
                    listLength={data?.services.length}
                  >
                    {data?.services?.map((elm, i) => {
                      return <ServiceCard key={i} service={elm} />;
                    })}
                  </Slider>
                </div>
              ) : data?.projects ? (
                <Slider
                  slidesToScroll={{ xl: 3, lg: 2, md: 2, sm: 1 }}
                  slidesToShow={{ xl: 3, lg: 2, md: 2, sm: 1 }}
                  listLength={data?.projects.length}
                >
                  {data?.projects?.map((elm, i) => {
                    return <HomeIdeaCard key={i} project={elm} idea={elm?.ideas! && elm?.ideas[0]!} />;
                  })}
                </Slider>
              ) : data?.roomtypes ? (
                <Slider
                  slidesToScroll={{ xl: 4, lg: 3, md: 2, sm: 1 }}
                  slidesToShow={{ xl: 4, lg: 3, md: 2, sm: 1 }}
                  listLength={data?.roomtypes.length}
                >
                  {data?.roomtypes?.map((elm, i) => {
                    return <CategoryCard key={i} roomType={elm} />;
                  })}
                </Slider>
              ) : data?.tvs ? (
                <Slider
                  slidesToScroll={{ xl: 3, lg: 2, md: 2, sm: 1 }}
                  slidesToShow={{ xl: 3, lg: 2, md: 2, sm: 1 }}
                  listLength={data.tvs.length}
                >
                  {data?.tvs?.map((elm, i) => {
                    return <HomeTVCard tv={elm} key={i} />;
                  })}
                </Slider>
              ) : data?.magazines ? (
                <Slider
                  slidesToScroll={{ xl: 3, lg: 2, md: 2, sm: 1 }}
                  slidesToShow={{ xl: 3, lg: 2, md: 2, sm: 1 }}
                  listLength={data.magazines?.length}
                >
                  {data?.magazines?.map((elm, i) => {
                    return <HomeMagazineCard magazine={elm} i={i} key={i} />;
                  })}
                </Slider>
              ) : data?.stockrecords ? (
                <Slider
                  slidesToScroll={{ xl: 3, lg: 2, md: 2, sm: 1 }}
                  slidesToShow={{ xl: 4, lg: 2, md: 2, sm: 1 }}
                  listLength={data.stockrecords?.length}
                >
                  {data?.stockrecords?.map((elm, i) => {
                    return (
                      <section key={i} className="padded-slide">
                        <ProductCard stockRecord={elm} />
                      </section>
                    );
                  })}
                </Slider>
              ) : data?.product_categories ? (
                <Slider
                  slidesToScroll={{ xl: 3, lg: 2, md: 2, sm: 1 }}
                  slidesToShow={{ xl: 4, lg: 2, md: 2, sm: 1 }}
                  listLength={data.product_categories?.length}
                >
                  {data?.product_categories?.map((elm, i) => {
                    return <SubDepartmentCard key={i} sub_department={elm} />;
                  })}
                </Slider>
              ) : (
                <div />
              )}
            </>
          </Container>
        </div>
      )}
    </>
  );
};
