import React, { FunctionComponent, useEffect, useState } from 'react';
import { Col, Row, Typography, Tooltip, Avatar, Button, List } from 'antd';
import ReadMoreText from '../../../../components/read_more_text';
import { AWARDS, BADGES, GENERAL_IDEA_ABOUT_ME, READ_MORE, WON } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import Separator from '../../../../components/separator';
import { AR } from '../../../../locales/constants';
import { isArrayEmpty } from '../../../../utils';
import { Client } from '../../../../API';
import { ClientBadgesAndRewords } from '../../../clients_landing_page/components/client-padges-and-rewords';

export interface Props {
  clientData?: Client;
}

export const AboutMe: FunctionComponent<Props> = ({ clientData }: Props) => {
  const { t, i18n } = useTranslation();

  const [client, setClient] = useState<Client>(clientData!);
  const selectedClient = JSON.parse(localStorage.getItem('selectedClient')!);

  useEffect(() => {
    if (selectedClient) {
      setClient(selectedClient);
    } else {
      setClient(clientData!);
    }
  }, [clientData, selectedClient!]);
  const isArabic = i18n.language === AR;

  const awardContainerClassName = isArabic ? 'award-container-ar' : 'award-container-en';
  const isThereAreAwards = !isArrayEmpty(clientData?.client_awards);
  const isThereAreBadges = !isArrayEmpty(clientData?.client_badges);
  const gradientColor = '#f9f9f9';

  return (
    <Row align="middle" className="about-me">
      {(isThereAreAwards || isThereAreBadges) && (
        <Col span={24}>
          <Row className="awards">
            {isThereAreAwards && (
              <Col className={awardContainerClassName}>
                <Row align="middle" gutter={[21, 21]}>
                  <Col className="text">
                    <Typography.Title level={4}>{t(AWARDS)}</Typography.Title>
                    <Typography.Text>{t(WON)}</Typography.Text>
                  </Col>
                  {client?.client_awards?.map((elm, index) => {
                    return (
                      <Col key={index} className="img-container">
                        <Tooltip title={elm?.title}>
                          <img src={elm?.image!} alt={elm?.title!} />
                        </Tooltip>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            )}
            {isThereAreBadges && (
              <Col>
                <Row align="top" gutter={[21, 21]}>
                  <Col className="text">
                    <Typography.Title level={4}>{t(BADGES)}</Typography.Title>
                    <Typography.Text>{t(WON)}</Typography.Text>
                  </Col>
                  <Col>
                    <Row align="top" gutter={[8, 8]}>
                      <ClientBadgesAndRewords client={client} withOutLabel />
                    </Row>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Col>
      )}
      {client?.about_me && (
        <Col span={24}>
          <div className="about-me-brief">
            <Separator vertical={13} />
            <Typography.Text className="title">{t(GENERAL_IDEA_ABOUT_ME)}</Typography.Text>
            <ReadMoreText
              text={client?.about_me!}
              actionText={t(READ_MORE)}
              maxLength={300}
              gradientColor={gradientColor}
            />
          </div>
        </Col>
      )}
    </Row>
  );
};
