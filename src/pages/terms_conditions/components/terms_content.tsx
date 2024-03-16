import { Typography } from 'antd';
import React, { FunctionComponent } from 'react';
import { Container } from '../../../components/container';
import Separator from '../../../components/separator';
import { PrivacyFooter } from '../../privacy_policy/components/privacy_footer';
import { TermsAndConditions } from '../types';

interface Props {
  termsContent: TermsAndConditions;
}
export const TermsAndConditionsContent: FunctionComponent<Props> = ({ termsContent }: Props) => {
  return (
    <div className="terms-and-conditions">
      <Container>
        <Separator vertical={18} />
        <Typography.Text className="title"> {termsContent?.title} </Typography.Text>
        <Separator vertical={6} />

        <Typography.Text className="description"> {termsContent?.description} </Typography.Text>

        <br />
        <Typography.Text className="sub_list_title"> {termsContent?.sub_description} </Typography.Text>
        <Separator vertical={18} />

        <Typography.Text className="list-title"> {termsContent?.list_title} </Typography.Text>
        <Separator vertical={13} />
        {termsContent?.list?.map((elm) => {
          return (
            <ul itemType="list-style-type:circle" key={elm}>
              <li className="list-item">{elm}</li>
            </ul>
          );
        })}
        <PrivacyFooter
          concat_title={termsContent.concat_title}
          contact_description={termsContent.contact_description}
          email={termsContent.email}
          phone={termsContent.phone}
          address={termsContent.address}
        />
      </Container>
    </div>
  );
};
