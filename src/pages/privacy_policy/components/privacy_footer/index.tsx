import React from 'react';
import { Col, Row, Typography } from 'antd';
import i18n from '../../../../app/i18n';
import { getLayoutDirection } from '../../../../app/layouts';
import icons from '../../../../assets/icons';
import Separator from '../../../../components/separator';
import bubbles from '../../../../assets/backgrounds/bubbles.png';

interface Props {
  concat_title: string;
  contact_description: string;
  email: string;
  address: string;
  phone: string;
}
export const PrivacyFooter = (footer: Props) => {
  const { concat_title, contact_description, email, address, phone } = footer;
  return (
    <>
      <Separator vertical={25} />
      <Row className="privacy-footer">
        <Col xl={8} lg={8} md={0} sm={0} xs={0} className="img-wrapper">
          <img src={bubbles} className={getLayoutDirection(i18n.language)} />
        </Col>
        <Col xl={16} lg={16} md={16} sm={24} xs={24} className="content-wrapper">
          <Typography.Text className="sub_list_title"> {concat_title} </Typography.Text>
          <br />
          <Typography.Text> {contact_description} </Typography.Text>
          <Separator vertical={6} />
          <Row className="contact-info" align="middle">
            <Col xl={6} lg={6} md={12} sm={24} xs={24} className="wrapper">
              <img src={icons.letter.icon} />
              &nbsp;&nbsp;
              <Typography.Text>{email}</Typography.Text>
            </Col>
            <Col xl={6} lg={6} md={12} sm={24} xs={24} className="wrapper">
              <img src={icons.phone.icon} />
              &nbsp;&nbsp;
              <Typography.Text className="phone">{phone}</Typography.Text>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24} className="wrapper">
              <img src={icons.address.icon} />
              &nbsp;&nbsp;
              <Typography.Text> {address} </Typography.Text>
            </Col>
          </Row>
        </Col>
      </Row>
      <Separator vertical={35} />
    </>
  );
};
