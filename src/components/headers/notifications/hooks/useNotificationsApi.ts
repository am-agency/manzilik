import { Pagination } from '../../../../API';
import { useMainContext } from '../../../../app/providers/main';
import {
  GetUserUnreadNotificationsCount,
  GetUserUnreadNotificationsCountOutput,
  ListNotificationsOutput,
  ListNotificationsQuery,
  MarkNotificationAsReadInput,
  MarkNotificationAsReadMutation,
  MarkNotificationAsReadOutput,
} from '../api';

export const useNotificationsApi = () => {
  const { requestApi } = useMainContext();

  const getNotifications = async (input: Pagination) => {
    return new Promise<ListNotificationsOutput>((resolve, reject) => {
      requestApi(ListNotificationsQuery, input, (notifications: ListNotificationsOutput, error: string) => {
        error ? reject(error) : resolve(notifications);
      });
    });
  };

  const getNotificationsCount = async () => {
    return new Promise<GetUserUnreadNotificationsCountOutput>((resolve, reject) => {
      requestApi(
        GetUserUnreadNotificationsCount,
        {},
        (result: GetUserUnreadNotificationsCountOutput, error: string) => {
          error ? reject(error) : resolve(result);
        }
      );
    });
  };

  const markNotificationAsRead = async (input: MarkNotificationAsReadInput) => {
    return new Promise<MarkNotificationAsReadOutput>((resolve, reject) => {
      requestApi(MarkNotificationAsReadMutation, input, (result: MarkNotificationAsReadOutput, error: string) => {
        error ? reject(error) : resolve(result);
      });
    });
  };

  return { getNotifications, markNotificationAsRead, getNotificationsCount };
};
