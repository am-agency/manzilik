import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Col, Rate, Row, Typography } from 'antd';
import defaultUser from '../../../assets/backgrounds/default-user.png';
import { Client } from '../../../API';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { FOLLOW, UN_FOLLOW } from '../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { getClientProfile, getUserName } from '../../../utils';
import { useMainContext } from '../../../app/providers/main';
import { followUser, unFollowUser } from '../../../app/providers/api';
import { DONE } from '../../../app/settings';
import { ModalTitle } from '../../../components/modal_title';
import { useModal } from '../../../app/providers/modal';
import { useHistory } from 'react-router';
import { useClient } from '../../../app/hooks/use_client';

interface Props {
  client: Client;
}

export const ClientComponent: FunctionComponent<Props> = ({ client }: Props) => {
  const { t } = useTranslation();
  const { requestApi, userState, userName } = useMainContext();
  const history = useHistory();
  const [isFollowed, setIsFollowed] = useState<boolean>(client?.is_followed!);
  const { showModal } = useModal();

  const onFollowUser = () => {
    if (!userState.isAuthenticated) {
      showModal(<ModalTitle />, <div />, '', '');
    } else {
      requestApi(
        followUser,
        { followee: client?.id },
        (response: { status: string; message: string }, error: string) => {
          if (error) {
            return;
          }
          const { message } = response;
          if (message === DONE) {
            setIsFollowed(true);
          }
        }
      );
    }
  };

  const onUnFollowUser = () => {
    if (!userState.isAuthenticated) {
      showModal(<ModalTitle />, <div />, '', '');
    } else {
      requestApi(
        unFollowUser,
        { followee: client?.id },
        (response: { status: string; message: string }, error: string) => {
          if (error) {
            return;
          }
          const { message } = response;
          if (message === DONE) {
            setIsFollowed(false);
          }
        }
      );
    }
  };

  return (
    <>
      <Row gutter={12} className="client">
        <Col xxl={2} xl={2} lg={3} md={2} sm={3} xs={4} className="client-img-container">
          <img
            src={client?.profile_image! || defaultUser}
            className="img-fit-content client-photo clickable"
            onClick={() => getClientProfile(history, client)}
          />
        </Col>
        <Col xxl={6} xl={7} lg={7} md={7} sm={6} xs={10}>
          <Typography.Text className="user-name clickable" onClick={() => getClientProfile(history, client!)}>
            {getUserName(client!)}
          </Typography.Text>
          <br />
          <Rate disabled allowHalf defaultValue={client?.total_review!} />
          <span className="client-review">{client?.total_review!} </span>
        </Col>
        <Col span={4}>
          {isFollowed ? (
            <Button onClick={onUnFollowUser} icon={<UserDeleteOutlined />} className="follow-btn">
              {t(UN_FOLLOW)}
            </Button>
          ) : (
            <Button onClick={onFollowUser} icon={<UserAddOutlined />} className="follow-btn">
              {t(FOLLOW)}
            </Button>
          )}
        </Col>
        <Col xl={4} lg={4} md={0} xs={0} sm={0} />
      </Row>
      <Row className="client">
        <Col>
          <Typography.Text className="about-me"> {client?.about_me} </Typography.Text>
          <br />
        </Col>
      </Row>
    </>
  );
};
