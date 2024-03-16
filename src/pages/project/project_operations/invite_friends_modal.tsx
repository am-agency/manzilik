import { Button, Col, Divider, Form, Input, List, Row, Select, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useState } from 'react';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/style.css';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../../app/providers/modal';
import { CANCEL, EDIT } from '../../../locales/strings';
import { required } from '../../projects/add_new_project';
import icons from '../../../assets/icons';
import { EyeOutlined } from '@ant-design/icons';
import { useMainContext } from '../../../app/providers/main';
import {
  INVITE,
  SAVE_SETTINGS,
  CAN_EDIT,
  CAN_VIEW,
  WHO_HAS_ACCESS,
  CURRENTLY_SHARE_WITH,
  INVITE_BY_EMAIL_OR_NAME,
  INVITE_BY_EMAIL_OR_NAME_PLACEHOLDER,
  DELETE_FRIEND,
  YOU,
} from '../../../locales/strings';
import defaultPic from '../../../assets/backgrounds/default_pic.jpg';
import ProfilePic from '../../../assets/icons/profile_pic.svg';

interface InviteProps {
  email: string;
  role: string;
}

export const InviteFriendsModal = () => {
  const { t } = useTranslation();
  const { requestApi, userState } = useMainContext();
  const { setModalVisible } = useModal();
  const [emails, setEmails] = useState<string[]>([]);
  const [friends, setFriends] = useState<InviteProps>();
  const [rolesSectionVisible, setRolesSectionVisible] = useState<boolean>(false);

  const onSelectChange = (role: string, email: string) => {
    setFriends({ ...friends, email, role });
  };

  const onSaveClick = () => {
    // @TODO: this will be worked when connecting with backend
    // requestApi(inviteFriends,friends, (response)=>{
    // })
    setModalVisible && setModalVisible(false)!;
    setRolesSectionVisible(false);
    setEmails([]);
  };

  const onFinish = (values: { emails: string[] }) => {
    setEmails(values.emails!);
    setRolesSectionVisible(true);
  };

  const onModalCancel = () => {
    setModalVisible && setModalVisible(false)!;
    setRolesSectionVisible(false);
    setEmails([]);
  };

  return (
    <Form onFinish={onFinish} className="create-project-container">
      <Typography.Text>{t(INVITE_BY_EMAIL_OR_NAME)}</Typography.Text>
      <Form.Item name="emails" validateTrigger="onBlur" rules={[required]} className="item first-item">
        <ReactMultiEmail
          placeholder={t(INVITE_BY_EMAIL_OR_NAME_PLACEHOLDER)}
          emails={emails}
          onChange={(_emails: string[]) => {
            setEmails(_emails);
          }}
          validateEmail={(email: string) => {
            return isEmail(email);
          }}
          getLabel={(email: string, index: number, removeEmail: (index: number) => void) => {
            return (
              <div data-tag key={index}>
                {email}
                <span data-tag-handle onClick={() => removeEmail(index)}>
                  ×
                </span>
              </div>
            );
          }}
        />
      </Form.Item>
      {!rolesSectionVisible && emails.length !== 0 && (
        <Typography.Text>
          {t(CURRENTLY_SHARE_WITH)}
          {emails.slice(0, 2).map((email, index) => (
            <Typography.Text key={index}>{` ${email},`} </Typography.Text>
          ))}
          <span className="edit" onClick={() => setRolesSectionVisible(true)}>
            {t(EDIT)} <img src={icons.edit.icon} />
          </span>
        </Typography.Text>
      )}
      <Divider />
      {rolesSectionVisible && (
        <>
          <Typography.Text className="access-title">{t(WHO_HAS_ACCESS)}</Typography.Text>
          <List
            dataSource={emails}
            renderItem={(item, index) => (
              <>
                {index == 0 && (
                  <List.Item key={item} className="user-item">
                    <List.Item.Meta
                      avatar={<Avatar src={ProfilePic} />}
                      title={<div>{`${userState.user?.name}  (${t(YOU)})`}</div>}
                    />
                  </List.Item>
                )}
                <List.Item key={item}>
                  <List.Item.Meta avatar={<Avatar src={defaultPic} />} title={<div>{item.split('@')[0]}</div>} />
                  <div className="role-selector">
                    <Select
                      onChange={(value) => onSelectChange(value, item)}
                      dropdownClassName="select-dropdown"
                      defaultValue={`edit`}
                      showArrow
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <Divider />
                          <div className="delete-friend">{t(DELETE_FRIEND)}</div>
                        </div>
                      )}
                    >
                      <Select.Option value="edit" suffixIcon={<img src={icons.edit.icon} />}>
                        <span>{t(CAN_EDIT)}</span> <img src={icons.edit.icon} />
                      </Select.Option>
                      <Select.Option value="view">
                        <span>{t(CAN_VIEW)}</span>
                        <EyeOutlined />
                      </Select.Option>
                    </Select>
                  </div>
                </List.Item>
              </>
            )}
          />
        </>
      )}
      <Row gutter={20} align="middle">
        <Col span={12} />
        <Col span={6}>
          <Form.Item>
            <Button onClick={onModalCancel} className="modal-btn cancel-btn">
              {t(CANCEL)}
            </Button>
          </Form.Item>
        </Col>
        <Col span={6}>
          {rolesSectionVisible ? (
            <Button className="modal-btn save" onClick={onSaveClick}>
              {t(SAVE_SETTINGS)}
            </Button>
          ) : (
            <Form.Item>
              <Button type="primary" htmlType="submit" className="modal-btn">
                {t(INVITE)}
              </Button>
            </Form.Item>
          )}
        </Col>
      </Row>
    </Form>
  );
};
