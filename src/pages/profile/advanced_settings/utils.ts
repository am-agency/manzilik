import {
  MANZILIK_MAGAZINE_HOME_TOURS,
  MANZILIK_SHOP_TRENDING_PRODUCTS_AND_SALES,
  PRODUCT_ALERTS_PRICE_DROPS,
  PERSONALIZED_RECOMMENDATIONS,
  MANZILIK_TV_SURVEYS_AND_OTHER_UPDATES,
  MANZILIK_REFERRAL_COUPONS,
  MANZILIK_UPDATES_NEAR_ME,
  TIPS_GUIDES_AND_NEW_FEATURE_ANNOUNCEMENTS,
  SOMEONE_COMMENTS_ON_MY_IDEABOOK,
  SOMEONE_COMMENTS_ON_MY_POST,
  SOMEONE_FOLLOWS_ME,
  SOMEONE_MESSAGES_ME,
  THERE_IS_AN_ISSUE_WITH_MY_ACCOUNT_OR_LOGIN,
  MY_DISCUSSIONS,
  MY_PUBLIC_IDEABOOKS,
  MY_SOCIAL_MEDIA_PROFILES,
  MY_UPLOADED_PHOTOS_AND_PROJECTS,
  PEOPLE_I_FOLLOW,
  PEOPLE_WHO_FOLLOW_ME,
  EVERY_TIME,
  NEVER,
  DISPLAY_NEWS_FIRST,
  DISPLAY_OLDEST_FIRST,
  DONT_ALLOW_USERS_TO_MESSAGE_ME,
  ALLOW_USERS_I_FOLLOW_TO_MESSAGE_ME,
  ALLOW_ALL_USERS_TO_MESSAGE_ME,
  LIMIT_2_PER_DAY,
  LIMIT_1_PER_HOUR_POST,
} from '../../../locales/strings';

export const getEmailSubscriptionsCheckboxFields = (t: Function) => [
  { label: t(MANZILIK_MAGAZINE_HOME_TOURS), name: 'manzilikMagazine' },
  { label: t(MANZILIK_SHOP_TRENDING_PRODUCTS_AND_SALES), name: 'manzilikShop' },
  {
    label: t(PRODUCT_ALERTS_PRICE_DROPS),
    name: 'productPricesAlert',
  },
  {
    label: t(PERSONALIZED_RECOMMENDATIONS),
    name: 'personalizedRecommendations',
  },
  { label: t(MANZILIK_TV_SURVEYS_AND_OTHER_UPDATES), name: 'manzilikTv' },
  {
    label: t(MANZILIK_REFERRAL_COUPONS),
    name: 'manzilikReferralCoupons',
  },
  { label: t(MANZILIK_UPDATES_NEAR_ME), name: 'manzilikUpdatesNearMe' },
  {
    label: t(TIPS_GUIDES_AND_NEW_FEATURE_ANNOUNCEMENTS),
    name: 'tipsGuidesAndNewFeatureAnnouncements',
  },
];

export const getUserActivityNotificationsSelectFields = (t: Function) => [
  {
    label: t(THERE_IS_AN_ISSUE_WITH_MY_ACCOUNT_OR_LOGIN),
    name: 'issueInmyAccountOrLogin',
    options: generalOptions(t),
  },
  {
    label: t(SOMEONE_FOLLOWS_ME),
    name: 'someoneFollowsMe',
    options: generalOptions(t, [{ value: t(LIMIT_2_PER_DAY) }]),
  },
  {
    label: t(SOMEONE_MESSAGES_ME),
    name: 'someoneMessagesMe',
    options: generalOptions(t),
  },
  {
    label: t(SOMEONE_COMMENTS_ON_MY_POST),
    name: 'someoneCommentsOnMyPosts',
    options: generalOptions(t, [{ value: t(LIMIT_1_PER_HOUR_POST) }]),
  },
  {
    label: t(SOMEONE_COMMENTS_ON_MY_IDEABOOK),
    name: 'someoneCommentsOnMyIdeaBook',
    options: generalOptions(t, [{ value: t(LIMIT_1_PER_HOUR_POST) }]),
  },
];

export const getMyProfilePageSettingFields = (t: Function) => [
  { label: t(MY_PUBLIC_IDEABOOKS), name: 'myPublicIdeaBooks' },
  { label: t(MY_UPLOADED_PHOTOS_AND_PROJECTS), name: 'myUploadedPhotosAndProjects' },
  { label: t(MY_DISCUSSIONS), name: 'myDiscussions' },
  { label: t(MY_SOCIAL_MEDIA_PROFILES), name: 'mySocialMediaProfiles' },
  { label: t(PEOPLE_WHO_FOLLOW_ME), name: 'peopleFollowMe' },
  { label: t(PEOPLE_I_FOLLOW), name: 'peopleIFollow' },
];

export const generalOptions = (t: Function, extraOptions?: { value: string }[]) => [
  { value: t(EVERY_TIME) },
  ...(extraOptions || []),
  { value: t(NEVER) },
];

export const newSettlerEditionOptions = (t: Function) => [
  { value: t('PALESTINE') },
  { value: t('USA') },
  { value: t('MALAYSIA') },
];

export const getDefaultPhotosOrderOptions = (t: Function) => [
  { value: t(DISPLAY_NEWS_FIRST) },
  { value: t(DISPLAY_OLDEST_FIRST) },
];

export const whoCanMessageMeOptions = (t: Function) => [
  { value: t(DONT_ALLOW_USERS_TO_MESSAGE_ME) },
  { value: t(ALLOW_USERS_I_FOLLOW_TO_MESSAGE_ME) },
  { value: t(ALLOW_ALL_USERS_TO_MESSAGE_ME) },
];
