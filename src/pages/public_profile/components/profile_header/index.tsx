import React, { FunctionComponent, useEffect, useState } from 'react';
import { Button, Col, Divider, Modal, Row, Space, Typography } from 'antd';
import Avatar from '../../../../components/avatar';
import { MailOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons/lib';
import {
  FOLLOW,
  FOLLOWING,
  SEND_MESSAGE,
  UN_FOLLOW,
  FOLLOWERS,
  SEND_BY_EMAIL,
  SEND,
} from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { getUserName } from '../../../../utils';
import { useMainContext } from '../../../../app/providers/main';
import { followUser, unFollowUser } from '../../../../app/providers/api';
import { DONE, MODAL_FOLLOW, FOLLOWERS as followersValue, FOLLOWING as followingValue } from '../../../../app/settings';
import { publicProfileIcons } from '../../../../assets/icons/public_profile';
import Separator from '../../../../components/separator';
import FollowersList from '../followers_list';
import FollowingList from '../following_list';
import { Client } from '../../../../API';
import { useParams } from 'react-router';
import { CustomSwitch } from '../../../../components/custom_switch';
import { getLayoutDirection } from '../../../../app/layouts';
import { FOLLOWING as FOLLOWING_TEXT } from '../../../../app/settings';
import { ModalTitle } from '../../../../components/modal_title';
import { useModal } from '../../../../app/providers/modal';
import icons from '../../../../assets/icons';
import SendMessageForm from '../../../../components/send_message_form';

export interface ClientProps {
  clientData?: Client;
  getClientFollowersList?: () => void;
  refetchClient?: Function;
}

export const ProfileHeader: FunctionComponent<ClientProps> = ({ clientData, refetchClient }: ClientProps) => {
  const { t, i18n } = useTranslation();
  const [type, setType] = useState<string>(followersValue);
  const { id }: { id: string } = useParams();
  const { requestApi, userState } = useMainContext();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isForceRefresh, setIsForceRefresh] = useState<boolean>(false);
  const { showModal: showGuestModal } = useModal();
  const [client, setClient] = useState<Client>(clientData!);
  const selectedClient = JSON.parse(localStorage.getItem('selectedClient')!);

  useEffect(() => {
    if (selectedClient) {
      setClient(selectedClient);
    } else {
      setClient(clientData!);
    }
  }, [clientData, selectedClient!]);

  const isMe = client?.id === userState?.user?.sub;
  const { showModal } = useModal();

  const onFollowUser = (id?: string, type?: string) => {
    requestApi(
      followUser,
      { followee: type !== MODAL_FOLLOW ? client?.id : id },
      (response: { status: string; message: string }, error: string) => {
        if (error) {
          return;
        }
        if (type !== MODAL_FOLLOW) {
          const { message } = response;
          if (message === DONE) {
            setIsForceRefresh(!isForceRefresh);
            refetchClient?.();
          }
        }
      }
    );
  };

  const onUnFollowUser = (id?: string, type?: string) => {
    requestApi(
      unFollowUser,
      { followee: type !== MODAL_FOLLOW ? client?.id : id },
      (response: { status: string; message: string }, error: string) => {
        if (error) {
          return;
        }
        if (type !== MODAL_FOLLOW) {
          const { message } = response;
          if (message === DONE) {
            setIsForceRefresh(!isForceRefresh);
            refetchClient?.();
          }
        }
      }
    );
  };

  const onFollowClick = () => {
    if (!userState.isAuthenticated) {
      showGuestModal(<ModalTitle />, <div />, '', '');
    } else {
      onFollowUser();
    }
  };

  const onUnFollowClick = () => {
    if (!userState.isAuthenticated) {
      showGuestModal(<ModalTitle />, <div />, '', '');
    } else {
      onUnFollowUser();
    }
  };

  const showFollowModal = (type: string) => {
    if (!userState.isAuthenticated) {
      showGuestModal(<ModalTitle />, <div />, '', '');
    } else {
      setType(type);
      setModalVisible(true);
    }
  };

  const onCancel = () => {
    setModalVisible(false);
  };

  const handleSwitch = (type: string) => {
    if (type) {
      setType(followingValue);
    } else {
      setType(followersValue);
    }
  };

  const modalProps = {
    onFollowUser: onFollowUser,
    onUnFollowUser: onUnFollowUser,
    userId: userState?.client?.id!,
    paginationProps: { resourceId: id, isAuthenticated: true },
    useWindow: false,
    isForceModalFetch: isForceRefresh,
  };

  const renderModalContent = () => {
    if (type === followersValue) {
      return <FollowersList {...modalProps} />;
    } else {
      return <FollowingList {...modalProps} />;
    }
  };

  const onSendMessage = () => {
    showModal(
      <ModalTitle icon={icons.email.icon} title={t(SEND_BY_EMAIL)} />,
      <SendMessageForm email={client?.email!} sendToProfessional />,
      'send-email-modal-wrapper modal-wrapper',
      SEND
    );
  };

  return (
    <Row gutter={[24, 24]} justify={isMe ? 'space-between' : 'center'} align="middle" className="profile-header">
      <Col xl={isMe ? 18 : 9} lg={isMe ? 17 : 8} md={24} sm={24} xs={24}>
        <Row gutter={{ xl: 16, lg: 32, md: 16, sm: 8, xs: 8 }} align={'middle'}>
          <Col xl={isMe ? 3 : 6} lg={isMe ? 3 : 6} md={24} sm={24} xs={24}>
            <div className="profile-header-avatar">
              <Avatar className="avatar-lg" src={client?.profile_image} />
            </div>
          </Col>
          <Col xl={isMe ? 21 : 18} lg={isMe ? 21 : 18} md={24} sm={24} xs={24}>
            <Typography.Paragraph ellipsis={{ rows: 1 }} className="profile-header-name">
              {getUserName(client)}
            </Typography.Paragraph>
          </Col>
        </Row>
      </Col>
      <Col xl={6} lg={7} md={24} sm={24} xs={24} className="follow-details">
        <Space split={<Divider type="vertical" />}>
          <div className="follow-count" onClick={() => showFollowModal(followersValue)}>
            <img src={publicProfileIcons.followees.icon} alt="followers" />
            <Separator horizontal={9} />
            <div>
              <span className="follow-text">{t(FOLLOWERS)}</span>
              <span>{client?.followers_count}</span>
            </div>
          </div>
          <div className="follow-count" onClick={() => showFollowModal(followingValue)}>
            <img src={publicProfileIcons.followers.icon} alt="followees" />
            <Separator horizontal={9} />
            <div>
              <span className="follow-text">{t(FOLLOWING)}</span>
              <span>{client?.followees_count}</span>
            </div>
          </div>
        </Space>
      </Col>
      {!isMe && (
        <>
          <Col xl={4} lg={4} md={8} sm={10} xs={24} className="header-btns">
            {client?.is_followed ? (
              <Button block onClick={onUnFollowClick} icon={<UserDeleteOutlined />} className="follow-btn">
                {t(UN_FOLLOW)}
              </Button>
            ) : (
              <Button block onClick={onFollowClick} icon={<UserAddOutlined />} className="follow-btn">
                {t(FOLLOW)}
              </Button>
            )}
          </Col>
          <Col xl={4} lg={4} md={8} sm={10} xs={24} className="header-btns">
            <Button block icon={<MailOutlined />} onClick={onSendMessage}>
              {t(SEND_MESSAGE)}
            </Button>
          </Col>
        </>
      )}

      <Modal
        width={'375px'}
        title={
          <>
            <CustomSwitch
              onChange={handleSwitch}
              type={type}
              defaultValue={FOLLOWING_TEXT}
              firstLabel={`${t(FOLLOWERS)} ${client?.followers_count}`}
              secondLabel={`${t(FOLLOWING)} ${client?.followees_count}`}
            />
            <Divider type="horizontal" style={{ marginTop: '10px ', marginBottom: '0px' }} />
          </>
        }
        visible={modalVisible}
        onCancel={onCancel}
        className={`follow-modal ${getLayoutDirection(i18n.language)}`}
        footer={false}
      >
        {renderModalContent()}
      </Modal>
    </Row>
  );
};
