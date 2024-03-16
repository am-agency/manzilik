import React, { useState } from 'react';
import AvatarCard from '../../../../../../components/avatar_card';
import ImageViewer from 'react-simple-image-viewer';
import {
  ACCEPTED_OFFER,
  DAYS,
  DURATION,
  IMAGES,
  MORE_INFO,
  OFFER_ACCEPTED,
  ORDER_ACCEPTED,
  PROFESSIONAL,
  SAR,
} from '../../../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import StartChatButton from '../../../../../../components/custom_button';
import MessageIcon from '../../../../../../icons/message_icon';
import { profileIcons } from '../../../../../../assets/icons/profile';
import { Quotation, QuotationStatus, ServiceInquiryStatus } from '../../../../../../API';
import icons from '../../../../../../assets/icons';
import moment from 'moment';

interface CardProps {
  text: string;
  item: Quotation;
  onMoreInfoClick?: () => void;
  onAcceptClick?: () => void;
  isDetailsCard?: boolean;
  rfqStatus?: string;
}

const QuotationCard: React.FC<CardProps> = ({
  text,
  item,
  onMoreInfoClick,
  onAcceptClick,
  isDetailsCard = false,
  rfqStatus,
}) => {
  const { t } = useTranslation();
  const isAccepted = item?.status === QuotationStatus.ACCEPTED;
  const isRfqCancelled = rfqStatus === ServiceInquiryStatus.CANCELLED;
  const fullWidthBtnClass = isAccepted ? 'full-width' : '';
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <>
      <div className="quotation_card">
        <div className="card-header">
          <AvatarCard
            imageUrl={item?.professional?.company_logo || icons.user.icon}
            name={item?.professional?.company_name!}
            title={t(PROFESSIONAL)}
            rate={item?.professional?.reviews_total!}
            rateFontSize={'10px'}
            onNameClick={() => {
              window.open(`/professional/${item?.professional?.id}`, '_blank');
            }}
          />
          {/* <StartChatButton quotationId={item?.id!} isCircular icon={<MessageIcon color="#464774" />} /> */}
        </div>
        <div className="horizontal-line"></div>
        <div className="bids-details">
          <div className="price-bids">
            <img src={profileIcons.coins} alt="tag" />
            <p>
              {item?.budget_limits} <span> {t(SAR)} </span>
            </p>
          </div>
          <div className="time-bids">
            {/* <div className="vertical-line"></div> */}
            <img src={profileIcons.time} alt="time" />
            <span>{moment(item?.created_at).format('hh:mm A')}</span>
          </div>
          <div className="calender-bids">
            {/* <div className="vertical-line"></div> */}
            <img src={profileIcons.calenderCheck} alt="calendar" />
            <div>
              <span>{t(DURATION)}</span>
              <span>|</span>
              <span>{item?.execution_time}</span>
              <span>{t(item?.time_unit!)}</span>
            </div>
          </div>
        </div>
        <div className="horizontal-line"></div>
        <div className="card-body">{item?.description!}</div>
        {isDetailsCard ? (
          <div className="images">
            <p>{t(IMAGES)}</p>
            {item?.photos?.results?.map((image, index) => (
              <img
                key={image?.photo}
                src={image?.photo!}
                alt="image"
                onClick={() => {
                  setCurrentImage(index);
                  setIsViewerOpen(true);
                }}
              />
            ))}
          </div>
        ) : null}

        {/* {item?.status === QuotationStatus.ACCEPTED ? (
        <div className="card-status">
          <img src={profileIcons.check} alt="check" />
          <span>{t(ORDER_ACCEPTED)}</span>
        </div>
      ) : null} */}
        {isRfqCancelled ? null : (
          <div className="card-footer">
            {/* <div className="more-info-bids" onClick={onMoreInfoClick}>
        {t(MORE_INFO)}
      </div> */}

            <div className={`messages-btn ${fullWidthBtnClass}`}>
              <StartChatButton quotationId={item?.id!} icon={<MessageIcon color="#464774" />} isViewOnly />
            </div>
            {isAccepted ? null : (
              <button className="accept-btn" onClick={isDetailsCard ? onAcceptClick : onMoreInfoClick}>
                {t(OFFER_ACCEPTED)}
              </button>
            )}
          </div>
        )}
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={item?.photos?.results?.map((item) => item.photo as string) || []}
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
};

export default QuotationCard;
