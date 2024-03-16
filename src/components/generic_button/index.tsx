import React from 'react';
import icons from '../../assets/icons';

interface Props {
  width?: string;
  padding?: string;
  backgroundImage?: string;
  isDisabled?: boolean;
  onButtonClick?: () => void;
  btnText?: string;
  backgroundColor?: string;
}
function GenericButton(props: Props) {
  const { width, padding, backgroundImage, isDisabled, onButtonClick, btnText, backgroundColor } = props;

  return (
    <div
      className="generic-button"
      onClick={onButtonClick}
      style={{
        width: width || 'auto',
        padding: padding || '7px 15.5px',
        backgroundImage: backgroundImage || '',
        pointerEvents: isDisabled ? 'none' : 'auto',
        backgroundColor: backgroundColor || '',
      }}
    >
      <p>{btnText}</p>
      <img src={icons.prof_arrow_white} width="24" height="24" alt="arrow" />
    </div>
  );
}

export default GenericButton;
