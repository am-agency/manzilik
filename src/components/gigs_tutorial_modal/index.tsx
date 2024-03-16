import React, { FunctionComponent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { getLayoutDirection } from '../../app/layouts';
import { useHistory } from 'react-router';
import { LOGIN_ROUTE, PROFILE_ROUTE } from '../../utils/routes';
import {
  ADD_NEW_SERVICE,
  MANAGE_GIGS,
  PRESS_MY_ACCOUNT,
  SERVICE_DETAILS_CONT,
  START_NOW,
  START_TRIP,
  YOU_CAN_APPLY,
} from '../../locales/strings';
import icons from '../../assets/icons';
import Separator from '../separator';
import { aiIcons } from '../../assets/icons/ai';
import { gigsIcons } from '../../assets/icons/gigs';
import * as analytics from '../../analytics';
import { TutorialContext, TutorialInterface } from '../../context/tutorial_context';

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: Function;
}

export const GigsTutorialModal: FunctionComponent<Props> = ({ isModalVisible, setIsModalVisible }: Props) => {
  const history = useHistory();
  const { i18n, t } = useTranslation();
  const { disappearTutorial } = useContext(TutorialContext) as TutorialInterface;

  const onCloseModal = () => {
    setIsModalVisible(false);
    disappearTutorial!();
  };

  return (
    <Modal visible={isModalVisible} onCancel={onCloseModal} footer={false} className="gigsTutorial-modal-container">
      <div className="body">
        <img src={gigsIcons.gigs} alt="" />
        <p className="title">{t(START_TRIP)}</p>
        <p className="subtitle">
          <span>{t(YOU_CAN_APPLY)}</span>
        </p>
        <div className="list">
          <img src={aiIcons.one} alt="" />
          <p>{t(PRESS_MY_ACCOUNT)}</p>
        </div>
        <div className="list">
          <img src={aiIcons.two} alt="" />
          {t(MANAGE_GIGS)}
        </div>
        <div className="list">
          <img src={aiIcons.three} alt="" />
          <p>{t(ADD_NEW_SERVICE)}</p>
        </div>
        <div className="list">
          <img src={aiIcons.success} alt="" />
          <p>{t(SERVICE_DETAILS_CONT)}</p>
        </div>
      </div>
      <div className="footer">
        <button
          className="btn"
          onClick={() => {
            history.push(PROFILE_ROUTE);
            analytics.PublishEvent(new analytics.AnalyticsStartAddGigTutorialEvent());
          }}
        >
          {t(START_NOW)}
        </button>
      </div>
    </Modal>
  );
};
