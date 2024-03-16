import { Popconfirm } from 'antd';
import React from 'react';

interface Props {
  okText: string;
  cancelText: string;
  title: string;
  actionText: string | React.ReactNode;
  onConfirm: Function;
}

export const PopConfirm: React.FunctionComponent<Props> = ({
  title,
  okText,
  cancelText,
  actionText,
  onConfirm,
}: Props) => {
  return (
    <div>
      <Popconfirm
        overlayClassName="pop-confirm"
        title={title}
        okText={okText}
        cancelText={cancelText}
        onConfirm={() => onConfirm()}
      >
        <a href="#">{actionText}</a>
      </Popconfirm>
    </div>
  );
};
