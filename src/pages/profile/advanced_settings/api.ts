import * as queries from '../../../graphql/queries';
import { requestAuthGraphqlOperation } from '../../../utils';
import { PlatformInput, NotificationSettingsInput } from '../../../API';
import { GetNotificationsFromApi, UpdateNotificationsSettingsFromApi } from './types';
import * as mutations from '../../../graphql/mutations';

export const listNotificationsSettings = async (input: PlatformInput) => {
  const notifications = (await requestAuthGraphqlOperation(queries.listNotificationSettings, {
    input,
  })) as GetNotificationsFromApi;
  return notifications.data.listNotificationSettings;
};

export const updateNotifications = async (input: NotificationSettingsInput) => {
  const response = (await requestAuthGraphqlOperation(mutations.updateNotificationSettings, {
    input: {
      notification_settings: input,
    },
  })) as UpdateNotificationsSettingsFromApi;
  return response.data.updateNotificationSettings;
};
