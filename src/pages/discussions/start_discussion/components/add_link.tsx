import { Button, Form, Input, Row, Typography } from 'antd';
import { FormInstance, useForm } from 'antd/lib/form/Form';
import React, { FunctionComponent, LegacyRef, Ref, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill, { Quill } from 'react-quill';
import { useModal } from '../../../../app/providers/modal';
import { ADD_LINK, CREATE, LINK, TEXT } from '../../../../locales/strings';

interface Props {
  insertLink: Function;
  isVideo?: boolean;
  quillRef?: ReactQuill;
  form?: FormInstance;
}

const AddLinkOrVideo: FunctionComponent<Props> = (props: Props) => {
  const { setModalVisible } = useModal();
  const [textInitialValue, setInitialValue] = useState<string>();
  const { t } = useTranslation();
  const { insertLink, isVideo, quillRef, form } = props;
  const selection: ReactQuill.Range | undefined = quillRef?.getEditorSelection();

  const initiateValue = () => {
    try {
      const editor = quillRef?.getEditor();
      const selectedContent = editor?.getContents(selection?.index, selection?.length).ops || [];
      setInitialValue(selectedContent[0]?.insert);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initiateValue();
  }, []);

  return (
    <Form className="add-link" form={form}>
      {!isVideo && (
        <>
          <Typography.Title level={5}>{t(TEXT)}</Typography.Title>
          <Form.Item name="text" initialValue={textInitialValue}>
            <Input />
          </Form.Item>
        </>
      )}
      <Typography.Title level={5}>{t(LINK)}</Typography.Title>
      <Form.Item name="link">
        <Input />
      </Form.Item>
      <Row>
        <Button
          onClick={() => {
            setModalVisible?.(false);
            if (selection?.length) {
              quillRef?.getEditor()?.format('link', textInitialValue, 'api');
              return;
            }
            insertLink(form?.getFieldsValue());
            form?.resetFields();
          }}
        >
          {t(ADD_LINK)}
        </Button>
      </Row>
    </Form>
  );
};

export default AddLinkOrVideo;
