import React, { FunctionComponent } from 'react';
// utils
import { getUserName } from '../../../../utils';
// components
import icons from '../../../../assets/icons';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Row, Typography } from 'antd';
import { ClientWithIndex } from '../side_bottom_box';

interface CommentersListProps {
  commentersList: (ClientWithIndex | null)[];
}

export const CommentersList: FunctionComponent<CommentersListProps> = (props: CommentersListProps) => {
  const { commentersList } = props;
  return (
    <div className="commenters-list">
      {commentersList.map((commenter: ClientWithIndex | null, index) => {
        return (
          <Row key={index} justify="space-between" align="middle" className="commenter-wrapper">
            <div>
              {`${commenter?.index}.`}
              &nbsp;&nbsp;&nbsp;
              <Avatar size={45} icon={<UserOutlined />} src={commenter?.profile_image} />
              &nbsp;&nbsp;&nbsp;
              <span>
                {getUserName(commenter).length > 20
                  ? `${getUserName(commenter).slice(0, 17)} ..`
                  : getUserName(commenter)}
              </span>
            </div>
            <img src={icons.arrowUp.icon} />
          </Row>
        );
      })}
    </div>
  );
};
