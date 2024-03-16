import React, { useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import { ServiceInquiry, ServiceInquiryStatus } from '../../../../../../API';
import { useTranslation } from 'react-i18next';
import {
  ARE_YOU_SURE_DELETE_COMMENT_MSG,
  ARE_YOU_SURE_DELETE_ORDER,
  CANCEL_THE_ORDER,
  CATEGORY,
  CONFIRM_CANCEL_ORDER,
  DELETE_DESIGN,
  IMAGES,
  NOW_CAN_COMPLETE_CONTRACT,
  ORDER_ACCEPTED,
  ORDER_CANCELED,
  ORDER_DETAILS,
  READ_MORE,
  REFUND_MESSAGE,
  SERVICE_TYPE,
  UNDO,
} from '../../../../../../locales/strings';
import ReadMoreText from '../../../../../../components/read_more_text';
import { profileIcons } from '../../../../../../assets/icons/profile';
import TextWithIcon from '../../../../../../components/text_with_icon';
import { Elapsed } from '../../../../../../components/headers/notifications/elapsed';
import CustomTag from '../../../../../../components/custom_tag';
import { Col, Dropdown, Menu } from 'antd';
import icons from '../../../../../../assets/icons';
import RfqModal from '../../../../../requests_for_quotations/components/rfqModal';
import { useServiceRequestActions } from '../../../requests_works_on/hooks/useServiceRequestActions';
import { useClient } from '../../../../../../app/hooks/use_client';
import { useHistory } from 'react-router-dom';

interface OrderDetailsProps {
  order?: ServiceInquiry;
}

const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
  const { order } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const isContracted = order?.status === ServiceInquiryStatus.CONTRACTED;
  const isCancelled = order?.status === ServiceInquiryStatus.CANCELLED;
  const { cancelledServiceRequest } = useServiceRequestActions();
  const { client } = useClient();
  const history = useHistory();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setCurrentImage(0);
  };

  // cancel dropdown
  const menu = (
    <Menu>
      <Menu.Item
        onClick={(e) => {
          e.domEvent.stopPropagation();
          setIsModalVisible(true);
        }}
      >
        {t(CANCEL_THE_ORDER)}
      </Menu.Item>
    </Menu>
  );
  const onCancelServiceRequest = async () => {
    setLoading(true);
    try {
      await cancelledServiceRequest(order?.id!, client?.id!, '');
      setIsModalVisible(false);
      history.push('/edit-profile/service-requests');
    } catch (error) {}
    setLoading(false);
  };

  return (
    <>
      <div className="order-container">
        <div className="order-header">
          <p className="order-title">{`${t(ORDER_DETAILS)} ${order?.number}#`}</p>
          {!isCancelled ? (
            <Dropdown overlay={menu} trigger={['click']} overlayClassName="ant-custom-menu">
              <a>
                <img src={icons.blackDots} alt="delete" className="delete-dots" />
              </a>
            </Dropdown>
          ) : null}
        </div>
        {isContracted ? (
          <div className="card-status">
            <img src={profileIcons.check} alt="check" />
            <span>{t(NOW_CAN_COMPLETE_CONTRACT)}</span>
          </div>
        ) : null}
        {isCancelled ? (
          <div className="card-status cancel-mode">
            <img src={profileIcons.xClose} alt="check" />
            <span>{t(ORDER_CANCELED)}</span>
          </div>
        ) : null}
        <div className="order-details">
          <div className="order-details-row">
            {order?.description?.length! > 0 && (
              <div className="order-desc">
                <ReadMoreText text={order?.description!} actionText={t(READ_MORE)} />{' '}
              </div>
            )}

            <div className="order-price">
              <TextWithIcon icon={profileIcons.blackCoins} text={order?.budget_limits!} />
            </div>
            <div className="order-info">
              <TextWithIcon icon={profileIcons.time} text={<Elapsed dateString={order?.created_at!} />} />
              <TextWithIcon icon={profileIcons.pin2} text={order?.city?.name! || ''} />
            </div>
          </div>
          {order?.services?.results?.length! > 0 ? (
            <div className="order-details-row">
              <p className="order-details-label">{t(SERVICE_TYPE)}</p>
              <div className="tags-container">
                {order?.services?.results?.map((service) => (
                  <CustomTag key={service?.title}>{service?.title}</CustomTag>
                ))}
              </div>
            </div>
          ) : null}

          {order?.categories?.results?.length! > 0 ? (
            <div className="order-details-row">
              <p className="order-details-label">{t(CATEGORY)}</p>
              <div className="tags-container">
                {order?.categories?.results?.map((category) => (
                  <CustomTag key={category?.title}>{category?.title}</CustomTag>
                ))}
              </div>
            </div>
          ) : null}
          {order?.photos?.results?.length! > 0 ? (
            <Col>
              <div className="order-details-row">
                <p className="order-details-label">{t(IMAGES)}</p>
                <div className="images-wrapper">
                  <div className="images-container">
                    {order?.photos?.results?.map((item, index) => (
                      <img
                        key={item?.photo}
                        onClick={() => {
                          setCurrentImage(index);
                          setIsViewerOpen(true);
                        }}
                        className="image"
                        src={item?.photo!}
                        alt="image"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          ) : null}
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
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={order?.photos?.results?.map((item) => item?.photo as string) || []}
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

export default OrderDetails;
