import React, { createContext, useContext, useEffect, useState } from 'react';
const { REACT_APP_SENDBIRD_APP_ID } = process.env;
import * as SendBird from 'sendbird';

interface SendBirdContextProps {
  userId: string;
  accessToken: string;
  totalUnreadMessageCount?: number;
  listOfChannels?: SendBird.GroupChannel[];
  setUserId: (userId: string) => void;
  setAccessToken: (accessToken: string) => void;
  setTotalUnreadMessageCount?: (count: number) => void;
}

const SendBirdContext = createContext<SendBirdContextProps | undefined>(undefined);

const SendBirdProvider: React.FC = ({ children }) => {
  const appId = REACT_APP_SENDBIRD_APP_ID as string;
  const [userId, setUserId] = useState(localStorage.getItem('sendbird_user_id') || '');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('sendbird_access_token') || '');
  const sendBird = new SendBird.default({ appId });
  const [totalUnreadMessageCount, setTotalUnreadMessageCount] = useState(0);
  const [listOfChannels, setListOfChannels] = useState<SendBird.GroupChannel[]>([]);

  useEffect(() => {
    if (accessToken && accessToken !== 'null' && userId) {
      sendBird.connect(userId, accessToken, (user: SendBird.User, error: SendBird.SendBirdError) => {
        if (error) {
          console.error('Error connecting to SendBird:', error);
        } else {
          // get a list of total unread messages count
          sendBird.getTotalUnreadMessageCount((totalCount: number, error: SendBird.SendBirdError) => {
            if (error) {
              console.error('Error getting total unread message count:', error);
            } else {
              setTotalUnreadMessageCount(totalCount);
            }
          });
          // get a list all group channels
          const groupChannelListQuery = sendBird.GroupChannel.createMyGroupChannelListQuery();
          groupChannelListQuery.includeEmpty = true;
          groupChannelListQuery.order = 'latest_last_message';
          groupChannelListQuery.limit = 20; // pagination limit could be set up to 100
          groupChannelListQuery.next((groupChannels: SendBird.GroupChannel[], error: SendBird.SendBirdError) => {
            if (error) {
              console.error('Error getting list of group channels:', error);
            } else {
              setListOfChannels(groupChannels);
            }
          });
        }
      });
    }
  }, [accessToken, userId]);

  const contextValue: SendBirdContextProps = {
    userId,
    accessToken,
    listOfChannels,
    totalUnreadMessageCount,
    setUserId,
    setAccessToken,
  };

  return <SendBirdContext.Provider value={contextValue}>{children}</SendBirdContext.Provider>;
};

const useSendBirdContext = (): SendBirdContextProps => {
  const context = useContext(SendBirdContext);

  if (!context) {
    throw new Error('useSendBirdContext must be used within a SendBirdProvider');
  }

  return context;
};

export { SendBirdProvider, useSendBirdContext };
