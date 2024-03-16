/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ADDITIONAL_OPTIONS,
  ADD_CREDITS,
  MORE_DETAILS,
  NOT_SELECTED,
  PRIVACY,
  PRIVACY_TOOLTIP,
  PRIVATE_TEXT,
  PUBLIC_TEXT,
  ROOM_TYPE,
  START_NOW,
  START_THE_EXPERIENCE_NOW,
  THE_STYLE,
  TWO_POINTS,
  TWO_POINTS_NOR_PAID,
  UPLOAD_PHOTO_TO_START,
  YOUR_CREDIT_NOT_ENOUGH,
} from '../../../locales/strings';
import CustomAlert from '../../../components/custom_alert';
import AiHeaderImage from '../../../assets/images/ai.png';
import FormUploader from '../components/form_uploader';
import FormFilterCards from '../components/form_filter_cards';
import HowAiWorks from '../components/how_ai_works';
import AccuracySlider from '../components/accuracy_slider';
import DesignDescription from '../components/design_description';
import FilterCheckBox from '../components/filter_checkbox';

import { ManzilikAILayouts, ManzilikAiContext, ManzilikAiProps, ManzilikViews } from '../manzilik_ai_context';
import { useFeature } from 'flagged';
import { AI_DESC_OPTION, MANZILIK_AI_FORM_EXTRA_OPTIONS, MANZILIK_AI_IMAGE_STRENGTH } from '../../../app/settings';
import { aiIcons } from '../../../assets/icons/ai';
import { AIDesignObject, AIOptionInput } from '../../../API';
import { useHistory } from 'react-router-dom';
import { useClient } from '../../../app/hooks/use_client';
import { useMainContext } from '../../../app/providers/main';
import * as analytics from '../../../analytics';
import { Button } from 'antd';
import { generateAIDesign } from '../api';

const AIForm = () => {
  const { t } = useTranslation();
  const {
    listStyles,
    setFormData,
    formData,
    loginRedirection,
    listRoomTypes,
    aiOptions,
    totalSelectedPoints,
    setTotalSelectedPoints,
    setSelectedDesignObject,
    setCurrentView,
    setCurrentLayoutView,
    formUploadRef,
  } = useContext(ManzilikAiContext) as ManzilikAiProps;
  const [allFormValidate, setAllFormValidate] = useState({
    style: false,
    roomType: false,
    image: false,
  } as {
    style: boolean;
    roomType: boolean;
    image: boolean;
  });
  const imageAccuracyOptionNameSlug = 'image_strength';
  const textPromptOptionNameSlug = 'text_prompt';
  const isExtraOptionsFlagOn = useFeature(MANZILIK_AI_FORM_EXTRA_OPTIONS);
  const isImageStrengthOptionExist = useFeature(MANZILIK_AI_IMAGE_STRENGTH);
  const isDescriptionOptionExist = useFeature(AI_DESC_OPTION);
  const [arrayOfOptions, setArrayOfOptions] = useState<AIOptionInput[]>([]);
  const [isActive, setIsActive] = useState(false);
  const history = useHistory();
  const [showPointsAlert, setShowPointsAlert] = useState<boolean>(false);
  const { initClient, client: clientData } = useClient();
  const { requestApi } = useMainContext();

  const isFormDataValid = useMemo(() => {
    return Object.values(allFormValidate).includes(false);
  }, [allFormValidate]);

  useEffect(() => {
    if (formData?.imageURL) {
      setAllFormValidate({
        ...allFormValidate,
        image: true,
      });
    }
  }, [formData?.imageURL]);

  const clientPoints = useMemo(() => {
    if (clientData) {
      return clientData?.balance;
    }
  }, [clientData]);

  useEffect(() => {
    if (formData?.visibility === 'PUBLIC' && formData?.processingType === 'slow') {
      setTotalSelectedPoints!(2);
    } else if (formData?.visibility === 'PUBLIC' && formData?.processingType === 'fast') {
      setTotalSelectedPoints!(3);
    } else if (formData?.visibility === 'PRIVATE' && formData?.processingType === 'slow') {
      setTotalSelectedPoints!(2);
    } else if (formData?.visibility === 'PRIVATE' && formData?.processingType === 'fast') {
      setTotalSelectedPoints!(3);
    }
  }, [formData?.visibility, formData?.processingType]);

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
          // history.push(`/ai-results/${generateAIDesign.id}`);
        }
      );
    } else {
      setShowPointsAlert(true);
    }
    analytics.PublishEvent(
      new analytics.AnalyticsStartGenerateAIEvent(
        formData?.styleSlug!,
        formData?.roomTypeSlug!,
        formData?.visibility!,
        totalSelectedPoints!,
        clientData?.is_purchased! ? 'Purchased' : 'Free'
      )
    );
  };

  return (
    <div className="start-now-form">
      <div className="form-header">
        <p className="form-h1">{t(START_THE_EXPERIENCE_NOW)}</p>
        <img src={AiHeaderImage} />
        <p className="form-h2">{t(UPLOAD_PHOTO_TO_START)}</p>
      </div>
      <div className="form-upload-input">
        <FormUploader formUploadRef={formUploadRef!} />
      </div>

      <div className="form-how-ai-work">
        <HowAiWorks />
      </div>
      <div className="form-styles">
        <FormFilterCards
          listOfFilters={listStyles!}
          title={t(THE_STYLE)}
          onFilterSelect={(selected) => {
            setFormData!({
              ...formData!,
              styleSlug: selected,
            });
            setAllFormValidate({
              ...allFormValidate,
              style: true,
            });
            loginRedirection!();
          }}
        />
      </div>

      <div className="form-styles">
        <FormFilterCards
          listOfFilters={listRoomTypes!}
          title={t(ROOM_TYPE)}
          onFilterSelect={(selected) => {
            setFormData!({
              ...formData!,
              roomTypeSlug: selected,
            });
            setAllFormValidate({
              ...allFormValidate,
              roomType: true,
            });
            loginRedirection!();
          }}
        />
      </div>
      {isExtraOptionsFlagOn && (
        <div
          className="additional-features"
          style={{
            border: isActive ? '1px solid rgba(70, 71, 116, 0.4)' : 'none',
          }}
          onClick={() => setIsActive(!isActive)}
        >
          <p>{t(ADDITIONAL_OPTIONS)}</p>
          <img src={aiIcons.ArrowDown} alt="arrow" className={isActive ? '' : 'active-arrow'} />
        </div>
      )}

      <>
        <div
          className="additional-options-wrapper"
          style={{
            display: isActive ? 'block' : 'none',
          }}
        >
          {aiOptions?.length
            ? aiOptions?.map((option) => {
                return (
                  <div className="form-styles" key={option?.slug}>
                    <FormFilterCards
                      listOfFilters={[
                        {
                          id: '1',
                          name: t(NOT_SELECTED),
                          slug: '',
                          image: aiIcons.empty,
                        },
                        ...option?.values!,
                      ]}
                      title={option?.name!}
                      withFlag
                      onFilterSelect={(selected) => {
                        const selectedOption: AIOptionInput | undefined = {
                          optionNameSlug: option?.slug!,
                          optionValueSlug: selected,
                        };
                        // select only one option from each option type
                        setArrayOfOptions([
                          ...arrayOfOptions.filter((option) => option.optionNameSlug !== selectedOption.optionNameSlug),
                          selectedOption,
                        ]);

                        setFormData!({
                          ...formData!,
                          advancedOptions: [selectedOption as any],
                        });
                        setAllFormValidate({
                          ...allFormValidate,
                          roomType: true,
                        });
                        loginRedirection!();
                      }}
                    />
                  </div>
                );
              })
            : null}

          {isImageStrengthOptionExist && (
            <div>
              <AccuracySlider
                onSliderChange={(value) => {
                  setArrayOfOptions([
                    ...arrayOfOptions.filter((option) => option.optionNameSlug !== imageAccuracyOptionNameSlug),
                    {
                      optionNameSlug: imageAccuracyOptionNameSlug,
                      optionValueSlug: (value / 100).toString(),
                    },
                  ]);
                }}
              />
            </div>
          )}
          {isDescriptionOptionExist && (
            <DesignDescription
              onDescriptionChange={(value) => {
                setArrayOfOptions([
                  ...arrayOfOptions.filter((option) => option.optionNameSlug !== textPromptOptionNameSlug),
                  {
                    optionNameSlug: textPromptOptionNameSlug,
                    optionValueSlug: value.toString(),
                  },
                ]);
              }}
            />
          )}
        </div>
      </>

      <div className="form-more-info">
        <div className="titles">
          <p className="bold-text">{t(MORE_DETAILS)}</p>
          {/* <p className="normal-text"> وصف بسيط من سطر مكون من سطر واحد </p> */}
        </div>

        <FilterCheckBox
          title={t(PRIVACY)}
          arrayOfOptions={[
            {
              label: t(PUBLIC_TEXT),
              hint: t(TWO_POINTS),
              value: 'PUBLIC',
            },
            {
              label: t(PRIVATE_TEXT),
              hint: t(TWO_POINTS_NOR_PAID),
              value: 'PRIVATE',
              isDisabled: !clientData?.is_purchased!,
            },
          ]}
          tooltip={t(PRIVACY_TOOLTIP)}
          onHandleCheckboxChange={(result) => {
            setFormData!({
              ...formData!,
              visibility: result,
            });
          }}
        />

        {/* <FilterCheckBox
      title={t(EXPORT_SPEED)}
      arrayOfOptions={[
        {
          label: t(SLOW),
          hint: t(FREE),
          value: 'slow',
        },
        {
          label: t(FAST),
          hint: t(ONE_POINT),
          value: 'fast',
        },
      ]}
      onHandleCheckboxChange={(result) => {
        setFormData!({
          ...formData!,
          processingType: result,
        });
      }}
    /> */}
      </div>
      {showPointsAlert && (
        <div className="form-alert">
          <CustomAlert
            text={t(YOUR_CREDIT_NOT_ENOUGH)}
            btnText={t(ADD_CREDITS)}
            btnAction={() => history.push('/ai-checkout')}
            isBlocked
          />
        </div>
      )}

      <div className="form-submit" onClick={handleSubmit}>
        <Button
          className={!isFormDataValid && formData?.styleSlug ? 'submit-btn' : 'submit-btn disabled'}
          type="primary"
          disabled={isFormDataValid || !formData?.imageURL! || !formData?.styleSlug!}
        >
          {t(START_NOW)}
        </Button>
      </div>
    </div>
  );
};

export default AIForm;
