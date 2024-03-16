import React, { useContext, useEffect } from 'react';
import { TutorialContext, TutorialInterface } from '../../context/tutorial_context';
import { useTranslation } from 'react-i18next';
import * as analytics from '../../analytics';

interface CardProps {
  title: string;
  buttonText: string;
  top?: string;
  left?: string;
  right?: string;
}

const TutorialCard: React.FC<CardProps> = ({ title, buttonText, top = '2.5%', left = '12%', right = 'auto' }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const { i18n } = useTranslation();
  const { pointerPosition, currentStep, disappearTutorial } = useContext(TutorialContext) as TutorialInterface;

  const handleVisibility = () => {
    setIsVisible(!isVisible);
    analytics.PublishEvent(new analytics.AnalyticCloseAddGigEvent(currentStep.toString()!));
    disappearTutorial!();
  };
  const lang = i18n.language;

  useEffect(() => {
    switch (currentStep) {
      case 1:
        analytics.PublishEvent(new analytics.AnalyticsTutorialAddGigFirstEvent());
        break;
      case 2:
        analytics.PublishEvent(new analytics.AnalyticsTutorialAddGigSecondEvent());
        break;
      case 3:
        analytics.PublishEvent(new analytics.AnalyticsTutorialAddGigThirdEvent());
        break;
      case 4:
        analytics.PublishEvent(new analytics.AnalyticsTutorialAddGigEndEvent());
        break;
      default:
        return;
        break;
    }
  }, [currentStep]);

  return (
    <div
      className={`tutorialContainer ${isVisible ? '' : 'disappear'}`}
      style={{
        top: top,
        left: left,
        right: right,
      }}
    >
      <div className={`arrow ${pointerPosition}`}></div>
      <div className="header">
        <span className="counter">{`${currentStep}/4`}</span>
        <span className="closeButton" onClick={handleVisibility}>
          x
        </span>
      </div>
      <div className="content">
        <p className="text">{title}</p>
      </div>
      <div className="footer">
        <button className="button">{buttonText}</button>
      </div>
    </div>
  );
};

export default TutorialCard;
