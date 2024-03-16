import React, { useState } from 'react';
import { Col, Form, Input, Row, Switch, Typography } from 'antd';
import { RoomTypesList } from './components/room_types_list';

// API
import { addProject } from '../api';
// Translation
import {
  CREATE_PROJECT,
  PROJECT_NAME,
  CHOOSE_SPACE,
  OPTIONAL,
  PRIVATE as PRIVATE_TEXT,
  PUBLIC as PUBLIC_TEXT,
  ENTER_PROJECT_NAME,
  REQUIRED,
  PUBLIC_WORD,
  PRIVATE_WORD,
} from '../../../locales/strings';
// Types
import { FormInstance } from 'antd/lib/form/Form';
import { Project, RoomType } from '../../../API';
import { PUBLIC, PRIVATE } from '../constants';
// Hooks
import { useMainContext } from '../../../app/providers/main';
import { useTranslation } from 'react-i18next';
import { checkEmptyString } from '../../../utils';
import { CustomSwitch } from '../../../components/custom_switch';
import { LOADING_LOW_PRIORITY_GLOBAL } from '../../../app/providers/main/loading_constants';
import * as analytics from '../../../analytics';

interface Props {
  form?: FormInstance;
  roomTypesList?: RoomType[];
  postAddProject?: Function;
}

// TODO: i think we need to generalize this
export const required = { required: true };

const AddNewProject = (props: Props) => {
  const { t } = useTranslation();
  const { requestApi, professional } = useMainContext();
  const { roomTypesList, form, postAddProject } = props;
  const [type, setType] = useState<string>(PUBLIC);

  const updateRoomType = (roomTypeId: string) => {
    const values = props.form?.getFieldsValue();
    const isRoomTypeSelected = values.room_type_id === roomTypeId;
    props.form?.setFieldsValue({
      room_type_id: isRoomTypeSelected ? undefined : roomTypeId,
    });
  };

  const onSwitchChange = (checked: boolean) => {
    const status = checked ? PRIVATE : PUBLIC;
    setType(status);
  };
  return (
    <Form
      name="add-new-project"
      form={form}
      layout="horizontal"
      onFinish={(values: Project) => {
        requestApi(
          addProject,
          {
            ...values,
            visibility: type,
          },
          (response: Project, error: string) => {
            if (error) {
              return;
            }
            if (professional?.id) {
              analytics.PublishEvent(new analytics.AnalyticsUploadPortfolioEvent(professional.id));
            }
            postAddProject?.(response);
            form?.resetFields();
          },
          LOADING_LOW_PRIORITY_GLOBAL
        );
      }}
    >
      <Row className="create-project-container general-form" align="middle">
        <Col span={24}>
          <Typography.Text className="project-name-text">{t(PROJECT_NAME)}</Typography.Text>
          <Form.Item
            name="title"
            validateTrigger="onChange"
            rules={[
              required,
              ({ setFieldsValue }) => ({
                validator(_, value) {
                  return checkEmptyString(
                    value,
                    (val: string) => {
                      setFieldsValue({
                        name: val,
                      });
                    },
                    t(REQUIRED)
                  );
                },
              }),
            ]}
          >
            <Input
              placeholder={t(ENTER_PROJECT_NAME)}
              onPressEnter={(e) => {
                e.preventDefault();
              }}
            />
          </Form.Item>
          <Form.Item className="margin-bottom-20">
            <Form.Item className="normal-switch status-switch">
              <Row align="middle">
                <CustomSwitch
                  type={type}
                  onChange={onSwitchChange}
                  defaultValue={PRIVATE}
                  firstLabel={t(PUBLIC_WORD)}
                  secondLabel={t(PRIVATE_WORD)}
                />
                <span className="private-text">{type == PUBLIC ? t(PUBLIC_TEXT) : t(PRIVATE_TEXT)}</span>
              </Row>
            </Form.Item>
          </Form.Item>
          <Typography.Text className="choose-space-label">{t(CHOOSE_SPACE)}</Typography.Text>
          <Row>
            <RoomTypesList roomTypesList={roomTypesList!} updateRoomType={updateRoomType} />
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default AddNewProject;
