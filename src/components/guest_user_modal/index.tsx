import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { getLayoutDirection } from '../../app/layouts';
import { useHistory } from 'react-router';
import { LOGIN_ROUTE } from '../../utils/routes';
import { CANCEL, GO_TO_LOGIN, SIGN_IN_NOW, YOU_HAVE_TO_LOGIN_FOR_REVIEW } from '../../locales/strings';
import icons from '../../assets/icons';
import Separator from '../separator';

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: Function;
  title?: string;
}

export const GuestUserModal: FunctionComponent<Props> = ({
  isModalVisible,
  setIsModalVisible,
  title = YOU_HAVE_TO_LOGIN_FOR_REVIEW,
}: Props) => {
  const history = useHistory();
  const { i18n, t } = useTranslation();

  const handleOk = () => {
    setIsModalVisible(false);
    history.push(LOGIN_ROUTE);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      className={`guest-modal-wrapper ${getLayoutDirection(i18n.language)}`}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText={t(CANCEL)}
      okText={t(GO_TO_LOGIN)}
      closable={false}
    >
      <div>
        <img src={icons.modal_user.icon} className="icon-user" />
      </div>
      <Separator vertical={9} />
      <h3>{t(SIGN_IN_NOW)}</h3>
      <h4>{t(title)}</h4>
      <Separator vertical={2} />
    </Modal>
  );
};
