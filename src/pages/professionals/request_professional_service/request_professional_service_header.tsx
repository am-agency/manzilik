import React from 'react';
import { Row, Typography, Avatar, Col, Space } from 'antd';
import { COMPANY, PROFESSIONAL, SEND_SERVICE_REQUEST } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { Professional, ProfessionalType } from '../../../API';
import { Review } from '../components/review';
import icons from '../../../assets/icons';

interface Props {
  professional?: Professional;
}

export const RequestProfessionalServiceHeader = ({ professional }: Props) => {
  const { t } = useTranslation();
  return professional ? (
    <Row className="request-service-header">
      <Typography.Title className="title">{t(SEND_SERVICE_REQUEST)}</Typography.Title>

      <Row justify="space-between">
        <Avatar
          className="avatar"
          src={
            professional.professional_type === ProfessionalType.COMPANY
              ? professional.company_logo
              : professional.client?.profile_image
          }
        ></Avatar>
        <Col>
          <Space direction="horizontal">
            <span>
              {professional.client?.first_name} {professional.client?.last_name}
            </span>
            {professional.is_verified && <img className="prof-badge" src={icons.verified} alt="verified" />}
          </Space>
          <Row>
            <Typography.Text className="subtitle">
              {professional.professional_type === ProfessionalType.PERSONAL ? t(PROFESSIONAL) : t(COMPANY)}
            </Typography.Text>
            <Typography.Text strong className="subtitle">
              {professional.reviews_total}
            </Typography.Text>
            {professional.reviews_count && professional.reviews_total ? (
              <section className="rating">
                <Review
                  showNumbers={false}
                  reviews_count={professional.reviews_count}
                  reviews_total={professional.reviews_total}
                />
              </section>
            ) : null}
          </Row>
        </Col>
      </Row>
    </Row>
  ) : null;
};
