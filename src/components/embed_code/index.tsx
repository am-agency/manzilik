import { Col, Form, FormInstance, Input, Row, Typography } from 'antd';
import React, { FunctionComponent, useEffect, useState } from 'react';

interface Props {
  preview_photo_url: string;
  link: string;
  form?: FormInstance;
}
export const EmbedCode: FunctionComponent<Props> = (props: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const content = `<div style="width:300px;text-align:center;font-size:12px;padding:0;border:0;margin:0;">
  <a href=${props.link} target="_blank" rel="noreferrer">
    <img style="width:100%;" src=${props.preview_photo_url} alt="Makhzan" />
  </a>
</div>`;

  const selectContent = () => {
    const container = document.getElementById('embed');
    const autoSelect = container?.getElementsByTagName('textarea') || [];
    autoSelect[0]?.select?.();
  };

  useEffect(() => {
    setIsMounted(true);
    isMounted && selectContent();
  }, [isMounted]);

  return (
    <Form
      form={props.form}
      onFinish={() => {
        navigator.clipboard.writeText(content);
      }}
    >
      <Row justify="space-between" id="embed" gutter={16} className="embed-code-container">
        <Col span={12}>
          <div className="img-wrapper">
            <a href={props.preview_photo_url} target="_blank" rel="noreferrer">
              <img className="img-fit-content rounded-border" src={props.preview_photo_url} alt="Preview photo url" />
            </a>
          </div>
        </Col>
        <Col span={12}>
          <Typography.Text code editable={{ editing: true }}>
            {content}
          </Typography.Text>
        </Col>
      </Row>
    </Form>
  );
};
