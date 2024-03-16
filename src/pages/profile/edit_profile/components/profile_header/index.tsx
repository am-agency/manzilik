import { Typography } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
  title: string;
  toolbar?: ReactNode;
}

export const PrivateProfileHeader = ({ title, toolbar }: Props) => {
  return (
    <div className="edit-profile-header">
      <Typography.Title>{title}</Typography.Title>
      {toolbar}
    </div>
  );
};
