// https://miro.com/app/board/uXjVPv3pw2Y=/?moveToWidget=3458764544709032240&cot=14
export enum TNotificationClass {
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  LIKE = 'LIKE',
  NEW_DISCUSSION = 'NEW_DISCUSSION',
  NEW_IDEA = 'NEW_IDEA',
  NEW_MAGAZINE = 'NEW_MAGAZINE',
  NEW_TV = 'NEW_TV',
  ORDER_CANCELED = 'ORDER_CANCELED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_IN_PROGRESS = 'ORDER_IN_PROGRESS',
  REPLY = 'REPLY',
  REVIEW = 'REVIEW',
  VERIFIED = 'VERIFIED',
}

export enum TNotificationSection {
  Comments = 'COMMENTS',
  Reviews = 'REVIEWS',
}

export enum TNotificationPage {
  IDEA = 'IDEA',
  DISCUSSION = 'DISCUSSION',
  PROFESSIONAL = 'PROFESSIONAL',
  FOLLOWERS = 'FOLLOWERS',
  ORDER = 'ORDER',
  SERVICE_INQUIRY = 'SERVICE_INQUIRY',
  PROFILE = 'PROFILE',
  COMPLETE_PROFILE = 'COMPLETE_PROFILE',
  MANZILIK_AI = 'MANZILIK_AI',
  QUOTATIONS_REQUESTS = 'QUOTATIONS_REQUESTS',
  CREDIT_PURCHASE = 'CREDIT_PURCHASE',
}

export interface TNotificationPayload {
  id: string | null;
  page: TNotificationPage | null;
  section: TNotificationSection | null;
  url: string | null;
  icon: string | undefined;
  image: string | undefined;
}

export interface TNotificationSender {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export interface TNotification {
  id: string;
  title: string;
  body: string; // will support multiple content types
  notification_class: TNotificationClass;
  created_at: string;
  unread: boolean;
  notification_payload: TNotificationPayload;
  sender: TNotificationSender;
}
