import React, { useEffect, useState } from 'react';
import { useSendBirdContext } from '../../context/sendbird_context';

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import Channel from '@sendbird/uikit-react/Channel';
import { useParams } from 'react-router-dom';

const { REACT_APP_SENDBIRD_APP_ID } = process.env;
const appId = REACT_APP_SENDBIRD_APP_ID as string;

/**
 * MobileMessenger component.
 *
 * This component renders a mobile messenger interface using the Sendbird SDK.
 * It retrieves the Sendbird access token and user ID from local storage or the SendBirdContext,
 * and displays the conversation for the specified channel URL.
 *
 * @returns {JSX.Element} The rendered MobileMessenger component.
 */
const MobileMessenger = () => {
  /**
   * The current channel URL.
   */
  const [currentChannelUrl, setCurrentChannelUrl] = React.useState('');

  /**
   * The Sendbird access token.
   */
  const [sendBirdAccessToken, setSendBirdAccessToken] = useState('');

  /**
   * The Sendbird user ID.
   */
  const [sendBirdUserId, setSendBirdUserId] = useState('');

  /**
   * The URL parameters.
   */
  const params = useParams<{ id: string }>();

  /**
   * The ID from the URL parameters.
   */
  const { id } = params;

  /**
   * Update the current channel URL when the ID changes.
   */
  useEffect(() => {
    if (id) {
      setCurrentChannelUrl(id);
    }
  }, [id]);

  /**
   * Get the Sendbird access token from local storage.
   *
   * @returns {string | null} The Sendbird access token.
   */
  const getSendBirdAccessTokenFromLocalStorage = () => {
    const sendBirdAccessToken = localStorage.getItem('sendbird_access_token');
    return sendBirdAccessToken;
  };

  /**
   * Get the Sendbird user ID from local storage.
   *
   * @returns {string | null} The Sendbird user ID.
   */
  const getSendBirdUserIdFromLocalStorage = () => {
    const sendBirdUserId = localStorage.getItem('sendbird_user_id');
    return sendBirdUserId;
  };

  /**
   * Retrieve the Sendbird access token and user ID from the SendBirdContext
   * or local storage and set them in the component state.
   */
  const { accessToken, userId } = useSendBirdContext();
  useEffect(() => {
    setSendBirdAccessToken(getSendBirdAccessTokenFromLocalStorage() || accessToken);
    setSendBirdUserId(getSendBirdUserIdFromLocalStorage() || userId);
  }, [accessToken, userId]);

  /**
   * Render the MobileMessenger component.
   *
   * @returns {JSX.Element} The rendered MobileMessenger component.
   */
  return (
    <>
      {sendBirdAccessToken && (
        <div className="App chat-mobile-container">
          <SendbirdProvider appId={appId} userId={sendBirdUserId} accessToken={sendBirdAccessToken}>
            <div className="sendbird-app__conversation-wrap">
              <Channel channelUrl={currentChannelUrl} renderChannelHeader={() => <div />} />
            </div>
          </SendbirdProvider>
        </div>
      )}
    </>
  );
};

export default MobileMessenger;
