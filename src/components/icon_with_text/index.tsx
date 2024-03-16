import React, { ReactNode } from 'react';
import { aiIcons } from '../../assets/icons/ai';

interface IconWithTextProps {
  icon: string;
  text: string;
  textColor?: string;
  withDot?: boolean;
}

const IconWithText: React.FC<IconWithTextProps> = ({ icon, text, textColor, withDot = false }) => {
  return (
    <>
      {text ? (
        <div
          className="title-with-icon"
          style={{
            color: textColor ? textColor : '#000',
          }}
        >
          <img src={icon} alt="ai Checked" />
          <p className="icon-title">{text}</p>
          {withDot && (
            <span
              className="dot"
              style={{
                backgroundColor: textColor ? textColor : '#000',
              }}
            ></span>
          )}
        </div>
      ) : null}
    </>
  );
};

export default IconWithText;
