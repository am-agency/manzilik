import { UserOutlined } from '@ant-design/icons';
import { Avatar as AntdAvatar, AvatarProps } from 'antd';
import React from 'react';

interface Props {
  size?: number;
  src?: string | null;
}

const isBase64 = (src: string) => src?.startsWith('data:image/');

const Avatar = (props: AvatarProps & Props) => {
  const timestamp = new Date().getTime();
  const src = isBase64(props.src!) ? props.src : props.src;

  return (
    <AntdAvatar
      className="custom-avatar"
      icon={<UserOutlined />}
      shape={'circle'}
      style={{ width: props.size, height: props.size }}
      {...props}
      src={src}
    />
  );
};

export default Avatar;
