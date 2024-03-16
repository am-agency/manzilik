import { Button, Col, Row, Typography } from 'antd';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import ImageViewer from 'react-simple-image-viewer';
import {
  ACCEPTED_OFFER,
  APPLICANTS,
  APPLY_TO_QUOTATIONS,
  ARE_U_SURE_TO_SUBMIT_QUOTATION,
  CANCEL,
  CANCELED_OFFER,
  CANCEL_REQUEST,
  CATEGORY,
  COMPLETED_REQUEST,
  CONFIRM_QUOTATION,
  DESCRIPTION,
  IMAGES,
  NO_QUOTATIONS,
  PRICE,
  PROFESSIONAL,
  PROJECT_DURATION,
  QUOTATION_DETAILS,
  QUOTATION_LAST_STEP,
  READ_MORE,
  REJECT,
  REQUEST_COMPLETED,
  REQUEST_DETAILS,
  RE_PUBLISH,
  SERVICE_DESCRIPTION,
  SERVICE_TYPE,
  VIEW_MORE,
  YOU_CAN_PUBLISH,
} from '../../../../../../locales/strings';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { AR } from '../../../../../../locales/constants';
import * as analytics from '../../../../../../analytics';
import icons from '../../../../../../assets/icons';
import Separator from '../../../../../../components/separator';
import { useHistory, useLocation } from 'react-router-dom';
import BoxShadowContainer from '../../../../../../components/box_shadow_container';
import TextWithIcon from '../../../../../../components/text_with_icon';
import { profileIcons } from '../../../../../../assets/icons/profile';
import ReadMoreText from '../../../../../../components/read_more_text';
import CustomTag from '../../../../../../components/custom_tag';
import Card from '../quotation_card';
import ManzilikDrawer from '../../../../../../components/manzilik_drawer';
import { Quotation, QuotationStatus, ServiceInquiry, ServiceInquiryStatus } from '../../../../../../API';
import RfqModal from '../../../../../requests_for_quotations/components/rfqModal';
import AvatarCard from '../../../../../../components/avatar_card';
import { useMainContext } from '../../../../../../app/providers/main';
import { acceptQuotation } from '../../../../../requests_for_quotations/api';
import moment from 'moment';
import 'moment/dist/locale/ar';
import { getTimeFormatBasedOnLanguage } from '../../../../../idea/utils';
import { Elapsed } from '../../../../../../components/headers/notifications/elapsed';
import { useFeatures } from 'flagged';
import { SERVICE_COMPLETED_FLOW } from '../../../../../../app/settings';
import StartChatButton from '../../../../../../components/custom_button';
import MessageIcon from '../../../../../../icons/message_icon';
import { useServiceRequestActions } from '../../../requests_works_on/hooks/useServiceRequestActions';
import { LOADING_STATE } from '../../../requests_works_on/request_details';
import { useClient } from '../../../../../../app/hooks/use_client';
import { ServiceInquiryRejectForm } from '../../service_inquery_reject_form';
import OrderDetails from '../order_details';
import { useServiceRequestDetails } from '../../../requests_works_on/hooks/useServiceRequestDetails';

interface QuotationsRequestContentProps {
  serviceRequestDetails: ServiceInquiry;
  isProfessional: boolean;
  reloadList: () => void;
  showConfirmAcceptToast?: boolean;
  setShowConfirmAcceptToast?: (value: boolean) => void;
  activeTab?: number;
}

const QuotationsRequestContent = (props: QuotationsRequestContentProps) => {
  const {
    serviceRequestDetails,
    isProfessional,
    reloadList,
    showConfirmAcceptToast,
    setShowConfirmAcceptToast,
    activeTab,
  } = props;

  const isMobileView = useMediaQuery({ query: '(max-width: 768px)' });
  const { t, i18n } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsDrawer, setIsDetailsDrawer] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const isArabic = i18n.language === AR;
  const location = useLocation();
  const { search, pathname } = location;
  const { requestApi } = useMainContext();
  const isRequestsWorksOn = pathname.includes('requests-works-on');
  const features = useFeatures();
  const { client } = useClient();
  const { loadServiceRequestDetails } = useServiceRequestDetails();
  const history = useHistory();
  const refetchServiceRequestDetails = async () => {
    await loadServiceRequestDetails(serviceRequestDetails.id!);
  };

  const myQuotation = serviceRequestDetails?.quotations?.results?.find(
    (quotation) => quotation?.professional?.id === client?.id
  );
  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setCurrentImage(0);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const isContracted = serviceRequestDetails.status === ServiceInquiryStatus.CONTRACTED;
  const isCancelled = serviceRequestDetails.status === ServiceInquiryStatus.CANCELLED;
  const Arrow = useMemo(() => {
    return i18n.language === AR ? () => <LeftOutlined /> : () => <RightOutlined />;
  }, [i18n.language]);
  const Title = (props: PropsWithChildren<unknown>) => <Typography.Title level={5}>{props.children}</Typography.Title>;

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const submitAcceptQuotation = () => {
    requestApi(acceptQuotation, { id: selectedQuotation?.id! }, (res: Quotation, err: string) => {
      if (err) {
        return;
      }
      setIsModalVisible(false);
      setIsDrawerOpen(false);
      window.location.reload();
    });
  };
  const { acceptServiceRequest, completedServiceRequest } = useServiceRequestActions();

  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isCompletedLoading, setIsCompletedLoading] = useState(false);
  const [modalType, setModalType] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [showInquiryRejectionForm, setShowInquiryRejectionForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<LOADING_STATE>(LOADING_STATE.INIT);
  const quotationHeaderTitle = isContracted
    ? t(ACCEPTED_OFFER)
    : isCancelled
    ? t(CANCELED_OFFER)
    : t(APPLY_TO_QUOTATIONS);

  const isEmptyQuotations = serviceRequestDetails?.quotations?.results?.length === 0;
  const [quotationCardsList, setQuotationCardsList] = useState<Quotation[]>([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    if (serviceRequestDetails?.quotations?.results?.length) {
      setQuotationCardsList(
        serviceRequestDetails?.quotations
          ?.results!.slice(0, 2)
          ?.filter((quotation) => quotation !== null) as Quotation[]
      );
    }
  }, [serviceRequestDetails?.quotations?.results]);

  const HandleToggleInquiryRejectionForm = () => {
    setShowInquiryRejectionForm(!showInquiryRejectionForm);
  };

  const onCompleteServiceRequest = async () => {
    setIsCompletedLoading(true);
    try {
      await completedServiceRequest(serviceRequestDetails?.id!, client?.id!);
      analytics.PublishEvent(new analytics.AnalyticsCompleteService(client?.id!));
      setModalType('completed');
      setShowInquiryRejectionForm(!showInquiryRejectionForm);
      setIsCompletedLoading(false);
    } catch (error) {
      setIsCompletedLoading(false);
    }
  };

  const isAcceptedOrContracted =
    serviceRequestDetails.status === ServiceInquiryStatus.ACCEPTED ||
    serviceRequestDetails.status === ServiceInquiryStatus.CONTRACTED;

  return (
    <Row
      gutter={12}
      style={{
        display: 'flex',
        flexDirection: isMobileView ? 'column' : 'row',
      }}
      className="service-request-content"
    >
      <Col xl={10} lg={16} md={24} flex={1}>
        <OrderDetails order={serviceRequestDetails} />
      </Col>

      <Col xl={14} lg={16} md={24}>
        {isRequestsWorksOn ? (
          <Col>
            <Title>{t(QUOTATION_DETAILS)}</Title>
            <BoxShadowContainer>
              <Row justify="start" align="middle">
                <TextWithIcon icon={profileIcons.time} text={<Elapsed dateString={myQuotation?.created_at!} />} />
              </Row>
            </BoxShadowContainer>
            {myQuotation?.budget_limits ? (
              <BoxShadowContainer>
                <p className="sub-title">{t(PRICE)}</p>
                <p>{myQuotation?.budget_limits}</p>
              </BoxShadowContainer>
            ) : null}
            {myQuotation?.execution_time ? (
              <BoxShadowContainer>
                <p className="sub-title">{t(PROJECT_DURATION)}</p>
                <p>{`${myQuotation?.execution_time} ${t(myQuotation?.time_unit!)}`}</p>
              </BoxShadowContainer>
            ) : null}

            {myQuotation?.description ? (
              <BoxShadowContainer>
                <p className="sub-title">{t(DESCRIPTION)}</p>
                <p>{myQuotation?.description}</p>
              </BoxShadowContainer>
            ) : null}

            {myQuotation?.photos?.count ? (
              <>
                <Title>{t(IMAGES)}</Title>
                <BoxShadowContainer>
                  <div className="images-container">
                    {myQuotation?.photos?.results?.map((item, index) => (
                      <img
                        key={item?.photo}
                        className="image"
                        src={item?.photo!}
                        alt="image"
                        onClick={() => {
                          setCurrentImage(index);
                          setIsViewerOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </BoxShadowContainer>
              </>
            ) : null}

            {isMobileView ? (
              <div className="popover">
                {isProfessional && serviceRequestDetails.status !== ServiceInquiryStatus.COMPLETED ? (
                  <button className="complete" onClick={onCompleteServiceRequest}>
                    {t(COMPLETED_REQUEST)}
                  </button>
                ) : null}
                {isAcceptedOrContracted ? (
                  <button className="cancel" onClick={HandleToggleInquiryRejectionForm}>
                    {t(CANCEL)}
                  </button>
                ) : null}

                <StartChatButton icon={<MessageIcon color="#464774" />} item={serviceRequestDetails} />
              </div>
            ) : null}
            {showInquiryRejectionForm ? (
              <ServiceInquiryRejectForm
                onDismiss={HandleToggleInquiryRejectionForm}
                onCompleteRejection={HandleToggleInquiryRejectionForm}
                id={serviceRequestDetails.id!}
                item={serviceRequestDetails}
                modalType={modalType}
                reloadList={reloadList}
              />
            ) : null}
          </Col>
        ) : (
          <Col>
            <div className="quotations-header">
              <Title>{quotationHeaderTitle}</Title>
              {isContracted ? null : (
                <CustomTag>{`${t(APPLICANTS)} | ${serviceRequestDetails?.quotations?.count}`}</CustomTag>
              )}
            </div>
            <div className={`quotations-body ${isEmptyQuotations ? 'no-quotation' : ''}`}>
              <div className="cards-wrapper">
                {serviceRequestDetails?.quotations?.results?.length ? (
                  <>
                    <div className={`cards-list ${!showMore ? 'show-all' : ''}`}>
                      {quotationCardsList?.map((quotation) => (
                        <Card
                          key={quotation?.id}
                          text={serviceRequestDetails?.description!}
                          item={quotation!}
                          rfqStatus={serviceRequestDetails?.status!}
                          onMoreInfoClick={() => {
                            setIsDrawerOpen(true);
                            setSelectedQuotation(quotation);
                            setIsDetailsDrawer(true);
                          }}
                        />
                      ))}
                    </div>
                    {showMore && serviceRequestDetails?.quotations?.results?.length > 2 ? (
                      <button
                        className="see-more-bids"
                        onClick={() => {
                          setQuotationCardsList(serviceRequestDetails?.quotations?.results! as Quotation[]);
                          setShowMore(false);
                        }}
                      >
                        {t(VIEW_MORE)}
                      </button>
                    ) : null}
                  </>
                ) : (
                  <div className="empty-state">
                    <img src={profileIcons.cards} alt="no-quotations" />
                    <div className="no-quotations">{t(NO_QUOTATIONS)}</div>
                  </div>
                )}
              </div>
            </div>
            {isCancelled ? (
              <div className="re-publish">
                <p className="text">{t(YOU_CAN_PUBLISH)}</p>
                <button onClick={() => history.push('/request-quotation-service')}>{t(RE_PUBLISH)} </button>
              </div>
            ) : null}
          </Col>
        )}
        <div className="actions">
          {!isMobileView && isAcceptedOrContracted ? (
            <Row
              gutter={10}
              style={{
                marginBottom: '10px',
              }}
            >
              {/* <Col span={14}>
                <Button
                  size="large"
                  block
                  className="complete-request-btn"
                  onClick={onCompleteServiceRequest}
                  loading={isCompletedLoading}
                >
                  {t(REQUEST_COMPLETED)}
                </Button>
              </Col> */}

              <Col span={24}>
                <Button
                  size="large"
                  block
                  className="cancel-request-btn"
                  onClick={HandleToggleInquiryRejectionForm}
                  loading={actionLoading === LOADING_STATE.PENDING_REJECT}
                >
                  {t(CANCEL_REQUEST)}
                </Button>
              </Col>
            </Row>
          ) : null}
        </div>
      </Col>

      <ManzilikDrawer
        size={482}
        open={isDrawerOpen}
        setDrawerOpen={setIsDrawerOpen}
        direction={isArabic ? 'right' : 'left'}
        className="drawer-wrapper"
      >
        <div className="quotations-drawer-wrapper">
          <div className="quotations-drawer-header">
            <div className="close-section">
              <img src={icons.close_icon} alt="close" onClick={closeDrawer} />
              <Title>{t(QUOTATION_DETAILS)}</Title>
            </div>
          </div>
          {isDetailsDrawer ? (
            <>
              <Card
                isDetailsCard
                onAcceptClick={() => {
                  handleOpenModal();
                }}
                key={selectedQuotation?.id}
                text={serviceRequestDetails?.description!}
                item={selectedQuotation!}
              />
              {/* <div className="footer">
                <button
                  className={
                    selectedQuotation?.status === QuotationStatus.ACCEPTED
                      ? 'accept'
                      : selectedQuotation?.status === QuotationStatus.WAITING_RESPONSE
                      ? ''
                      : 'reject'
                  }
                  onClick={handleOpenModal}
                >
                  {selectedQuotation?.status === QuotationStatus.ACCEPTED
                    ? 'تم قبول العرض'
                    : selectedQuotation?.status === QuotationStatus.WAITING_RESPONSE
                    ? ' قبول العرض'
                    : 'تم رفض العرض'}
                </button>
              </div> */}
            </>
          ) : (
            <>
              {serviceRequestDetails?.quotations?.results?.map((quotation) => (
                <Card
                  key={quotation?.id}
                  text={serviceRequestDetails?.description!}
                  item={quotation!}
                  onMoreInfoClick={() => {
                    setSelectedQuotation(quotation);
                  }}
                />
              ))}
            </>
          )}
        </div>
      </ManzilikDrawer>
      <RfqModal
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        title={t(ARE_U_SURE_TO_SUBMIT_QUOTATION)}
        subTitle={t(QUOTATION_LAST_STEP)}
        bodyContent={
          <div className="modal-content">
            <AvatarCard
              imageUrl={selectedQuotation?.professional?.company_logo || icons.user.icon}
              name={selectedQuotation?.professional?.company_name!}
              title={t(PROFESSIONAL)}
              rate={selectedQuotation?.professional?.reviews_total!}
              rateFontSize={'10px'}
              onNameClick={() => {
                window.open(`/professional/${selectedQuotation?.professional?.id}`, '_blank');
              }}
              center
            />
          </div>
        }
        btnOneAction={submitAcceptQuotation}
        btnOneText={t(CONFIRM_QUOTATION)}
        btnTwoAction={() => setIsModalVisible(false)}
        btnTwoText={t(CANCEL)}
      />
      {isViewerOpen && (
        <ImageViewer
          src={myQuotation?.photos?.results?.map((item) => item?.photo as string) || []}
          currentIndex={currentImage}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
          rightArrowComponent={<div className="right-arrow"></div>}
          leftArrowComponent={<div className="left-arrow"></div>}
        />
      )}
    </Row>
  );
};

export default QuotationsRequestContent;
