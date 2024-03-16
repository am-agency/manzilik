import { Col, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  SIGN_IN_POLICY,
  COMMON_QUESTIONS,
  COMMON_QUESTION_1,
  COMMON_QUESTION_2,
  COMMON_QUESTION_3,
  COMMON_QUESTION_4,
  COMMON_QUESTION_5,
  COMMON_QUESTION_6,
} from '../../../../locales/strings';

export const CommonQuestions = () => {
  const { t } = useTranslation();

  return (
    <Row>
      <Col xl={{ span: 9, offset: 2 }} lg={{ span: 9, offset: 2 }} md={8} sm={24} xs={24}>
        <div className="common-questions">
          <span className="login-terms">{t(SIGN_IN_POLICY)}</span>
          <h3>{t(COMMON_QUESTIONS)}</h3>
          <h5 className="first-elm">{t(COMMON_QUESTION_1)}</h5>
          <h5>{t(COMMON_QUESTION_2)}</h5>
          <h5>{t(COMMON_QUESTION_3)}</h5>
          <h5>{t(COMMON_QUESTION_4)}</h5>
          <h5>{t(COMMON_QUESTION_5)}</h5>
          <h5>{t(COMMON_QUESTION_6)}</h5>
        </div>
      </Col>
    </Row>
  );
};
