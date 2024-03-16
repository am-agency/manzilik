import { FunctionComponent, useContext } from 'react';
import React from 'react';
import {
  HEADING_HOME_CLIENT1,
  HEADING_HOME_CLIENT2,
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_HEADING,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { SearchAutoComplete } from '../../../ideas/auto_complete';
import { Col, Row } from 'antd';
import Separator from '../../../../components/separator';
import { SharedStateContext, SharedStateInterface } from '../../../../context/shared_state_context';

const SignupWelcome: FunctionComponent = () => {
  const { t } = useTranslation();
  const { isProfessional } = useContext(SharedStateContext) as SharedStateInterface;

  return (
    <>
      <h2 className="heading-text centered">{t(HEADING_HOME_CLIENT1)}</h2>
      <h6 className="heading-text centered heading-description">{t(HEADING_HOME_CLIENT2)}</h6>
      <Separator vertical={14} />
      <Row justify="center">
        <Col xl={13} lg={14} md={20} sm={24} xs={24}>
          <SearchAutoComplete searchSpan={17} btnSpan={7} />
        </Col>
      </Row>
    </>
  );
};

export default SignupWelcome;
