import React, { useContext, useState } from 'react';
import CustomTag from '../custom_tag';
import IconWithText from '../icon_with_text';
import icons from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import { profileIcons } from '../../assets/icons/profile';
import {
  ADD_RATE,
  APPLICANT,
  ARE_YOU_SURE_DELETE_ORDER,
  CANCEL_THE_ORDER,
  CONFIRM_CANCEL_ORDER,
  CONTACT_SUPPORT,
  CONTINUE_PAYMENT,
  DELETE,
  NO_NAME,
  NO_REVIEWS,
  REFUND_MESSAGE,
  REQUEST_NUMBER,
  RE_PUBLISH,
  SAR,
  UNDO,
} from '../../locales/strings';
import { ServiceInquiry, ServiceInquiryStatus } from '../../API';
import { useHistory } from 'react-router-dom';
import StartChatButton from '../custom_button';
import MessageIcon from '../../icons/message_icon';
import { Dropdown, Menu } from 'antd';
import RfqModal from '../../pages/requests_for_quotations/components/rfqModal';
import { useServiceRequestActions } from '../../pages/profile/edit_profile/service_requests/hooks/useServiceRequestActions';
import { useClient } from '../../app/hooks/use_client';
import { useIntercom } from 'react-use-intercom';
import { ReviewServiceModal } from '../service_review_modal';
import { SharedStateContext, SharedStateInterface } from '../../context/shared_state_context';

interface ServiceInquiryCardProps {
  serviceInquiry?: ServiceInquiry;
  reloadList?: () => void;
}

const ServiceInquiryCard: React.FC<ServiceInquiryCardProps> = (props) => {
  const { serviceInquiry, reloadList } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showInquiryRate, setShowInquiryRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cancelledServiceRequest } = useServiceRequestActions();
  const { client } = useClient();
  const { setCanceledServiceInquires } = useContext(SharedStateContext) as SharedStateInterface;

  const isDraft = serviceInquiry?.status === ServiceInquiryStatus.DRAFT;
  const isWaitingResponse = serviceInquiry?.status === ServiceInquiryStatus.WAITING_RESPONSE;
  const isOpened = serviceInquiry?.status === ServiceInquiryStatus.OPENED;
  const isCompleted = serviceInquiry?.status === ServiceInquiryStatus.COMPLETED;
  const isContracted = serviceInquiry?.status === ServiceInquiryStatus.CONTRACTED;
  const isCancelled = serviceInquiry?.status === ServiceInquiryStatus.CANCELLED;
  const isClosed = serviceInquiry?.status === ServiceInquiryStatus.CLOSED;
  const isRejected = serviceInquiry?.status === ServiceInquiryStatus.REJECTED;

  const isCancelledOrClosedOrRejected = serviceInquiry?.type === 'RFQ' && (isCancelled || isClosed || isRejected);

  const getIconByStatus = (status: string) => {
    switch (status) {
      case ServiceInquiryStatus.DRAFT:
        return profileIcons.draftIcon;
      case ServiceInquiryStatus.OPENED:
        return profileIcons.openIcon;
      case ServiceInquiryStatus.WAITING_RESPONSE:
        return profileIcons.openIcon;
      case ServiceInquiryStatus.ACCEPTED:
        return profileIcons.inProgress;
      case ServiceInquiryStatus.CONTRACTED:
        return profileIcons.inProgress;
      case ServiceInquiryStatus.CANCELLED:
        return profileIcons.canceledIcon;
      case ServiceInquiryStatus.REJECTED:
        return profileIcons.canceledIcon;
      case ServiceInquiryStatus.CLOSED:
        return profileIcons.canceledIcon;
      case ServiceInquiryStatus.COMPLETED:
        return profileIcons.completedIcon;
    }
  };
  const handlePaymentRedirect = () => {
    history.push('/request-quotation-service');
  };

  const handleCancelledRedirect = () => {
    setCanceledServiceInquires!(serviceInquiry);
    history.push('/request-quotation-service');
  };
  const handleCardRedirect = () => {
    history.push(`/edit-profile/service-requests/${serviceInquiry?.id}`);
  };
  const HandleToggleInquiryRejectionForm = () => {
    setShowInquiryRate(!showInquiryRate);
  };
  const onCancelServiceRequest = async () => {
    setLoading(true);
    try {
      await cancelledServiceRequest(serviceInquiry?.id!, client?.id!, '');
      reloadList!();
      setIsModalVisible(false);
      history.push('/edit-profile/service-requests');
    } catch (error) {}
    setLoading(false);
  };

  const { boot, show } = useIntercom();

  const openIntercom = () => {
    show();
  };
  const menu = (
    <Menu>
      <Menu.Item
        onClick={(e) => {
          e.domEvent.stopPropagation();
          setIsModalVisible(true);
        }}
      >
        <div className="item-wrapper">
          <img src={isDraft ? profileIcons.trash : profileIcons.xClose} alt="delete" />
          <span> {isDraft ? t(DELETE) : t(CANCEL_THE_ORDER)}</span>
        </div>
      </Menu.Item>
      <Menu.Item
        onClick={(e) => {
          e.domEvent.stopPropagation();
          openIntercom();
        }}
      >
        <div className="item-wrapper">
          <img src={profileIcons.support} alt="delete" />
          <span> {t(CONTACT_SUPPORT)}</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="service-component">
      <div className="service-header">
        <div className="service-number" onClick={handleCardRedirect}>{`${t(REQUEST_NUMBER)} ${
          serviceInquiry?.number
        }`}</div>
        {serviceInquiry?.type === 'RFQ' && (isDraft || isOpened || isContracted) ? (
          <Dropdown overlay={menu} trigger={['click']} overlayClassName="service-inquiry-dropdown">
            <a>
              <img src={icons.blackDots} alt="delete" className="delete-dots" />
            </a>
          </Dropdown>
        ) : null}
      </div>
      <div className="service-details" onClick={handleCardRedirect}>
        <IconWithText
          withDot
          icon={profileIcons.markGray}
          text={serviceInquiry?.city?.name!}
          textColor="rgba(70, 71, 116, 0.40)"
        />
        <IconWithText
          withDot
          icon={profileIcons.puzzleGray}
          text={serviceInquiry?.services?.results?.map((service) => service?.title!).join(',') || ''}
          textColor="rgba(70, 71, 116, 0.40)"
        />
        <IconWithText
          withDot
          icon={profileIcons.star}
          text={serviceInquiry?.reviews_total! > 0 ? serviceInquiry?.reviews_total!.toString()! : ''}
          textColor="rgba(70, 71, 116, 0.40)"
        />
        {/* {!isCompleted && (
          <IconWithText withDot icon={profileIcons.noRate} text={t(NO_REVIEWS)} textColor="rgba(70, 71, 116, 0.40)" />
        )} */}
      </div>
      <div className="tags-and-action">
        <div className="tags">
          <CustomTag>
            <img src={getIconByStatus(serviceInquiry?.status!)} alt="rfq" />
            {t(`${serviceInquiry?.status}_REQUEST`)}
          </CustomTag>
          <CustomTag>
            <img src={profileIcons.blackCoins} alt="rfq" />
            {`${serviceInquiry?.budget_limits} ${t(SAR)}`}
          </CustomTag>
          {isOpened && (
            <CustomTag>
              <img src={profileIcons.quotations} alt="rfq" />
              {`${serviceInquiry?.quotations_count!} ${t(APPLICANT)}`}
            </CustomTag>
          )}
          {isContracted && (
            <CustomTag>
              <img
                src={serviceInquiry?.quotations?.results?.[0]?.professional?.company_logo || profileIcons.avatar}
                alt="rfq"
              />
              {serviceInquiry?.quotations?.results?.[0]?.professional?.company_name || t(NO_NAME)}
            </CustomTag>
          )}
          {serviceInquiry?.type !== 'RFQ' && (
            <CustomTag>
              <img src={serviceInquiry?.professional?.company_logo! || profileIcons.avatar} alt="rfq" />
              {`${serviceInquiry?.professional?.client?.first_name} ${serviceInquiry?.professional?.client?.last_name} ` ||
                t(NO_NAME)}
            </CustomTag>
          )}
        </div>
        {isDraft && (
          <button onClick={handlePaymentRedirect} className="action-button">
            <img src={icons.prof_arrow_white} alt="arrow" />
            {t(CONTINUE_PAYMENT)}
          </button>
        )}
        {isCancelledOrClosedOrRejected && (
          <button onClick={handleCancelledRedirect} className="action-button">
            <img src={icons.prof_arrow_white} alt="arrow" />
            {t(RE_PUBLISH)}
          </button>
        )}
        {isWaitingResponse && (
          <StartChatButton
            btnColor="rgba(255, 59, 48, 0.14)"
            isViewOnly
            quotationId={serviceInquiry?.id!}
            applyUnreadLogic
            icon={<MessageIcon color="#464774" />}
          />
        )}
        {isCompleted && serviceInquiry?.reviews_total === 0 && (
          <button onClick={HandleToggleInquiryRejectionForm} className="no-rate-btn">
            {t(ADD_RATE)}
          </button>
        )}
      </div>
      <RfqModal
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        title={t(ARE_YOU_SURE_DELETE_ORDER)}
        subTitle={t(REFUND_MESSAGE)}
        btnOneAction={onCancelServiceRequest}
        btnOneText={t(CONFIRM_CANCEL_ORDER)}
        btnTwoAction={() => setIsModalVisible(false)}
        btnTwoText={t(UNDO)}
        btnOneLoading={loading}
        width={400}
        cancelMode
      />

      <ReviewServiceModal
        isModalVisible={showInquiryRate}
        setIsModalVisible={setShowInquiryRate}
        serviceInquiry={serviceInquiry!}
      />
    </div>
  );
};

export default ServiceInquiryCard;
