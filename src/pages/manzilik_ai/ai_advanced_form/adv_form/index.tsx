/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import Dropdown from '../../components/ai_dropdown';
import { Input } from 'antd';
import { FormatterProps } from '../../../contact_us/components/contact_form';
import { ManzilikAiContext, ManzilikAiProps } from '../../manzilik_ai_context';
import { GenerateAIDesignInput } from '../../../../API';
import GuidePoints from '../../components/guide_points';
import { SELECT_ROOM_TYPE, SELECT_STYLE } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';

interface AdvFormProps {
  isUserChangedOptions: boolean;
  setIsUserChangedOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdvForm = (props: AdvFormProps) => {
  const { isUserChangedOptions, setIsUserChangedOptions } = props;
  const { t } = useTranslation();
  const { listStyles, listRoomTypes, setFormData, formData, currentTemplatePrompt } = useContext(
    ManzilikAiContext
  ) as ManzilikAiProps;
  const [userPrompt, setUserPrompt] = useState<string>('');
  const handleSelect = (option: string, propertyName: string) => {
    setIsUserChangedOptions(true);
    setFormData!({
      ...formData!,
      [propertyName]: option,
    });
  };

  useEffect(() => {
    if (currentTemplatePrompt!) {
      setUserPrompt(currentTemplatePrompt);
    }
  }, [currentTemplatePrompt]);

  useEffect(() => {
    setFormData!({
      ...formData!,
      text: userPrompt,
    });
  }, [userPrompt]);

  return (
    <>
      <div className="text-area-container">
        <div className="dropdowns">
          <Dropdown
            options={listStyles as any}
            onSelect={(option) => handleSelect(option, 'styleSlug')}
            placeholder={t(SELECT_STYLE)}
          />
          <Dropdown
            options={listRoomTypes as any}
            onSelect={(option) => handleSelect(option, 'roomTypeSlug')}
            placeholder={t(SELECT_ROOM_TYPE)}
          />
        </div>
        <div className="horizontal-line"></div>
        <Input.TextArea
          className="text-area"
          autoSize={{ minRows: 5, maxRows: 5 }}
          showCount
          maxLength={500}
          value={userPrompt}
          onChange={(e) => {
            setUserPrompt(e.target.value);
            setIsUserChangedOptions(true);
          }}
        />
      </div>
      <div className="guides">
        <GuidePoints />
      </div>
    </>
  );
};

export default AdvForm;
