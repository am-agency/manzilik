import React from 'react';
import { Row, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Client } from '../../API';
import { useMainContext } from '../../app/providers/main';
import icons from '../../assets/icons';
import { profileIcons } from '../../assets/icons/profile';
import { PROFILE_ROUTE } from '../../utils/routes';
import Avatar from '../avatar';
import Separator from '../separator';

interface Props {
  onHandleClick?: () => void;
  client: Client;
  fromProfile?: boolean;
}
export const ProfileHeader = ({ onHandleClick, client, fromProfile }: Props) => {
  const { userName } = useMainContext();

  return (
    <Row className="profile-header" align="middle" onClick={onHandleClick}>
      <div>
        <Avatar size={58} icon={<img src={profileIcons.avatar} />} src={client?.profile_image} alt="Profile Photo" />
      </div>
      <Separator horizontal={5} />
      {client && (
        <>
          <Typography.Text className="user-name">{userName}</Typography.Text>
          {!fromProfile && (
            <Link to={PROFILE_ROUTE}>
              <img className="edit-img" src={icons.edit.icon} />
            </Link>
          )}
        </>
      )}
    </Row>
  );
};
