import React, { useEffect, useState } from 'react';

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import ChannelList from '@sendbird/uikit-react/ChannelList';
import Channel from '@sendbird/uikit-react/Channel';

const { REACT_APP_SENDBIRD_APP_ID } = process.env;
const appId = REACT_APP_SENDBIRD_APP_ID as string;

import { withUserAuthenticator } from '../../app/providers/user/with_user_authenticator';
import '@sendbird/uikit-react/dist/index.css';
import { useSendBirdContext } from '../../context/sendbird_context';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import EmptyState from '../../components/empty_state_component';
import { NodeCollapseOutlined } from '@ant-design/icons';
import icons from '../../assets/icons';

const messenger = () => {
  const [currentChannelUrl, setCurrentChannelUrl] = React.useState('');
  const [sendBirdAccessToken, setSendBirdAccessToken] = useState('');
  const [sendBirdUserId, setSendBirdUserId] = useState('');
  const params = useParams<{ id: string }>();
  const { id } = params;
  const isMobileView = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    if (id) {
      setCurrentChannelUrl(id);
    }
  }, [id]);

  const getSendBirdAccessTokenFromLocalStorage = () => {
    const sendBirdAccessToken = localStorage.getItem('sendbird_access_token');
    return sendBirdAccessToken;
  };
  const getSendBirdUserIdFromLocalStorage = () => {
    const sendBirdUserId = localStorage.getItem('sendbird_user_id');
    return sendBirdUserId;
  };

  const { accessToken, userId } = useSendBirdContext();

  useEffect(() => {
    setSendBirdAccessToken(getSendBirdAccessTokenFromLocalStorage() || accessToken);
    setSendBirdUserId(getSendBirdUserIdFromLocalStorage() || userId);
  }, [accessToken, userId]);

  return (
    <>
      <div className="App">
        {appId && sendBirdAccessToken && sendBirdAccessToken !== 'null' && userId ? (
          <SendbirdProvider appId={appId} userId={sendBirdUserId} accessToken={sendBirdAccessToken}>
            <>
              {!isMobileView && (
                <div className="sendbird-app__channellist-wrap">
                  <ChannelList
                    activeChannelUrl={currentChannelUrl}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChannelSelect={(channel: any) => {
                      if (channel?.url) {
                        setCurrentChannelUrl(channel.url);
                      }
                    }}
                  />
                </div>
              )}

              <div className="sendbird-app__conversation-wrap">
                <Channel channelUrl={currentChannelUrl} />
              </div>
            </>
          </SendbirdProvider>
        ) : (
          <div className="sendbird-app__conversation-wrap">
            <EmptyState
              title="User not found"
              description=""
              actionElement={null}
              actionFunction={() => {
                return;
              }}
              image={icons.empty_state}
            />
          </div>
        )}
      </div>
    </>
  );
};

const Messenger = withUserAuthenticator(messenger);

export default Messenger;
