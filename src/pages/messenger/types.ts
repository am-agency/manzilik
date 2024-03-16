export interface CreateSendBirdChatGroupApi {
  sendbird_access_token: string;
  chat_url: string;
  chat_name: string;
}

export interface CreateSendBirdChatGroupApiSchema {
  data: {
    createSendBirdChatGroup: {
      sendbird_access_token: string;
      chat_url: string;
      chat_name: string;
    };
  };
}
