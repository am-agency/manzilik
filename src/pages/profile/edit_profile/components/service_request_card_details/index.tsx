import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HOMEOWNER,
  ISSUE_DATE,
  MORE_INFO,
  PHONE_NUMBER,
  REQUEST_NUMBER,
  REQUEST_STATUS,
  SERVICE_PRICE,
  SERVICE_TYPE,
} from '../../../../../locales/strings';
import { Col, Row, Typography } from 'antd';
import { DateFormat } from '../../../../../components/date_format';
import { AR } from '../../../../../locales/constants';
import MessageIcon from '../../../../../icons/message_icon';
import StartChatButton from '../../../../../components/custom_button';
import { useHistory } from 'react-router-dom';
import { useFeatures } from 'flagged';
import { SERVICE_CHAT } from '../../../../../app/settings';
import { ServiceInquiry } from '../../../../../API';

interface RecordProps {
  label: string;
  value?: string;
  vertical?: boolean;
  format?: (value: RecordProps['value']) => ReactElement;
}

interface ServiceRequestCardDetailsProps {
  item: ServiceInquiry;
  isRequestsWorksOn?: boolean;
}

const ServiceRequestCardDetails = (props: ServiceRequestCardDetailsProps) => {
  const { item, isRequestsWorksOn = false } = props;
  const { t, i18n } = useTranslation();
  const listOfServices = item?.services?.results?.map((service) => service?.title!).join(', ');
  const history = useHistory();
  const features = useFeatures();

  const Record = ({ label, value, vertical, format }: RecordProps) =>
    value ? (
      <Row className={`record ${vertical ? 'vertical' : ''}`}>
        <Col span={12}>
          <Typography.Text strong>{label}</Typography.Text>
        </Col>
        <Col span={12}>{format ? format(value) : value}</Col>
      </Row>
    ) : null;
  const handleItemRedirection = () => {
    history.push(`/edit-profile/${isRequestsWorksOn ? 'requests-works-on' : 'service-requests'}/${item.id}`);
  };
  return (
    <div>
      <div className="order-details-table" onClick={handleItemRedirection}>
        <div className="order-num-and-status">
          <div className="order-num">
            <p className="order-num-title">{t(REQUEST_NUMBER)} </p>
            <p className="number"> {item?.number} </p>
          </div>
          <div className="middle-line"></div>
          <div className="order-status">
            <p className="order-status-title">{t(REQUEST_STATUS)}</p>
            <p>
              <span className={item?.status!.toLocaleLowerCase()}>
                {t((item?.status as unknown as string) + '_REQUEST')}
              </span>
            </p>
          </div>
        </div>
        <div className="other-details">
          <Record label={t(SERVICE_TYPE)} value={listOfServices} />

          {item?.gig_service_price ? (
            <Record label={t(SERVICE_PRICE)} value={JSON.stringify(item?.gig_service_price!)} />
          ) : null}
          <Record label={t(HOMEOWNER)} value={item?.sender?.first_name!} />
          {item?.phone_number && (
            <Record
              label={t(PHONE_NUMBER)}
              value={` ${i18n.language !== AR ? '+' : ''} ${item?.phone_number} ${i18n.language === AR ? '+' : ''}`}
            />
          )}

          <Record
            label={t(ISSUE_DATE)}
            value={item?.created_at!}
            format={(value) => {
              return <DateFormat timestamp={value!} />;
            }}
          />
          <div className="btns-wrapper">
            {features[SERVICE_CHAT] && <StartChatButton icon={<MessageIcon color="#464774" />} item={item} />}

            <button className="more-details" onClick={handleItemRedirection}>
              {t(MORE_INFO)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestCardDetails;
