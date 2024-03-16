import {
  GetBreadcrumbQuery,
  LikeEntityMutation,
  FollowClientMutation,
  UnfollowClientMutation,
  SendEmailMutation,
  Department,
  Category,
  Platform,
} from '../../API';

export interface LikeIdeaFromApi {
  data: LikeEntityMutation;
}

export interface getMenu {
  data: { getMenu: { data: string } };
}

export interface GeneralSettings {
  hyperPayPaymentUrl: string;
  enableEcommerce: boolean;
  showProfessionalReviews: boolean;
}
export interface GetGeneralSettings {
  data: {
    getGeneralSettings: GeneralSettings;
  };
}

export interface FeatureFlag {
  enabled: boolean;
  platform: Platform;
  title: string;
}

export interface ListFeatureFlags {
  data: {
    listFeatureFlags: FeatureFlag[];
  };
}

export interface GetShoppingMenuFromApi {
  data: { getShoppingMenu: { departments: string } };
}

export interface MenuItem {
  label: string;
  image: { icon: string; purple_icon: string };
}

export interface GetBreadCrumb {
  data: GetBreadcrumbQuery;
}

export interface SendEmail {
  data: SendEmailMutation;
}

export interface FollowClient {
  data: FollowClientMutation;
}

export interface UnFollowClient {
  data: UnfollowClientMutation;
}

export interface DepartmentsMenu {
  title?: string | null;
  slug?: string | null;
  children?: Array<Department | null> | null;
}

export interface Topic {
  __typename: 'Topic';
  id: string;
  paren_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  status?: string | null;
  title?: string | null;
  description?: string | null;
  is_interested?: boolean | null;
}

export interface MenuTopic {
  __typename: 'MenuTopic';
  title?: string | null;
  children?: Array<Topic | null> | null;
}

export interface MenuCategory {
  __typename: 'MenuCategory';
  title?: string | null;
  children?: Array<Category | null> | null;
}

export interface Menu {
  __typename: 'Menu';
  ideas?: Array<MenuCategory | null> | null | undefined;
  magazines?: Array<MenuCategory | null> | null;
  tvs?: Array<MenuCategory | null> | null;
  discussions?: Array<MenuTopic | null> | null;
}
