/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';

import AIImage from '../../assets/images/AI-res.svg';
import UserPoints from './components/user_points';
import DesignsList from './components/designs_list';
import FilterToggle from './components/filter_toggle';
import HowAiWorks from './components/how_ai_works';
import AIResults from './results';
import AIForm from './ai_form';

import { useTranslation } from 'react-i18next';
import { NEWLY_PUBLISHED, MY_DESIGNS, ORIGINAL, ATTACHED_PHOTOS, GUIDES } from '../../locales/strings';
import { useMediaQuery } from 'react-responsive';
import {
  DrawerType,
  ManzilikAILayouts,
  ManzilikAiContext,
  ManzilikAiProps,
  ManzilikMobileViews,
} from './manzilik_ai_context';
import { getLayoutDirection } from '../../app/layouts';
import MyDesigns from './components/my_designs';
import { useMainContext } from '../../app/providers/main';
import { getAIOptions, getAIRoomTypes, getAIStyles } from './api';
import { AIOptions, listAiRoomTypesResponse, listAiStylesResponse } from './types';
import AIAdvancedForm from './ai_advanced_form';
import { profileIcons } from '../../assets/icons/profile';
import ManzilikDrawer from '../../components/manzilik_drawer';
import icons from '../../assets/icons';
import GuidePoints from './components/guide_points';
import PackageDetails from './ai_checkout/components/package_details';
import ReactSimpleImageViewer from 'react-simple-image-viewer';

export enum CurrentToggle {
  PUBLISHED = 'published',
  MY_DESIGNS = 'my_designs',
}

const ManzilikAi = () => {
  const { t, i18n } = useTranslation();
  const isTabletView = useMediaQuery({ query: '(max-width: 768px)' });

  const isArabic = getLayoutDirection(i18n.language) === 'rtl';
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isTabletView && currentLayoutView === ManzilikAILayouts.RESULTS) {
      setCurrentMobileView!(ManzilikMobileViews.FORM);
    }
  }, [isTabletView]);

  const closeImageViewer = () => {
    setIsFullscreen(false);
  };

  const {
    currentMobileView,
    setCurrentMobileView,
    setListStyles,
    setListRoomTypes,
    loginRedirection,
    setAIOptions,
    currentLayoutView,
    formUploadRef,
    drawerType,
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    selectedDesignObject,
    setDrawerType,
  } = useContext(ManzilikAiContext) as ManzilikAiProps;

  const handleOpenDrawer = () => {
    setIsAiDrawerOpen!(!isAiDrawerOpen);
    setDrawerType!(DrawerType.GUIDE);
  };
  const [currentToggle, setCurrentToggle] = useState<string>(CurrentToggle.PUBLISHED);

  const { requestApi, userState } = useMainContext();

  const isLoggedIn = userState?.isAuthenticated;

  const getAiAdvancedOptions = () => {
    requestApi(
      getAIOptions,
      null,
      (
        response: {
          data: {
            getAIOptions: AIOptions[];
          };
        },
        error: string
      ) => {
        if (error) {
          return;
        }
        const { getAIOptions: options } = response.data;
        setAIOptions!(options!);
      }
    );
  };
  const getAiStylesFilters = () => {
    requestApi(
      getAIStyles,
      {
        offset: 0,
        limit: 1000,
      },
      (response: listAiStylesResponse, error: string) => {
        if (error) {
          return;
        }
        const { results } = response.data.listAIStyles;
        setListStyles!(results);
      }
    );
  };
  const getAiRoomTypesFilters = () => {
    requestApi(
      getAIRoomTypes,
      {
        offset: 0,
        limit: 100,
      },
      (response: listAiRoomTypesResponse, error: string) => {
        if (error) {
          return;
        }
        const { results } = response.data.listAIRoomTypes;
        setListRoomTypes!(results);
      }
    );
  };
  const handleOpenUploadDialog = () => {
    if (formUploadRef?.current) {
      formUploadRef?.current.upload.uploader.onClick();
    } else {
      setCurrentMobileView!(ManzilikMobileViews.FORM);
    }
  };

  useEffect(() => {
    getAiStylesFilters();
    getAiRoomTypesFilters();
    getAiAdvancedOptions();
  }, [i18n.language]);

  const onFilterToggle = (id: string) => {
    setCurrentToggle(id);
    loginRedirection!();
  };

  const toggleFormView = () => {
    if (currentMobileView === ManzilikMobileViews.LIST) {
      setCurrentMobileView!(ManzilikMobileViews.FORM);
    } else {
      setCurrentMobileView!(ManzilikMobileViews.LIST);
    }
  };

  return (
    <div
      className="manzilik-ai-wrapper"
      style={{
        direction: getLayoutDirection(i18n.language),
      }}
    >
      <div className="list_form_view">
        {isTabletView && currentMobileView === ManzilikMobileViews.LIST ? (
          <div className="fixed-actions">
            <div>
              <HowAiWorks />
            </div>
            <img className="toggle-icon" src={AIImage} onClick={toggleFormView} />
          </div>
        ) : null}

        {isTabletView && currentMobileView === ManzilikMobileViews.LIST ? null : currentLayoutView ===
          ManzilikAILayouts.DEFAULT ? (
          <div className="first-div">
            <AIForm />
          </div>
        ) : currentLayoutView === ManzilikAILayouts.RESULTS &&
          currentMobileView === ManzilikMobileViews.FORM &&
          isTabletView ? (
          <div className="mobile-results-container">
            <UserPoints />
            <div className="header">
              {isFullscreen && (
                <ReactSimpleImageViewer
                  src={[selectedDesignObject?.sourceImageUrl!]}
                  disableScroll={false}
                  closeOnClickOutside={true}
                  onClose={closeImageViewer}
                  rightArrowComponent={<div className="right-arrow"></div>}
                  leftArrowComponent={<div className="left-arrow"></div>}
                />
              )}
              <div className="image-section">
                <p className="title">{t(ATTACHED_PHOTOS)}</p>
                <div className="original">
                  <img
                    src={selectedDesignObject?.sourceImageUrl}
                    alt=""
                    className="original-image"
                    onClick={() => setIsFullscreen(true)}
                  />
                  <p className="description">{t(ORIGINAL)}</p>
                </div>
              </div>
            </div>
            <AIResults />
          </div>
        ) : (
          <div className="first-div no-padding">
            <AIAdvancedForm />
          </div>
        )}

        {isTabletView && currentMobileView === ManzilikMobileViews.FORM ? null : currentLayoutView ===
          ManzilikAILayouts.DEFAULT ? (
          <div className="second-div">
            <div className="header">
              <FilterToggle
                currentToggle={currentToggle}
                onFilterToggle={onFilterToggle}
                listOfFilters={[
                  {
                    id: 1,
                    name: t(NEWLY_PUBLISHED),
                    value: CurrentToggle.PUBLISHED,
                  },
                  {
                    id: 2,
                    name: t(MY_DESIGNS),
                    value: CurrentToggle.MY_DESIGNS,
                  },
                ]}
              />
              {isLoggedIn && <UserPoints isPackagesPage />}
            </div>

            {currentToggle === CurrentToggle.PUBLISHED ? (
              <DesignsList handleOpenUploadDialog={handleOpenUploadDialog} />
            ) : (
              <MyDesigns handleOpenUploadDialog={handleOpenUploadDialog} />
            )}
          </div>
        ) : currentLayoutView === ManzilikAILayouts.RESULTS && isTabletView ? (
          <div className="second-div">
            <AIAdvancedForm />
          </div>
        ) : (
          <div className="second-div">
            <AIResults />
            <div className="guide">
              <button onClick={handleOpenDrawer}>
                <img src={profileIcons.lamp} alt="arrow" />
                {t(GUIDES)}
              </button>
            </div>
          </div>
        )}
      </div>
      <ManzilikDrawer
        size={394}
        open={isAiDrawerOpen!}
        setDrawerOpen={setIsAiDrawerOpen!}
        direction={isArabic && drawerType === DrawerType.PACKAGES ? 'right' : 'left'}
        className="ai-drawer-wrapper"
      >
        <div className="drawer-header">
          <img src={icons.close_icon} onClick={() => setIsAiDrawerOpen!(false)} />
        </div>
        <div className="drawer-content">
          {drawerType === DrawerType.PACKAGES ? <PackageDetails /> : <GuidePoints />}
        </div>
      </ManzilikDrawer>
    </div>
  );
};

export default ManzilikAi;
