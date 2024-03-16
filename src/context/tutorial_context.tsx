import { useFeature } from 'flagged';
import React, { createContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SHOW_TUTORIAL_ADD_GIGS } from '../app/settings';

export interface TutorialInterface {
  currentStep: number;
  stepIncremental: (number: number) => void;
  pointerPosition?: string;
  setPointerPosition?: React.Dispatch<React.SetStateAction<string>>;
  showTutorial?: boolean;
  setShowTutorial?: React.Dispatch<React.SetStateAction<boolean>>;
  disableTutorial?: boolean;
  setDisableTutorial?: React.Dispatch<React.SetStateAction<boolean>>;
  disappearTutorial?: () => void;
}

interface TutorialContextProviderProps {
  children: React.ReactNode;
}

const TutorialContext = createContext<TutorialInterface | undefined>(undefined);

const TutorialProvider = ({ children }: TutorialContextProviderProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [pointerPosition, setPointerPosition] = useState<string>('top');
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const stepIncremental = (number: number) => {
    setCurrentStep(number);
  };
  const hasShownBanner = JSON.parse(localStorage.getItem('hasShownBanner')!);
  const [disableTutorial, setDisableTutorial] = useState<boolean>(false);
  const isTutorialFeatureEnabled = useFeature(SHOW_TUTORIAL_ADD_GIGS);

  const disappearTutorial = () => {
    localStorage.setItem('hasShownBanner', 'false');
  };

  useEffect(() => {
    if (currentStep === 4) {
      setTimeout(() => {
        localStorage.setItem('hasShownBanner', 'false');
      }, 5000);
    }
  }, [currentStep]);

  useEffect(() => {
    if (hasShownBanner && isTutorialFeatureEnabled) {
      setDisableTutorial!(false);
    } else {
      setDisableTutorial!(true);
    }
  }, [hasShownBanner, isTutorialFeatureEnabled]);

  const contextValue: TutorialInterface = {
    currentStep,
    stepIncremental,
    pointerPosition,
    setPointerPosition,
    showTutorial,
    setShowTutorial,
    disableTutorial,
    setDisableTutorial,
    disappearTutorial,
  };

  return <TutorialContext.Provider value={contextValue}>{children}</TutorialContext.Provider>;
};

export { TutorialContext, TutorialProvider };
