import React, { useState } from 'react';
import { AI_INPUT_PLACEHOLDER, DESIGN_DESC, OPTIONAL } from '../../../../locales/strings';
import { Tooltip } from 'antd';
import { aiIcons } from '../../../../assets/icons/ai';
import { useTranslation } from 'react-i18next';
interface DesignDescriptionProps {
  onDescriptionChange?: (value: string) => void;
}

function DesignDescription(props: DesignDescriptionProps) {
  const { onDescriptionChange } = props;
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="design-description">
      <p className="design-description-title">
        {t(DESIGN_DESC)}
        <span> ({t(OPTIONAL)}) </span>
        <Tooltip title={t(DESIGN_DESC)}>
          <img src={aiIcons.info} />
        </Tooltip>
      </p>
      <textarea
        className="design-description-input"
        onChange={handleOnChange}
        value={inputValue}
        placeholder={t(AI_INPUT_PLACEHOLDER)}
        onKeyUp={(e) => {
          onDescriptionChange!(e.currentTarget.value);
        }}
      />
      <div className="horizontal-line"></div>
    </div>
  );
}

export default DesignDescription;
