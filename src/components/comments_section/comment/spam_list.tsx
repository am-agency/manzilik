import { Form, FormInstance, message, Radio, Space } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SpamReason } from '../../../API';
import { useMainContext } from '../../../app/providers/main';
import { DONE, SPAM_DONE } from '../../../locales/strings';
import { listSpamReasons, spamEntity } from '../../../pages/discussions/api';
import { required } from '../../../pages/projects/add_new_project';

interface Props {
  entityId?: string;
  form?: FormInstance;
}

export const SpamList: FunctionComponent<Props> = (props: Props) => {
  const { requestApi } = useMainContext();
  const { t } = useTranslation();
  const [spamList, setSpamList] = useState<SpamReason[]>([]);
  const [spamReason, chooseSpamReason] = useState<string>();

  useEffect(() => {
    requestApi(listSpamReasons, {}, (spams: SpamReason[], error: string) => {
      if (error) {
        return;
      }

      setSpamList(spams);
    });
  }, []);

  const onSpamEntity = () => {
    requestApi(spamEntity, { id: props.entityId, reasonId: spamReason }, (response: {}, error: string) => {
      if (error) {
        return;
      }
      message.success(t(SPAM_DONE));
    });
  };

  return (
    <Form onFinish={onSpamEntity} form={props.form} className="spam-list">
      <Form.Item rules={[required]} name="spam">
        <Radio.Group value={spamReason}>
          <Space direction="vertical">
            {spamList.map((spam: SpamReason) => (
              <Radio value={spam.id} key={spam.id} onClick={() => chooseSpamReason(spam.id)}>
                <div>{spam.description || 'Spam Reason'}</div>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};
