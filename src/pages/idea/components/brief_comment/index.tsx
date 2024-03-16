import { Form, Input } from 'antd';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { WRITE_COMMENT } from '../../../../locales/strings';

interface Props {
  onWriteComment: () => void;
}
export const BriefComment: FunctionComponent<Props> = ({ onWriteComment }: Props) => {
  const { t } = useTranslation();

  return (
    <Form className="form brief-comment">
      <Form.Item>
        <Input onClick={onWriteComment} placeholder={t(WRITE_COMMENT)} />
      </Form.Item>
    </Form>
  );
};
