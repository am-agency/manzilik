import React, { useRef, useState } from 'react';
import { aiIcons } from '../../../../assets/icons/ai';
import ReferralInput from './referral_input';
import { ReferralViewType } from '../../../../constants';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  GET_POINTS,
  GOT_POINTS,
  INVITE_FRIENDS,
  REGISTER_FOR_MANZILIK,
  SHARE_LINK,
  SHARE_WITH_FRIENDS,
  TRY_AI,
} from '../../../../locales/strings';

interface ReferralProps {
  viewType?: string;
}

const Referral = (props: ReferralProps) => {
  const { viewType = ReferralViewType.LARGE } = props;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const onToggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const { t } = useTranslation();

  return (
    <>
      {viewType === ReferralViewType.LARGE ? (
        <div className="referral">
          <div className="referral-column referral-content">
            <div className="icon">
              <img src={aiIcons.user} alt="" />
            </div>
            <div>
              <div className="title">{t(INVITE_FRIENDS)}</div>
              <div className="subtitle">
                <span>{t(GET_POINTS)}</span>
                <img src={aiIcons.info2} alt="" onClick={onToggleModal} />
              </div>
            </div>
          </div>
          <div className="referral-column">
            <ReferralInput />
          </div>
        </div>
      ) : (
        <div className="referral-small">
          <div className="referral-small-content">
            <img src={aiIcons.user} alt="" />
            <div>
              <p className="title">{t(INVITE_FRIENDS)}</p>
              <p className="subtitle">
                <span>{t(GET_POINTS)}</span>
              </p>
            </div>
            <img src={aiIcons.white_info} className="clickable" alt="" onClick={onToggleModal} />
          </div>
          <ReferralInput />
        </div>
      )}
      <Modal visible={modalVisible} onCancel={onToggleModal} footer={false} className="referral-modal-container">
        <div className="body">
          <img src={aiIcons.user} alt="" />
          <p className="title">{t(INVITE_FRIENDS)}</p>
          <p className="subtitle">
            <span>{t(GET_POINTS)}</span>
          </p>
          <div className="list">
            <img src={aiIcons.one} alt="" />
            <p>{t(SHARE_LINK)}</p>
          </div>
          <div className="list">
            <img src={aiIcons.two} alt="" />
            {t(REGISTER_FOR_MANZILIK)}
          </div>
          <div className="list">
            <img src={aiIcons.three} alt="" />
            <p>{t(TRY_AI)}</p>
          </div>
          <div className="list">
            <img src={aiIcons.success} alt="" />
            <p>{t(GOT_POINTS)}</p>
          </div>
          <div className="input-modal">
            <ReferralInput />
          </div>
          <p>{t(SHARE_WITH_FRIENDS)}</p>
        </div>
      </Modal>
    </>
  );
};

export default Referral;
