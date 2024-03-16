/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useMainContext } from '../../../app/providers/main';
import UserPoints from '../components/user_points';
import FormUploader from '../components/form_uploader';

import { useTranslation } from 'react-i18next';
import { Button, Input, Tabs, Tooltip } from 'antd';
import {
  ManzilikAILayouts,
  ManzilikAiContext,
  ManzilikAiProps,
  ManzilikMobileViews,
  ManzilikViews,
} from '../manzilik_ai_context';
import MainForm from './main_form';
import Dropdown from '../components/ai_dropdown';
import AdvForm from './adv_form';
import {
  ADV_GENERATE_TOOLTIP,
  ATTACHED_PHOTOS,
  ORIGINAL,
  RE_GENERATE,
  SMART_GENERATION,
  SMART_TEXT_AREA,
  START_NOW,
} from '../../../locales/strings';
import { AIDesignObject, AIOptionInput } from '../../../API';
import { useClient } from '../../../app/hooks/use_client';
import { generateAIDesign } from '../api';
import ImageViewer from 'react-simple-image-viewer';

const AIAdvancedForm = () => {
  const { t } = useTranslation();
  const { userState, requestApi } = useMainContext();
  const isLoggedIn = userState?.isAuthenticated;
  const [activeStep, setActiveStep] = useState(1);
  const { TabPane } = Tabs;
  const {
    formUploadRef,
    formData,
    totalSelectedPoints,
    setSelectedDesignObject,
    setCurrentView,
    setCurrentLayoutView,
    setCurrentMobileView,
    selectedDesignObject,
  } = useContext(ManzilikAiContext) as ManzilikAiProps;
  const [arrayOfOptions, setArrayOfOptions] = useState<AIOptionInput[]>([]);
  const [showPointsAlert, setShowPointsAlert] = useState<boolean>(false);
  const { initClient, client: clientData } = useClient();
  const [isUserChangedOptions, setIsUserChangedOptions] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const closeImageViewer = () => setIsFullscreen(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const clientPoints = useMemo(() => {
    if (clientData) {
      return clientData?.balance;
    }
  }, [clientData]);

  const onHandleTabClick = (key: string) => {
    setActiveStep(Number(key));
  };

  const handleSubmit = () => {
    const formDataWithAdvancedOptions = {
      ...formData,
      advancedOptions: arrayOfOptions,
    };

    if (clientPoints! >= totalSelectedPoints!) {
      requestApi(
        generateAIDesign,
        formDataWithAdvancedOptions,
        (
          response: {
            data: {
              generateAIDesign: AIDesignObject;
            };
          },
          error: string
        ) => {
          if (error) {
            return;
          }
          const { generateAIDesign } = response.data;
          setSelectedDesignObject!(generateAIDesign as any);
          setCurrentView!(ManzilikViews.LOADING_VIEW);
          initClient();
          setCurrentLayoutView!(ManzilikAILayouts.RESULTS);
          setCurrentMobileView!(ManzilikMobileViews.FORM);
          // history.push(`/ai-results/${generateAIDesign.id}`);
        }
      );
    } else {
      setShowPointsAlert(true);
    }
  };

  return (
    <div className="advanced-form">
      {isFullscreen && (
        <ImageViewer
          src={[selectedDesignObject?.sourceImageUrl!]}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
          rightArrowComponent={<div className="right-arrow"></div>}
          leftArrowComponent={<div className="left-arrow"></div>}
        />
      )}
      <div className="header">{isLoggedIn && <UserPoints />}</div>
      <div className="horizontal-line"></div>
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
        <div className="form-upload-input">
          <FormUploader formUploadRef={formUploadRef!} />
        </div>
      </div>
      <div className="horizontal-line"></div>
      <Tabs
        defaultActiveKey="1"
        activeKey={activeStep.toString()}
        centered
        className="ai-tabs"
        onChange={onHandleTabClick}
      >
        <TabPane
          tab={
            <>
              <span className="step-name"> {t(SMART_GENERATION)}</span>
            </>
          }
          key="1"
          active={activeStep === 1}
        >
          <MainForm
            arrayOfOptions={arrayOfOptions}
            setArrayOfOptions={setArrayOfOptions}
            setShowPointsAlert={setShowPointsAlert}
            showPointsAlert={showPointsAlert}
            isUserChangedOptions={isUserChangedOptions}
            setIsUserChangedOptions={setIsUserChangedOptions}
          />
        </TabPane>
        <TabPane
          tab={
            <>
              <Tooltip title={t(ADV_GENERATE_TOOLTIP)}>
                <span className="step-name"> {t(SMART_TEXT_AREA)}</span>
              </Tooltip>
            </>
          }
          key="2"
          active={activeStep === 2}
        >
          <AdvForm isUserChangedOptions={isUserChangedOptions} setIsUserChangedOptions={setIsUserChangedOptions} />
        </TabPane>
      </Tabs>

      <div className="form-submit" onClick={handleSubmit}>
        <Button className="submit-button" type="primary" disabled={!isUserChangedOptions}>
          {t(RE_GENERATE)}
        </Button>
      </div>
    </div>
  );
};

export default AIAdvancedForm;
