import React, { FunctionComponent } from 'react';
import { contactIcons } from '../../../assets/icons/contact';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { HOME_PAGE, REQUEST_SUCCESSFULLY_RECEIVED, REQUEST_WILL_BE_FOLLOWED_UP } from '../../../locales/strings';
import { getLayoutDirection } from '../../../app/layouts';
import Separator from '../../../components/separator';

interface Props {
  onOk: () => void;
  onCancel: () => void;
  isModalVisible: boolean;
}

export const SuccessfulSubmissionModal: FunctionComponent<Props> = ({ onOk, onCancel, isModalVisible }: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <Modal
      visible={isModalVisible}
      okText={t(HOME_PAGE)}
      footer={false}
      onCancel={onCancel}
      className={`${getLayoutDirection(i18n.language)} confirm-modal`}
    >
      <img src={contactIcons.sent.icon} alt="sent icon" />
      <Separator vertical={10} />
      <h5>{t(REQUEST_SUCCESSFULLY_RECEIVED)}</h5>
      <h6>{t(REQUEST_WILL_BE_FOLLOWED_UP)}</h6>
      <Separator vertical={10} />
      <Button type="primary" block onClick={onOk}>
        {t(HOME_PAGE)}
      </Button>
    </Modal>
  );
};
