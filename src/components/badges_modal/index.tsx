import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import { getLayoutDirection } from '../../app/layouts';
import { useHistory } from 'react-router';
import { BADGES_ACHIEVED, BADGES_REMINDING, BADGES_TITLE } from '../../locales/strings';

import icons from '../../assets/icons';
import Separator from '../separator';
import discussionBadge from '../../assets/images/discuss.png';
import commentBadge from '../../assets/images/Comment.png';

import { useMainContext } from '../../app/providers/main';
import { getClientBadges } from './api';
import { Client, ClientBadge, ClientBadgesList } from '../../API';

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: Function;
}

export const BadgesModal: FunctionComponent<Props> = ({ isModalVisible, setIsModalVisible }: Props) => {
  const history = useHistory();
  const { i18n, t } = useTranslation();
  const [listOfBadges, setListOfBadges] = useState<ClientBadge[]>();

  const [offset, setOffset] = useState<number>(0);
  const limit = 6;

  const { requestApi, userState } = useMainContext();

  const getUserBadges = () => {
    requestApi(
      getClientBadges,
      { offset, limit },
      (response: { listBadges: { results: ClientBadge[] }; count: number }) => {
        setListOfBadges(response.listBadges.results);
      }
    );
  };

  useEffect(() => {
    getUserBadges();
  }, [offset, i18n.language]);

  return (
    <Modal
      className={`badge-modal-wrapper ${getLayoutDirection(i18n.language)}`}
      visible={isModalVisible}
      closable={false}
      width={342}
      footer={null}
    >
      <div className="badges-container">
        <img className="close_icon" src={icons.x_icon.icon} alt="close" onClick={() => setIsModalVisible(false)} />
        <p className="title">{t(BADGES_TITLE)}</p>
        <div className="bagdes-wrapper">
          {listOfBadges?.map((badge: ClientBadge) => {
            return (
              <div className="badge-item" key={badge.id}>
                <img src={badge.image || ''} alt="image" />
                <div className="badge-content">
                  <p>{badge.title}</p>
                  <p>{badge.description}</p>
                  {badge.is_claimed ? (
                    <p className="tag-achived">
                      <img src={icons.check_green.icon} alt="check" />
                      <span> {t(BADGES_ACHIEVED)}</span>
                    </p>
                  ) : (
                    <p className="tag-counter">
                      {t(BADGES_REMINDING)}
                      <span>
                        {badge.value! - badge.client_progress!} /{badge.value}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
