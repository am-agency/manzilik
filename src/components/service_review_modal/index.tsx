import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Input, Modal, Rate, Row } from 'antd';
import { useHistory } from 'react-router';
import { Review, ServiceInquiry } from '../../API';
import { Record } from '../../pages/profile/edit_profile/requests_works_on/request_details';
import icons from '../../assets/icons';
import {
  ADD_RATE,
  ISSUE_DATE,
  LETTER,
  REVIEW_SERVICE_TEXT,
  SERVICE_PROVIDER,
  SERVICE_TYPE,
  START_RATING,
} from '../../locales/strings';
import { DateFormat } from '../date_format';
import { FormatterProps } from '../../pages/contact_us/components/contact_form';
import { AR } from '../../locales/constants';
import { useMainContext } from '../../app/providers/main';
import { sendServiceInquiryReview } from '../../pages/profile/edit_profile/service_requests/api';

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: Function;
  serviceInquiry?: ServiceInquiry;
}

export const ReviewServiceModal: FunctionComponent<Props> = ({
  isModalVisible,
  setIsModalVisible,
  serviceInquiry,
}: Props) => {
  const history = useHistory();
  const { i18n, t } = useTranslation();
  const [count, setCount] = React.useState(0);
  const [message, setMessage] = React.useState('');
  const counterClassName = i18n.language === AR ? 'msg-textarea-ar' : 'msg-textarea-en';
  const { requestApi } = useMainContext();

  const onToggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const onSubmit = () => {
    requestApi(
      sendServiceInquiryReview,
      {
        resourceId: serviceInquiry?.id!,
        content: message,
        rating: count,
      },
      (response: Review, error: string) => {
        if (error) {
          return;
        }
        setCount(0);
        setMessage('');
        setIsModalVisible(false);
      }
    );
  };

  return (
    <Modal visible={isModalVisible} onCancel={onToggleModal} footer={false} className="service-review-modal-container">
      <div className="body">
        <img src={icons.review} alt="review" />
        <p className="review-title">{t(REVIEW_SERVICE_TEXT)}</p>
        <div className="your-review">
          <Record
            label={t(SERVICE_TYPE)}
            value={serviceInquiry?.services?.results?.map((result) => result?.title).join(', ')}
          />
          <Record label={t(SERVICE_PROVIDER)} value={serviceInquiry?.professional?.company_name!} />
          <Record
            label={t(ISSUE_DATE)}
            value={serviceInquiry?.created_at!}
            format={(value) => {
              return <DateFormat timestamp={value!} />;
            }}
          />
        </div>
        <div className="start-rating">
          <p className="start-rating-title">{t(START_RATING)}</p>
          <div className="rating-stars">
            <Rate
              onChange={(value) => {
                setCount(value);
              }}
              value={count}
            />
          </div>
          <div className="horizontal-line"></div>
        </div>
        <div className="note">
          <Input.TextArea
            minLength={50}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            rows={4}
            className={counterClassName}
            showCount={{
              formatter: ({ count }: FormatterProps) => `${count} ${t(LETTER)}`,
            }}
          />
        </div>
      </div>
      <button className="review-btn" onClick={onSubmit}>
        {t(ADD_RATE)}
      </button>
    </Modal>
  );
};
