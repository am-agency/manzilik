import React, { useMemo } from 'react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  channel: any;
}

export const CustomChatHeader = ({ channel }: Props) => {
  const channelName = channel.name;
  const channelAvatar = useMemo(() => {
    if (channel.coverUrl) {
      return <img src={channel.coverUrl} style={{ width: '100px' }} />;
    }
    return <></>;
  }, [channel]);
  const channelTitle = useMemo(() => {
    if (channelName) {
      return channelName;
    }
  }, [channelName]);
  return (
    <div className="customizedHeaderWrapper">
      <div>{channelAvatar}</div>
      <div>{channelTitle}</div>
    </div>
  );
};
