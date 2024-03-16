import React, { useContext, useEffect } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import icons from '../../../../assets/icons';
import { useTranslation } from 'react-i18next';
import DescriptionCard from './components/desc_card';
import BoxShadowContainer from '../../../../components/box_shadow_container';
import CustomTag from '../../../../components/custom_tag';
import {
  ARE_U_SURE_TO_SUBMIT_QUOTATION,
  ATTACH_UP_TO,
  ATTACH_YOUR_WORK,
  BUDGET_EXAMPLE,
  CANCEL,
  CATEGORY,
  CONFIRM_QUOTATION,
  IMAGES,
  MAKE_AN_OFFER,
  MESSAGE_TO_SERVICE_REQUESTER,
  OFFER_PRICE,
  PROJECT_DURATION,
  QUOTATIONS,
  QUOTATION_DETAILS,
  QUOTATION_LAST_STEP,
  QUOTATION_SENT,
  SAR,
  SERVICE_TYPE,
  TO_SUBMIT_RFQ,
  UPGRADE_SERVICES,
  UPLOAD_YOUR_WORK,
} from '../../../../locales/strings';
import Separator from '../../../../components/separator';
import Title from 'antd/lib/typography/Title';
import { Col, Form, Input, Select, Space, Typography } from 'antd';
import { required } from '../../../projects/add_new_project';
import { ExclamationCircleFilled } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { UploadImage } from '../../../professionals/request_professional_service/uploadAssets/upload_image';
import BlurredBackground from '../../../../components/blurred_background';
import { RfqContext, RfqProps } from '../../requests_for_quotations_context';
import { useMainContext } from '../../../../app/providers/main';
import { sendQuotation } from '../../api';
import { Quotation, Service, ServiceInquiry } from '../../../../API';
import { useHistory } from 'react-router-dom';
import RfqModal from '../rfqModal';
import { PROFESSIONAL_REQUESTS_WORKS_ON, PROFILE_ROUTE, TV_ROUTE } from '../../../../utils/routes';
interface QuotationsDrawerProps {
  closeDrawer: () => void;
}

function QuotationsDrawer(props: QuotationsDrawerProps) {
  const { t, i18n } = useTranslation();
  const { closeDrawer } = props;
  const { Option } = Select;
  const { setQuotationForm, quotationForm, isFormReady, selectedRfq } = useContext(RfqContext) as RfqProps;
  const [selectedTime, setSelectedTime] = React.useState<string>('MINUTES');
  const { requestApi } = useMainContext();
  const professionalServices = JSON.parse(localStorage.getItem('Professional')!)?.services;
  const history = useHistory();
  const isProfContainsService = professionalServices?.some((service: Service) =>
    selectedRfq?.services?.results?.some((selectedService) => selectedService?.id === service?.id)
  );
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isRequestLoading, setIsRequestLoading] = React.useState(false);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState(0);
  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setCurrentImage(0);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuotationForm({ ...quotationForm!, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    if (selectedRfq?.has_quotation) {
      history.push(`${PROFESSIONAL_REQUESTS_WORKS_ON}/${selectedRfq?.id}`);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleSubmission = () => {
    setIsRequestLoading(true);
    requestApi(
      sendQuotation,
      {
        ...quotationForm,
        service_inquiry_id: selectedRfq?.id,
        time_unit: selectedTime,
      },
      (res: Quotation, err: string) => {
        if (err) {
          setIsRequestLoading(false);
          return;
        }
        closeDrawer();
        setIsModalVisible(false);
        setIsRequestLoading(false);
      }
    );
  };

  const timeOptions = [
    {
      id: 1,
      titleAr: 'دقيقه',
      titleEn: 'min',
      value: 'MINUTES',
    },
    {
      id: 2,
      titleAr: 'ساعه',
      titleEn: 'hour',
      value: 'HOURS',
    },
    {
      id: 3,
      titleAr: 'يوم',
      titleEn: 'day',
      value: 'DAYS',
    },
    {
      id: 4,
      titleAr: 'شهر',
      titleEn: 'month',
      value: 'MONTHS',
    },
    {
      id: 5,
      titleAr: 'سنه',
      titleEn: 'year',
      value: 'YEARS',
    },
  ];

  const selectAfter = (
    <Select
      defaultValue={
        i18n.language === 'ar'
          ? timeOptions.find((option) => option.value === selectedTime)?.titleAr
          : timeOptions.find((option) => option.value === selectedTime)?.titleEn
      }
      onChange={(e) => {
        setSelectedTime(e);
      }}
    >
      {timeOptions.map((option) => (
        <Option key={option.id} value={option.value}>
          {i18n.language === 'ar' ? option.titleAr : option.titleEn}
        </Option>
      ))}
    </Select>
  );
  return (
    <>
      <div className="quotation-drawer-container" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="header">
          <div className="close-section">
            <img src={icons.close_icon} alt="close" onClick={closeDrawer} />
            <p>{t(QUOTATION_DETAILS)}</p>
          </div>
          {/* <img src={icons.flag} alt="flag" /> */}
        </div>
        <BlurredBackground
          isBlurred={!isProfContainsService!}
          buttonAction={() => window.location.replace(PROFILE_ROUTE)}
          text={t(TO_SUBMIT_RFQ)}
          buttonText={t(UPGRADE_SERVICES)}
        >
          <div className="scrollable">
            <div className="desc_section">
              <DescriptionCard />
            </div>
            <div className="body">
              {selectedRfq?.photos?.results?.length! > 0 ? (
                <>
                  <p className="title">{t(IMAGES)}</p>
                  <BoxShadowContainer>
                    <div className="images-container">
                      {selectedRfq?.photos?.results?.map((image, index) => (
                        <img
                          key={image?.photo}
                          className="image"
                          src={image?.photo!}
                          onClick={() => {
                            setCurrentImage(index);
                            setIsViewerOpen(true);
                          }}
                          alt="image"
                        />
                      ))}
                    </div>
                  </BoxShadowContainer>

                  <Separator vertical={10} />
                </>
              ) : null}

              {selectedRfq?.services?.results?.length! > 0 ? (
                <>
                  <p className="title">{t(SERVICE_TYPE)}</p>
                  <BoxShadowContainer>
                    <div className="tags-container">
                      {selectedRfq?.services?.results?.map((service) => (
                        <CustomTag key={service?.id!}>{service?.title!}</CustomTag>
                      ))}
                    </div>
                  </BoxShadowContainer>
                  <Separator vertical={10} />
                </>
              ) : null}

              <p className="title">{t(MAKE_AN_OFFER)}</p>
              <BoxShadowContainer>
                <div className="form-container">
                  <div className="input-wrapper">
                    <p className="input-title">{t(OFFER_PRICE)}</p>
                    <Form.Item initialValue={''} rules={[required]} validateTrigger="onSubmit" className="title-item">
                      <Input name="budget_limits" onChange={onInputChange} />
                    </Form.Item>
                    <Space className="item-hint">
                      <ExclamationCircleFilled />
                      <Typography.Text>{t(BUDGET_EXAMPLE)}</Typography.Text>
                    </Space>
                  </div>
                  <div className="input-wrapper">
                    <p className="input-title">{t(PROJECT_DURATION)}</p>
                    <Form.Item initialValue={''} rules={[required]} validateTrigger="onSubmit" className="title-item">
                      <Input name="execution_time" addonAfter={selectAfter} onChange={onInputChange} />
                    </Form.Item>
                  </div>
                  <div className="input-wrapper">
                    <p className="input-title">{t(MESSAGE_TO_SERVICE_REQUESTER)}</p>
                    <Form.Item
                      name="description"
                      initialValue={''}
                      rules={[required]}
                      validateTrigger="onSubmit"
                      className="title-item"
                    >
                      <TextArea
                        showCount
                        maxLength={200}
                        onChange={(e) => setQuotationForm({ ...quotationForm!, description: e.target.value })}
                      />{' '}
                    </Form.Item>
                  </div>
                  <div className="input-wrapper">
                    <p className="input-title">{t(ATTACH_YOUR_WORK)}</p>
                    <UploadImage
                      mainText=""
                      uploadText={t(UPLOAD_YOUR_WORK)}
                      onChange={(images) => setQuotationForm({ ...quotationForm!, photos: images })}
                      maxCount={3}
                    />
                    <p className="upload-text">{t(ATTACH_UP_TO)}</p>
                  </div>
                </div>
              </BoxShadowContainer>

              <button
                className={`submit-btn ${isFormReady || selectedRfq?.has_quotation ? '' : 'disabled'}`}
                onClick={handleSubmit}
                disabled={!isFormReady && !selectedRfq?.has_quotation}
              >
                {selectedRfq?.has_quotation ? t(QUOTATION_SENT) : t(MAKE_AN_OFFER)}
              </button>
            </div>
          </div>
        </BlurredBackground>
        <RfqModal
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
          title={t(ARE_U_SURE_TO_SUBMIT_QUOTATION)}
          subTitle={t(QUOTATION_LAST_STEP)}
          bodyContent={<div className="modal-content">{quotationForm?.description!}</div>}
          btnOneAction={handleSubmission}
          btnOneText={t(CONFIRM_QUOTATION)}
          btnTwoAction={() => setIsModalVisible(false)}
          btnTwoText={t(CANCEL)}
          badgeText={`${quotationForm?.budget_limits!} ${t(SAR)}`}
          btnOneLoading={isRequestLoading}
        />
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={selectedRfq?.photos?.results?.map((item) => item?.photo as string) || []}
          currentIndex={currentImage}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
          rightArrowComponent={<div className="right-arrow"></div>}
          leftArrowComponent={<div className="left-arrow"></div>}
        />
      )}
    </>
  );
}

export default QuotationsDrawer;
