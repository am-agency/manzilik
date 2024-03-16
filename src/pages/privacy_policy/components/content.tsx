import React, { useState, useEffect, FunctionComponent } from 'react';
import { useHistory } from 'react-router';
import { Col, Row, Typography } from 'antd';
import { Container } from '../../../components/container';
import Separator from '../../../components/separator';
import { PrivacyPolicy } from '../types';
import { PrivacyFooter } from './privacy_footer';
import { scrollToSection } from '../../../utils';
import { COOKIE_POLICY_SECTION } from '../../../locales/constants';

interface Props {
  privacyContent: PrivacyPolicy;
}

export const PrivacyPolicyContent: FunctionComponent<Props> = ({ privacyContent }: Props) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const history = useHistory();

  const scrollToCookiePolicySection = () => {
    scrollToSection(COOKIE_POLICY_SECTION);
  };

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    if (history?.location?.hash) {
      isMounted &&
        requestAnimationFrame(() => {
          scrollToCookiePolicySection();
        });
    }
  }, [isMounted, history?.location]);

  return (
    <div className="privacy-policy">
      <Container>
        <Separator vertical={18} />
        <Typography.Text className="title"> {privacyContent?.title} </Typography.Text>
        <Separator vertical={6} />
        <Typography.Text className="sub-title"> {privacyContent?.sub_title} </Typography.Text>
        <br />
        <Typography.Text className="description"> {privacyContent?.description} </Typography.Text>
        <Separator vertical={18} />
        <Typography.Text className="list-title"> {privacyContent?.hint_question} </Typography.Text>
        <br />
        <Typography.Text className="sub_list_title">{privacyContent?.list_title} </Typography.Text>
        <Separator vertical={13} />
        <ul itemType="list-style-type:circle" className="first-list">
          {privacyContent?.list?.map((elm) => {
            return (
              <li key={elm} className="list-item">
                {elm}
              </li>
            );
          })}
        </ul>
        &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Typography.Text className="sub_list_title"> {privacyContent?.sub_list_title} </Typography.Text>
        <br />
        <ul itemType="list-style-type:circle">
          {privacyContent?.sub_list?.map((elm) => {
            return (
              <li className="list-item" key={elm}>
                {elm}
              </li>
            );
          })}
        </ul>
        <Separator vertical={14} />
        <Typography.Text className="paragraph-title">{privacyContent?.security_title}</Typography.Text>
        <br />
        <Typography.Text className="description"> {privacyContent?.security_description} </Typography.Text>
        <Separator vertical={18} />
        <div id={COOKIE_POLICY_SECTION}>
          <Typography.Text className="paragraph-title">{privacyContent?.how_to_use_title}</Typography.Text>
          <br />
          <Typography.Text className="description"> {privacyContent?.how_to_use_description} </Typography.Text>
          <Separator vertical={8} />
          <Typography.Text className="paragraph-title"> {privacyContent?.links_title} </Typography.Text>
        </div>
        <Separator vertical={6} />
        <Typography.Text className="description"> {privacyContent?.links_description} </Typography.Text>
        <Separator vertical={14} />
        <Typography.Text className="paragraph-title"> {privacyContent?.personal_info_title} </Typography.Text>
        <Separator vertical={6} />
        &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Typography.Text className="sub_list_title"> {privacyContent?.personal_info_sub_title}: </Typography.Text>
        <br />
        <ul itemType="list-style-type:circle">
          {privacyContent?.personal_info_list?.map((elm) => {
            return (
              <li className="list-item" key={elm}>
                {elm}
              </li>
            );
          })}
        </ul>
        <Separator vertical={14} />
        <Typography.Text className="description"> {privacyContent?.personal_info_description} </Typography.Text>
        <Separator vertical={18} />
        <Typography.Text> {privacyContent?.personal_info_sub_description} </Typography.Text>
        {privacyContent && (
          <PrivacyFooter
            concat_title={privacyContent.concat_title}
            contact_description={privacyContent.contact_description}
            email={privacyContent.email}
            phone={privacyContent.phone}
            address={privacyContent.address}
          />
        )}
      </Container>
    </div>
  );
};
