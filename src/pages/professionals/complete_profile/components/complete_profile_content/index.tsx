import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Alert, Button, Col, Form, FormInstance, Row, Steps, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { getLayoutDirection } from '../../../../../app/layouts';
import { profileIcons } from '../../../../../assets/icons/profile';
import Separator from '../../../../../components/separator';
import { AR } from '../../../../../locales/constants';
import pic from '../../../../../assets/backgrounds/profile.png';

import {
  COMPLETE_PROFILE,
  ERROR_ACCOUNT_TYPE_NOT_SELECTED,
  NEXT,
  PERSONAL_INFORMATION,
  PHOTOS_GALLERY,
  PREV,
  UNDER_REVIEW,
  VIDEOS,
} from '../../../../../locales/strings';
import { StepOne } from '../../steps/step_one';
import { StepThree } from '../../steps/step_three';
import { StepTwo } from '../../steps/step_two';
import { Professional, Video } from '../../../../../API';
import { ClientStatus } from '../../../types';
import { getCountryCodeFromPhone, getNationalPhoneNumber } from '../../../utils';
import { UploadFile } from 'antd/lib/upload/interface';

const { Step } = Steps;

interface Props {
  professional: Professional;
  setProfessional: Dispatch<SetStateAction<Professional | undefined>>;
  currentStep: number;
  isForceRefresh: boolean;
  next: () => void;
  prev: () => void;
  form: FormInstance;
  onStepThree: () => void;
  displayedVideos: Video[];
  setDisplayedVideos: Function;
  showMissingAccountType: boolean;
  onUploadPhotos: (fileList: UploadFile[]) => Promise<(string | void)[] | undefined>;
}

export const CompleteProfessionalProfileContent = ({
  professional,
  setProfessional,
  onUploadPhotos,
  currentStep,
  isForceRefresh,
  form,
  next,
  prev,
  onStepThree,
  displayedVideos,
  setDisplayedVideos,
  showMissingAccountType,
}: Props) => {
  const { i18n, t } = useTranslation();
  const isMobile = window.innerWidth <= 600;

  const pendingCol = i18n.language == AR ? 8 : 12;
  const stepsCol = 12;

  const steps = [
    {
      title: !isMobile ? t(PERSONAL_INFORMATION) : '',
      content: (
        <StepOne
          form={form}
          onUploadPhotos={onUploadPhotos}
          professional={professional}
          setProfessional={setProfessional}
          showMissingAccountType={showMissingAccountType}
        />
      ),
      icon: currentStep >= 0 ? profileIcons.informationActive : profileIcons.information,
    },
    {
      title: !isMobile ? t(PHOTOS_GALLERY) : '',
      content: <StepTwo professional={professional!} isForceRefresh={isForceRefresh} />,
      icon: currentStep >= 1 ? profileIcons.imageActive : profileIcons.image,
    },
    {
      title: !isMobile ? t(VIDEOS) : '',
      content: (
        <StepThree
          professional={professional!}
          isForceRefresh={isForceRefresh}
          setDisplayedVideos={setDisplayedVideos}
          displayedVideos={displayedVideos}
        />
      ),
      icon: currentStep >= 2 ? profileIcons.video_active : profileIcons.video,
    },
  ];

  const updateValues = () => {
    const { first_name, last_name, email, mobile, country_code } = professional?.client!;
    form.setFieldsValue({
      first_name,
      last_name,
      locations: professional.locations?.map((city) => city?.id),
      categories: professional.categories?.map((cat) => cat?.id),
      email,
      mobile: {
        code: mobile ? parseInt(country_code! || `+${getCountryCodeFromPhone(mobile!)}`) : +966,
        phone: mobile ? getNationalPhoneNumber(mobile!) : mobile,
      },
      services: professional.services?.map((ser) => ser?.id),
      about_me: professional.client?.about_me,
      address: professional?.address,
      blog: professional?.client?.blog,
      fileList: [],
    });
  };

  useEffect(() => {
    updateValues();
  }, [professional]);

  return (
    <Row className="complete-profile" justify={'center'}>
      <Col span={21}>
        <Row justify="center" gutter={32}>
          <section className="complete-profile-form">
            <Row align="middle" justify="space-between" gutter={[2, 12]}>
              <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                <Typography.Title className="prof-title">{t(COMPLETE_PROFILE)}</Typography.Title>
              </Col>
              <Col xl={pendingCol} lg={pendingCol} md={pendingCol} sm={24} xs={24}>
                {professional?.client?.status === ClientStatus.PENDING && (
                  <Row className="pending-profile-msg" justify="center" align="middle">
                    <div className="pending-wrapper">
                      <img src={profileIcons.avatar} alt="avatar-icon" />
                      <img className={`pending-icon ${i18n.language}`} src={profileIcons.pending} alt="pending-icon" />
                    </div>
                    <Separator horizontal={8} />
                    <Typography.Text className="under-review">{t(UNDER_REVIEW)}</Typography.Text>
                  </Row>
                )}
              </Col>
            </Row>
            <Separator vertical={20} />

            <Steps current={currentStep} className="profile-steps">
              {steps?.map((item) => (
                <Step key={item.title} title={item.title} icon={<img src={item.icon} alt="step-icon" />} />
              ))}
            </Steps>
            <Separator vertical={14} />
            <Form className="form" form={form} validateTrigger="onBlur">
              <div className="steps-content photos-vidoes-container">{steps[currentStep].content}</div>
              <Separator vertical={14} />
              <Row className="steps-action" align="middle" gutter={15}>
                <Col span={currentStep > 0 ? 18 : 24}>
                  {currentStep < steps.length - 1 && (
                    <Button type="primary" htmlType="submit" onClick={next}>
                      {t(NEXT)}
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button type="primary" onClick={onStepThree}>
                      {t(COMPLETE_PROFILE)}
                    </Button>
                  )}
                </Col>
                {currentStep > 0 && (
                  <Col span={currentStep > 0 ? 6 : 0}>
                    <Button className="prev-btn" onClick={prev}>
                      {t(PREV)}
                    </Button>
                  </Col>
                )}
              </Row>
            </Form>
          </section>
        </Row>
      </Col>
    </Row>
  );
};
