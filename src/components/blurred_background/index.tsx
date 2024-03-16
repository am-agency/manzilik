import React, { ReactNode } from 'react';
import icons from '../../assets/icons';
import { profileIcons } from '../../assets/icons/profile';

interface BlurredBackgroundProps {
  children: ReactNode;
  icon?: string;
  text?: string;
  buttonText?: string;
  buttonAction?: () => void;
  isBlurred?: boolean;
}

const BlurredBackground: React.FC<BlurredBackgroundProps> = ({
  children,
  icon = profileIcons.lock,
  text = 'حتى تتمكن من متابعة معلومات العرض يجب عليك تحديث الخدمات الخاصة بك',
  buttonText = 'تحديث الخدمات',
  buttonAction = () => {},
  isBlurred = true,
}) => {
  return (
    <div className="blurred-background">
      {isBlurred ? (
        <div className="blur-effect">
          <div className="content">
            <img src={icon} alt="blur" />
            <p>{text}</p>
            <button onClick={buttonAction}> {buttonText}</button>
          </div>
        </div>
      ) : null}

      {children}
    </div>
  );
};

export default BlurredBackground;
