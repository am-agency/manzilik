import { requestAuthGraphqlOperation, requestAuthGraphqlOperationStrict } from '../../../utils';
import * as customQueries from '../../../custom_graphql/queries';
import * as customMutations from '../../../custom_graphql/mutations';
import { Pagination } from '../../../API';
import { TNotification } from './types';

export interface ListNotificationsInput extends Pagination {}

export interface ListNotificationsOutput {
  count: number;
  results: TNotification[];
}

export const ListNotificationsQuery = async (input: Pagination) => {
  return requestAuthGraphqlOperationStrict<'listNotifications', ListNotificationsOutput>(
    customQueries.listNotifications,
    {
      input,
    }
  ).then((result) => result.data?.listNotifications);
};

export interface GetUserUnreadNotificationsCountOutput {
  total: number;
}

export const GetUserUnreadNotificationsCount = async () => {
  return requestAuthGraphqlOperationStrict<'getUserUnreadNotificationsCount', GetUserUnreadNotificationsCountOutput>(
    customQueries.getUserUnreadNotificationsCount
  ).then((result) => {
    return result.data?.getUserUnreadNotificationsCount;
  });
};

export interface MarkNotificationAsReadInput {
  all?: boolean;
  notification_ids?: string;
}

export interface MarkNotificationAsReadOutput {
  message: string;
  status: string;
}

export const MarkNotificationAsReadMutation = async (input: MarkNotificationAsReadInput) => {
  return requestAuthGraphqlOperationStrict<'markNotificationAsRead', MarkNotificationAsReadOutput>(
    customMutations.markNotificationAsRead,
    {
      input,
    }
  ).then((result) => result.data?.markNotificationAsRead);
};
