import React, { FunctionComponent, useEffect, useState } from 'react';
// Components
import { Avatar, Button, Divider, List, Rate } from 'antd';
import { FOLLOW, HOME_OWNER, PROFESSIONAL, PROFESSIONALS, UN_FOLLOW } from '../../../../locales/strings';
import { useTranslation } from 'react-i18next';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { getUserName } from '../../../../utils';
import { Client } from '../../../../API';
import { MODAL_FOLLOW } from '../../../../app/settings';
import Separator from '../../../../components/separator';
import { HOMEOWNER } from '../../../../app/settings';
import icons from '../../../../assets/icons';

interface Props {
  item: Client;
  userId: string;
  onFollowUser: Function;
  onUnFollowUser: Function;
  isLast?: boolean;
}

export const FollowListItem: FunctionComponent<Props> = ({
  item,
  userId,
  onUnFollowUser,
  onFollowUser,
  isLast,
}: Props) => {
  const { t } = useTranslation();
  const [isFollowed, setIsFollowed] = useState<boolean>(item?.is_followed!);

  const onFollow = (id: string) => {
    setIsFollowed(true);
    onFollowUser(id, MODAL_FOLLOW);
  };

  const onUnFollow = (id: string) => {
    setIsFollowed(false);
    onUnFollowUser(id, MODAL_FOLLOW);
  };

  const defaultImage = item?.type === PROFESSIONAL ? icons.defaultProfImage : icons.defaultUserImage;

  return (
    <>
      <List.Item className="followListItem">
        <List.Item.Meta
          avatar={<Avatar size={33} src={item?.profile_image ? item?.profile_image : defaultImage} />}
          title={getUserName(item)}
          description={
            <>
              <div className="rating">
                <span className="rating-text">{t(item.type || HOME_OWNER)}</span>
                <span className="rating-number">{item?.total_review}</span>
                &nbsp;&nbsp;&nbsp;
                <Rate value={Number(item?.total_review)} disabled allowHalf />
              </div>
            </>
          }
        />
        {item.id !== userId ? (
          isFollowed ? (
            <Button
              type="primary"
              className="unFollow-btn"
              onClick={() => onUnFollow(item.id)}
              icon={<UserDeleteOutlined />}
            >
              {t(UN_FOLLOW)}
            </Button>
          ) : (
            <Button onClick={() => onFollow(item.id)} icon={<UserAddOutlined />} className="follow-btn">
              {t(FOLLOW)}
            </Button>
          )
        ) : null}
      </List.Item>
      {isLast ? null : <Divider type="horizontal" style={{ margin: '6px 0px' }} />}
    </>
  );
};
