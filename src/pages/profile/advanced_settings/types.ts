import { ListNotificationSettingsQuery, UpdateNotificationSettingsMutation } from '../../../API';

export interface Option {
  value: string;
}

export interface GetNotificationsFromApi {
  data: ListNotificationSettingsQuery;
}

export interface NotificationsObjectType {
  [key: string]: string;
}

export interface UpdateNotificationsSettingsFromApi {
  data: UpdateNotificationSettingsMutation;
}
