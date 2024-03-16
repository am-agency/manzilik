import React, { FunctionComponent } from 'react';
import { Button, Col, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { ASK_QUESTION, QUESTION_ABOUT_THIS_PHOTO } from '../../../locales/strings';

interface Props {
  totalQuestions: number;
  onAddQuestionClick: () => void;
}

export const QuestionHead: FunctionComponent<Props> = ({ onAddQuestionClick, totalQuestions }: Props) => {
  const { t } = useTranslation();
  return (
    <Row justify="space-between" align="middle" className="head-wrapper">
      <Col xl={16} lg={16} md={12} sm={16} xs={16}>
        <Typography.Text className="title">
          {t(QUESTION_ABOUT_THIS_PHOTO)}
          <span className="questions-number">{totalQuestions || 0}</span>
        </Typography.Text>
      </Col>
      <Col xl={6} lg={6} md={12} sm={8} xs={8}>
        <Button className="ask-btn" onClick={onAddQuestionClick}>
          {t(ASK_QUESTION)}
        </Button>
      </Col>
    </Row>
  );
};
