import React, { FunctionComponent, ReactNode, useContext, useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import 'antd-country-phone-input/dist/index.css';
import Form from 'antd/lib/form';
import { useTranslation } from 'react-i18next';
import docImg from '../../../assets/images/doc.svg';

import {
  OK,
  PLEASE_FILL_REQUIRED_FIELDS,
  PROFILE_DETAILS_UPDATED_SUCCESSFULLY,
  REQUIRED,
  SAVE,
  SOMETHING_WENT_WRONG,
} from '../../../locales/strings';
import { useMainContext } from '../../../app/providers/main';
import { completeProfessionalProfile, uploadProfessionalPhotos, uploadProfessionalVideos } from '../api';
import { useForm } from 'antd/lib/form/Form';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { uploadAsset } from '../../../utils/assets_manager';
import { MakhzanDestination } from '../../project/upload_idea';
import { UploadFile } from 'antd/lib/upload/interface';
import { Professional, Video } from '../../../API';
import { ConfigProvider } from 'antd-country-phone-input';
import en from 'world_countries_lists/data/countries/en/world.json';
import ar from 'world_countries_lists/data/countries/ar/world.json';
import { AR } from '../../../locales/constants';
import { withUserAuthenticator } from '../../../app/providers/user/with_user_authenticator';
import { getAuthenticatedProfessional } from '../../profile/api';
import { ClientStatus } from '../types';
import icons from '../../../assets/icons';
import { StepOne } from './steps/step_one';
import { setClientActionCreator } from '../../../app/providers/main/actions';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../app/providers/main/loading_constants';
import { CompleteProfessionalProfileContent } from './components/complete_profile_content';
import { getCountryCodeFromPhone, getNationalPhoneNumber } from '../utils';
import * as analytics from '../../../analytics';
import { PreviousHistoryContext } from '../../../context/previous_history_context';
import { CompleteProfileContext } from '../../../context/complete_profile_context';
import { SharedStateContext, SharedStateInterface } from '../../../context/shared_state_context';

interface Props {
  fromEditProfessionalProfile?: boolean;
  children?: ReactNode;
  editProfileStep?: number;
}

export const CompleteProfile: FunctionComponent<Props> = ({
  fromEditProfessionalProfile,
  children,
  editProfileStep,
}: Props) => {
  const [professional, setProfessional] = useState<Professional>();
  const [isForceRefresh, setIsForceRefresh] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [displayedVideos, setDisplayedVideos] = useState<Video[]>([]);
  const [showMissingAccountType, setShowMissingAccountType] = useState(false);
  const { previousHistoryLink } = useContext(PreviousHistoryContext) as {
    previousHistoryLink: string;
  };

  const { t, i18n } = useTranslation();
  const { requestApi, dispatchUser } = useMainContext();
  const [form] = useForm();
  const history = useHistory();
  const { setIsProfessionalCompleteProfile } = useContext(CompleteProfileContext) as {
    setIsProfessionalCompleteProfile?: (isCompleted: boolean) => void;
  };
  const { isProfessional } = useContext(SharedStateContext) as SharedStateInterface;

  const getProfessional = () => {
    requestApi(getAuthenticatedProfessional, {}, (professional: Professional, error: string) => {
      if (error) {
        return;
      }
      setDisplayedVideos([]);
      setProfessional(professional);
      updateFormValues({
        ...professional,
      });

      if (!fromEditProfessionalProfile && professional.client?.status === ClientStatus.IS_ACTIVE) {
        history.push('/');
      }
    });
  };

  const onStepOne = () => {
    const values = form.getFieldsValue();
    const companyLogo = localStorage.getItem('companyLogo');
    form
      .validateFields()
      .then(async () => {
        delete values.email;
        values.country_code = `+${values.mobile.code}`;
        values.mobile = values.mobile.phone;
        values.company_logo = companyLogo;

        requestApi(
          completeProfessionalProfile,
          {
            ...values,
          },
          (result: Professional, error: string) => {
            if (error) {
              return;
            }
            setProfessional({ ...professional, ...result });
            updateFormValues({
              ...professional,
              ...result,
            });
            setCurrentStep(currentStep + 1);
          },
          LOADING_LOW_PRIORITY_GLOBAL
        );
      })
      .catch(() => {
        checkPhoneNumber();
        form.scrollToField('last_name');
        message.destroy();
        message.error(t(PLEASE_FILL_REQUIRED_FIELDS));
      });
  };

  const onStepTwo = async () => {
    const photos = await onUploadPhotos(form.getFieldValue('fileList'));
    requestApi(
      uploadProfessionalPhotos,
      { photos },
      (result: Professional, error: string) => {
        if (error) {
          return;
        }
        setProfessional({ ...professional, ...result });
        updateFormValues({
          ...professional,
          ...result,
        });
        setCurrentStep(currentStep + 1);
        analytics.PublishEvent(new analytics.AnalyticsUploadPortfolioEvent(professional?.id!));
      },
      LOADING_LOW_PRIORITY_GLOBAL
    );
  };

  const showSuccessModal = () => {
    Modal.success({
      content: t(PROFILE_DETAILS_UPDATED_SUCCESSFULLY),
      icon: <img src={docImg} />,
      centered: true,
      okText: t(OK),
    });
  };

  const onFinish = (result: Professional) => {
    setProfessional({ ...professional, ...result });
    setDisplayedVideos([]);
    updateFormValues(result);
    showSuccessModal();
    dispatchUser(setClientActionCreator(professional?.client!));
    setIsForceRefresh(true);
    setIsProfessionalCompleteProfile!(true);
    if (previousHistoryLink) {
      history.push(previousHistoryLink);
    }
  };

  const onStepThree = () => {
    const professionalVideos = displayedVideos.length !== 0 ? displayedVideos : professional?.videos?.results;
    const videos = professionalVideos?.map((elm) => elm?.video);
    if (videos?.length === 0) {
      onFinish(professional as Professional);
      return; // don't upload empty videos - optional videos list
    }
    requestApi(
      uploadProfessionalVideos,
      { videos },
      (result: Professional, error: string) => {
        if (error) {
          return;
        }
        onFinish(result);
      },
      LOADING_LOW_PRIORITY_GLOBAL
    );
  };

  const updateFormValues = (professional: Professional) => {
    const { first_name, last_name, email, country_code, mobile } = professional.client!;

    form.setFieldsValue({
      first_name,
      last_name,
      locations: professional.locations?.map((city) => city?.id),
      categories: professional.categories?.map((cat) => cat?.id),
      company_logo: professional.company_logo,
      company_name: professional.company_name,
      company_registration_ref: professional.company_registration_ref,
      professional_type: professional.professional_type,
      personal_freelance_license: professional.personal_freelance_license,
      email,
      mobile: {
        code: mobile ? parseInt(country_code! || `+${getCountryCodeFromPhone(mobile!)}`) : +966,
        phone: mobile ? getNationalPhoneNumber(country_code + mobile!) : mobile,
      },
      services: professional.services?.map((ser) => ser?.id),
      about_me: professional.client?.about_me,
      address: professional?.address,
      blog: professional?.client?.blog,
      fileList: [],
    });
  };

  const checkPhoneNumber = () => {
    try {
      const profile = form.getFieldsValue();
      if (!profile.mobile.phone) {
        form.setFields([
          {
            name: 'mobile',
            errors: [t(REQUIRED)],
          },
        ]);
        message.destroy();
        form.scrollToField('last_name');
        message.error(t(PLEASE_FILL_REQUIRED_FIELDS));
        return;
      }
    } catch (error) {
      message.error(t(SOMETHING_WENT_WRONG));
    }
  };

  const onUploadPhotos = async (fileList: UploadFile[]) => {
    try {
      const photosList = fileList?.map((file) => {
        if (file.originFileObj) {
          return requestApi(
            uploadAsset,
            {
              file: file.originFileObj,
              file_name: uuid(),
              content_type: file.type,
              destination: MakhzanDestination.GENERAL,
            },
            async (url: string, error: string) => {
              if (error) {
                return;
              }
              return url;
            },
            LOADING_LOW_PRIORITY_GLOBAL
          );
        } else {
          return file.url;
        }
      });
      return await Promise.all(photosList || []);
    } catch (error) {
      console.error(error);
    }
  };

  const next = () => {
    setShowMissingAccountType(false);
    if (!professional?.professional_type) {
      setShowMissingAccountType(true);
      return;
    }
    switch (currentStep) {
      case 0:
        onStepOne();
        break;
      case 1:
        onStepTwo();
        break;
      default:
        break;
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);

    if (currentStep === 1) {
      setProfessional({ ...professional, ...form.getFieldsValue() });
    }
  };

  useEffect(() => {
    form.setFields([
      {
        name: 'company_logo',
        value: professional?.company_logo,
      },
      {
        name: 'professional_type',
        value: professional?.professional_type,
      },
    ]);
  }, [professional?.company_logo, professional?.professional_type]);

  /* this is to handle the actions from edit profile page that is shared with complete profile
 page but the only difference is the UI */
  const renderEditProfessionalProfileAction = () => {
    switch (editProfileStep) {
      case 1:
        return (
          <>
            <StepOne
              updateFormValues={updateFormValues}
              form={form}
              onUploadPhotos={onUploadPhotos}
              professional={professional!}
              setProfessional={setProfessional}
              showMissingAccountType={showMissingAccountType}
            />
            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={onStepOne}>
                {t(SAVE)}
              </Button>
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isProfessional) {
      getProfessional();
    }
  }, [currentStep, i18n.language, isProfessional]);

  return (
    <ConfigProvider
      locale={i18n.language === AR ? ar : en}
      areaMapper={(area) => {
        if (area.name?.includes('Saudi Arabia') || area.name?.includes('السعودية')) {
          return {
            ...area,
            emoji: <img src={icons.saudi_arabia_flag.icon} className="area-emoji" />,
          };
        }
        return area;
      }}
    >
      <div>
        {/** edit professional profile and complete professional profile have the same functions */}
        {fromEditProfessionalProfile ? (
          <div>
            <Form className="form" form={form} validateTrigger="onBlur">
              {renderEditProfessionalProfileAction()}
              {children}
            </Form>
          </div>
        ) : (
          <>
            {professional && (
              <CompleteProfessionalProfileContent
                onUploadPhotos={onUploadPhotos}
                professional={professional!}
                setProfessional={setProfessional}
                isForceRefresh={isForceRefresh}
                currentStep={currentStep}
                onStepThree={onStepThree}
                form={form}
                next={next}
                prev={prev}
                displayedVideos={displayedVideos}
                setDisplayedVideos={setDisplayedVideos}
                showMissingAccountType={showMissingAccountType}
              />
            )}
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default withUserAuthenticator(CompleteProfile);
