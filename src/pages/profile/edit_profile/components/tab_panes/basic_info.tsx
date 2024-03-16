import React, { useContext } from 'react';
import { Button, Col, Form, Row, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../../app/i18n';
import { getLayoutDirection } from '../../../../../app/layouts';
import { useMainContext } from '../../../../../app/providers/main';
import { UserRole } from '../../../../../app/types';
import { AccountInfo } from './../../account_info';
import { SuccessMessage } from './../../components/success_message';
import pic from '../../../../../assets/backgrounds/profile.png';
import { Client } from '../../../../../API';
import { CompleteProfile } from '../../../../professionals/complete_profile';
import { ACCOUNT_INFORMATION, PERSONAL_INFORMATION } from '../../../../../locales/strings';
import { PrivateProfileHeader } from '../profile_header';
import { SharedStateContext, SharedStateInterface } from '../../../../../context/shared_state_context';

interface Props {
  client: Client;
  onUpdateClientInformation: Function;
  successMessage: boolean;
}

export const BasicInfo = ({ client, onUpdateClientInformation, successMessage }: Props) => {
  const { userState } = useMainContext();
  const { t } = useTranslation();
  const { isProfessional } = useContext(SharedStateContext) as SharedStateInterface;

  return (
    <>
      {!successMessage ? (
        <>
          <PrivateProfileHeader title={t(ACCOUNT_INFORMATION)} />
          {isProfessional ? (
            <Row className="complete-profile" gutter={18}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <section className="steps-content photos-vidoes-container">
                  <CompleteProfile fromEditProfessionalProfile editProfileStep={1} />
                </section>
              </Col>
            </Row>
          ) : (
            <AccountInfo onUpdateClientInformation={onUpdateClientInformation} client={client!} />
          )}
        </>
      ) : (
        <SuccessMessage />
      )}
    </>
  );
};
