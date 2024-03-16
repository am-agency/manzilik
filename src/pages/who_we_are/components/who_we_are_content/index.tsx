import React, { FunctionComponent, useEffect } from 'react';
import { Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { WHO_WE_ARE } from '../../../../locales/strings';
import Separator from '../../../../components/separator';
import { aboutIcons } from '../../../../assets/icons/about';
import i18n from '../../../../app/i18n';
import { AR } from '../../../../locales/constants';
import { AboutUs } from './types';

interface Props {
  aboutContent: AboutUs;
}

export const WhoWeAreContent: FunctionComponent<Props> = ({ aboutContent }: Props) => {
  const { t } = useTranslation();
  const imageArClassNAme = i18n.language === AR ? 'img-position-ar' : 'img-position-en';

  return (
    <div className="who-we-are-content">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h3>{t(WHO_WE_ARE)}</h3>
          <Typography.Text>{aboutContent?.sub_title}</Typography.Text>
        </Col>
        <Col span={24}>
          <Typography.Text>{aboutContent?.description}</Typography.Text>
          <br /> <br />
        </Col>
        <Col span={24} className="description-wrapper">
          <Separator vertical={88} />
          <img src={aboutIcons.about.icon} alt="about icon" className={imageArClassNAme} />
          <div className="description">
            <Typography.Text>{aboutContent?.img_description}</Typography.Text>
          </div>
          <Separator vertical={10} />
        </Col>
      </Row>
    </div>
  );
};
