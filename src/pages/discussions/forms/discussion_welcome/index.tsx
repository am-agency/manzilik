import React, { FunctionComponent } from 'react';
import { Button, Form, Row, Typography } from 'antd';

import { setFirstOpenDiscussionPage } from '../../../../utils';

import {
  WELCOME_TO_MANZILIK_ADVICE,
  SEE_DISCUSSION_FROM_DESIGNERS_AND_EXPERT,
  GET_STARTED,
  WHAT_ARE_YOUR_INTERESTS,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../../app/providers/modal';
import { ModalTitle } from '../../../../components/modal_title';
import { DiscussionTopics } from '../discussion_topics';
import { TRUE } from '../../../../app/settings';

interface Props {
  onUpdateTagsValue: Function;
}

export const DiscussionWelcome: FunctionComponent<Props> = ({ onUpdateTagsValue }: Props) => {
  const { t } = useTranslation();
  const { showModal, form, setModalVisible } = useModal();

  const onFinish = () => {
    setFirstOpenDiscussionPage(TRUE);
    setModalVisible!(false);
    showModal(
      <ModalTitle title={t(WHAT_ARE_YOUR_INTERESTS)} />,
      <DiscussionTopics onUpdateTagsValue={onUpdateTagsValue} />,
      'modal-wrapper discussion-topics-modal',
      '',
      <div />
    );
  };

  return (
    <Row justify="center">
      <Form onFinish={onFinish} form={form}>
        <Typography.Text className="welcome-title">{t(WELCOME_TO_MANZILIK_ADVICE)}</Typography.Text>
        <p className="welcome-description">
          <Typography.Text>{t(SEE_DISCUSSION_FROM_DESIGNERS_AND_EXPERT)}</Typography.Text>
        </p>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t(GET_STARTED)}
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
};
