import React, { useContext, useEffect, useState } from 'react';
import StepOne from './components/step_one';
import StepTwo from './components/step_two';
import { Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import StepThree from './components/step_three';
import { GigsStepsContext } from '../../context/gigs_steps_context';
import StepFour from './components/step_four';
import { Loading } from '../../components/loading';
import StepFive from './components/step_five';
import { getValueAndUpdateSearchUrl } from '../../utils';
import { GigsServicesContext, GigsServicesInterface } from '../../context/services_context';

export const stepId = ['services', 'city', 'service-type', 'service-details', 'service-request'];

const RequestGigPage = () => {
  const { Step } = Steps;
  const { steps, data, isLoading, loadingCardsArray } = useContext(GigsServicesContext) as GigsServicesInterface;
  const { i18n } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const contextValue = useContext(GigsStepsContext);
  const params = new URLSearchParams(location.search);
  const fromProfile = params.get('fromProfile');
  if (!contextValue) {
    return <Loading />;
  }
  const { currentStep, updateStep, setSelectedService } = contextValue;

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const serviceId = params.get('serviceId');

      if (serviceId) {
        updateStep(1);
        const service = data?.find((item) => item.id === serviceId);
        if (service) {
          setSelectedService!(service);
        }
      }
    }
  }, [location.search, i18n.language]);

  useEffect(() => {
    if (location.search) {
      const stepNumber = parseInt(params.get('step')!) - 1;
      if (stepNumber) {
        updateStep(stepNumber);
      }
    }
  }, [location.search, i18n.language]);

  const onChange = (value: number) => {
    getValueAndUpdateSearchUrl!(history, 'step', `${value + 1}`);
    updateStep(value);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne data={data} isLoading={isLoading!} loadingCardsArray={loadingCardsArray} />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;

      case 3:
        return <StepFour />;

      case 4:
        return <StepFive />;
      default:
        return;
    }
  };

  return (
    <div
      className={`request-gig-page ${currentStep === 3 && fromProfile === 'true' ? 'full-screen-height' : ''}`}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="stepper-container">
        <div className="steps-wrapper">
          <Steps current={currentStep} onChange={onChange} className="checkout-steps">
            {steps?.map((item, index) => (
              <Step
                disabled={
                  index > currentStep ||
                  (fromProfile === 'true' && currentStep === 3) ||
                  (fromProfile === 'true' && currentStep === 4)
                }
                key={item.title}
                title={item.title}
                icon={<img src={item.icon} alt="step-icon" />}
              />
            ))}
          </Steps>
        </div>
      </div>
      <div className={`form-container ${(currentStep === 3 || currentStep === 4) && 'remove-padding-bg'}`}>
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default RequestGigPage;
