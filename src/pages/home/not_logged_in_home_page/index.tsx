import React, { useEffect, useState } from 'react';
import { Magazine, ProductCategory, StockRecord } from '../../../API';
import i18n from '../../../app/i18n';
import { useMainContext } from '../../../app/providers/main';
import { getHomePageSlider } from '../api';
import { CardsSection, HomeSliderData } from '../components/cards_section';
import { HomeRoomType } from '../types';
import { Idea, TV, Project } from '../../../components/idea/types';
import { LOADING_HOME_SLIDER } from '../../../app/providers/main/loading_constants';
import HomePageSkeleton from '../../../components/skeletons/home_page_skeleton.tsx';

interface HomePageSlider {
  [key: string]: string;
}

type SectionDataProps = HomeRoomType[] | Magazine[] | TV[] | Idea[] | Project[] | StockRecord[] | ProductCategory[];

export const NotLoggedInHomePage = () => {
  const [homePageSlider, setHomePageSlider] = useState<HomePageSlider>();
  const { requestApi, loadingMap } = useMainContext();
  let sectionIndex: number = 0;

  const getHomeSlider = () => {
    requestApi(
      getHomePageSlider,
      {},
      (response: HomePageSlider, error: string) => {
        if (error) {
          return;
        }
        setHomePageSlider(response);
      },
      LOADING_HOME_SLIDER
    );
  };

  const getSectionIndex = (data: HomeSliderData) => {
    if (data == null) {
      return sectionIndex;
    }
    sectionIndex = sectionIndex + 1;
    return sectionIndex;
  };

  const checkIfSectionHasData = (sectionData: SectionDataProps) => {
    return sectionData && sectionData.length !== 0;
  };

  useEffect(() => {
    getHomeSlider();
  }, [i18n.language]);
  return (
    <div className="not-logged-in-home-page">
      {homePageSlider && !loadingMap[LOADING_HOME_SLIDER] ? (
        Object?.keys(homePageSlider!)?.map((elm: string, index) => {
          const data = JSON.parse(homePageSlider[elm]);
          const renderedComponent = <CardsSection index={getSectionIndex(data)} key={index} data={data} />;
          return (
            <>
              {checkIfSectionHasData(data?.services) ? (
                renderedComponent
              ) : checkIfSectionHasData(data?.projects) ? (
                renderedComponent
              ) : checkIfSectionHasData(data?.roomtypes) ? (
                renderedComponent
              ) : checkIfSectionHasData(data?.magazines) ? (
                renderedComponent
              ) : checkIfSectionHasData(data?.tvs) ? (
                renderedComponent
              ) : checkIfSectionHasData(data?.stockrecords) ? (
                renderedComponent
              ) : checkIfSectionHasData(data?.product_categories) ? (
                renderedComponent
              ) : (
                <div />
              )}
            </>
          );
        })
      ) : (
        <HomePageSkeleton />
      )}
    </div>
  );
};
