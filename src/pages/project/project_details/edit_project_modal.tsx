import { Button, Col, Form, Input, Row, Switch, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../app/providers/modal';
import {
  PRIVATE as PRIVATE_TEXT,
  PUBLIC as PUBLIC_TEXT,
  TITLE,
  DESCRIPTION,
  WRITE_DESCRIPTION,
  PROJECT_NAME,
  CANCEL,
  REQUIRED,
  CHOOSE_SPACE,
  PUBLIC_WORD,
  PRIVATE_WORD,
} from '../../../locales/strings';
import { required } from '../../projects/add_new_project';
import deleteIcon from '../../../assets/icons/delete2.svg';
import { PopConfirm } from '../../../components/pop_confirm';
import { YES, NO, ARE_YOU_SURE_DELETE_MSG, UPDATE } from '../../../locales/strings';
import { checkEmptyString } from '../../../utils';
import { useForm } from 'antd/lib/form/Form';
import { PUBLIC, PRIVATE } from '../../projects/constants';
import { Project } from '../../../components/idea/types';
import { RoomTypesList } from '../../projects/add_new_project/components/room_types_list';
import { RoomType } from '../../../API';
import { CustomSwitch } from '../../../components/custom_switch';

interface Props {
  onEditProjectSubmit: Function;
  onDeleteProject?: Function;
  project: Project;
  roomTypesList?: RoomType[];
}
export const EditProjectModal: React.FunctionComponent<Props> = ({
  onEditProjectSubmit,
  project,
  onDeleteProject,
  roomTypesList,
}: Props) => {
  const { t } = useTranslation();
  const { setModalVisible } = useModal();
  const [form] = useForm();
  const [type, setType] = useState<string>(PUBLIC);

  const onModalCancel = () => {
    setModalVisible?.(false)!;
  };

  const onSwitchChange = (checked: boolean) => {
    const status = checked ? PRIVATE : PUBLIC;
    setType(status);
  };

  const updateRoomType = (roomTypeId: string) => {
    const values = form?.getFieldsValue();
    const isRoomTypeSelected = values.room_type_id === roomTypeId;
    form?.setFieldsValue({
      room_type_id: isRoomTypeSelected ? undefined : roomTypeId,
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      title: project.title,
      description: project.description,
      room_type_id: project.room_type?.id,
    });
    setType(project.visibility!);
  }, [project]);

  return (
    <Form
      form={form}
      onFinish={(values) => {
        onEditProjectSubmit({ ...values, visibility: type });
        onModalCancel();
      }}
      className="create-project-container"
    >
      <Typography.Text className="project-name-text">{t(TITLE)}</Typography.Text>
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
                    title: val,
                  });
                },
                t(REQUIRED)
              );
            },
          }),
        ]}
        initialValue={project.title}
      >
        <Input placeholder={t(PROJECT_NAME)} />
      </Form.Item>
      <Typography.Text className="project-name-text">{t(DESCRIPTION)}</Typography.Text>
      <Form.Item name="description" initialValue={project?.description || ''}>
        <Input.TextArea placeholder={t(WRITE_DESCRIPTION)} />
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
      <Row gutter={20} align="middle">
        <Col span={10}>
          <PopConfirm
            title={`${t(ARE_YOU_SURE_DELETE_MSG, { projectName: project?.title })}`}
            actionText={<img src={deleteIcon} alt="delete" />}
            okText={t(YES)}
            cancelText={t(NO)}
            onConfirm={() => {
              onDeleteProject?.(project.id!);
              onModalCancel();
            }}
          />
        </Col>
        <Col span={7}>
          <Form.Item>
            <Button onClick={onModalCancel} className="modal-btn cancel-btn">
              {t(CANCEL)}
            </Button>
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="modal-btn">
              {t(UPDATE)}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
