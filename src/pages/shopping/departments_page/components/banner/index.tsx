import React from 'react';
import { Button, Col, Row } from 'antd';
import { Banner } from '../../../../../API';
import { useHistory } from 'react-router';
import { PRODUCTS_MAIN_ROUTE } from '../../../../../utils/routes';

interface Props {
  banner: Banner;
}

export const BannerSection = ({ banner }: Props) => {
  const history = useHistory();

  const onBannerRedirect = () => {
    history.push(`${PRODUCTS_MAIN_ROUTE}/${banner?.slug}`);
  };

  return (
    <Row className="banner" align="middle">
      <Col lg={12} xl={12} md={12} sm={24} xs={24} className="img-wrapper">
        <img className="img-fit-content" src={banner.photo_url!} />
      </Col>
      <Col lg={12} xl={12} md={12} sm={24} xs={24} className="content">
        <h2>
          {banner.title}
          <br />
          <b> {banner.sub_title}</b>
        </h2>
        <Button className="custom-antd-btn" onClick={onBannerRedirect}>
          {banner.button_title}
        </Button>
      </Col>
    </Row>
  );
};
