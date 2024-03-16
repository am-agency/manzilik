/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import { ManzilikAiContext, ManzilikAiProps } from '../../manzilik_ai_context';
import FormFilterCards from '../../components/form_filter_cards';
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
  THE_STYLE,
  TWO_POINTS,
  TWO_POINTS_NOR_PAID,
  YOUR_CREDIT_NOT_ENOUGH,
} from '../../../../locales/strings';
import { useFeature } from 'flagged';
import { AI_DESC_OPTION, MANZILIK_AI_FORM_EXTRA_OPTIONS, MANZILIK_AI_IMAGE_STRENGTH } from '../../../../app/settings';
import { aiIcons } from '../../../../assets/icons/ai';
import { AIOptionInput } from '../../../../API';
import AccuracySlider from '../../components/accuracy_slider';
import DesignDescription from '../../components/design_description';
import FilterCheckBox from '../../components/filter_checkbox';
import { useClient } from '../../../../app/hooks/use_client';
import CustomAlert from '../../../../components/custom_alert';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
interface MainFormProps {
  arrayOfOptions: AIOptionInput[];
  setArrayOfOptions: React.Dispatch<React.SetStateAction<AIOptionInput[]>>;
  showPointsAlert: boolean;
  setShowPointsAlert: React.Dispatch<React.SetStateAction<boolean>>;
  isUserChangedOptions: boolean;
  setIsUserChangedOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainForm: React.FC<MainFormProps> = (props) => {
  const {
    arrayOfOptions,
    setArrayOfOptions,
    showPointsAlert,
    setShowPointsAlert,
    isUserChangedOptions,
    setIsUserChangedOptions,
  } = props;
  const { t } = useTranslation();
  const isExtraOptionsFlagOn = useFeature(MANZILIK_AI_FORM_EXTRA_OPTIONS);
  const isImageStrengthOptionExist = useFeature(MANZILIK_AI_IMAGE_STRENGTH);
  const isDescriptionOptionExist = useFeature(AI_DESC_OPTION);
  const imageAccuracyOptionNameSlug = 'image_strength';
  const textPromptOptionNameSlug = 'text_prompt';
  const history = useHistory();
  const { initClient, client: clientData } = useClient();

  const {
    listStyles,
    setFormData,
    formData,
    loginRedirection,
    listRoomTypes,
    aiOptions,
    selectedDesignObject,
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
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="form-section">
      <div className="form-styles">
        <FormFilterCards
          listOfFilters={listStyles!}
          title={t(THE_STYLE)}
          defaultFilter={selectedDesignObject?.style?.name}
          onFilterSelect={(selected) => {
            setIsUserChangedOptions(true);
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
          defaultFilter={selectedDesignObject?.roomType?.name}
          onFilterSelect={(selected) => {
            setIsUserChangedOptions(true);
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
                        setIsUserChangedOptions(true);
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
                  setIsUserChangedOptions(true);
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
                setIsUserChangedOptions(true);
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
    </div>
  );
};

export default MainForm;
