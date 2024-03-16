import { API } from 'aws-amplify';
import { FollowUserInput, Banner as GlobalBanner, LikeInput, Platform, SendEmailInput } from '../../API';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';
import * as customQueries from '../../custom_graphql/queries';
import { graphqlAuthenticationOperation, requestGraphqlOperation, requestAuthGraphqlOperation } from '../../utils';
import {
  GetBreadCrumb,
  getMenu,
  GetShoppingMenuFromApi,
  LikeIdeaFromApi,
  SendEmail,
  FollowClient,
  UnFollowClient,
  GetGeneralSettings,
  ListFeatureFlags,
} from './types';

export const likeEntity = async (input: LikeInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.likeEntity, {
      input,
    })
  )) as LikeIdeaFromApi;
  return response.data.likeEntity;
};

export const getIdeasMenu = async () => {
  const response = (await requestGraphqlOperation(customQueries.getMenu)) as getMenu;
  return JSON.parse(response.data.getMenu.data);
};

export const getShoppingMenu = async () => {
  const response = (await requestGraphqlOperation(customQueries.getShoppingMenu)) as GetShoppingMenuFromApi;
  return JSON.parse(response.data.getShoppingMenu?.departments);
};

export const getBreadCrumbs = async (input: { slug: string; model: string }) => {
  const { slug, model } = input;
  const response = (await requestGraphqlOperation(queries.getBreadcrumb, { slug, model })) as GetBreadCrumb;
  return response.data.getBreadcrumb?.breadcrumbs;
};

export const followUser = async (input: FollowUserInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.followClient, { input })
  )) as FollowClient;

  return response.data.followClient;
};

export const unFollowUser = async (input: FollowUserInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.unfollowClient, { input })
  )) as UnFollowClient;

  return response.data.unfollowClient;
};

export const sendEmail = async (input: SendEmailInput) => {
  const response = (await requestAuthGraphqlOperation(mutations.sendEmail, { input })) as SendEmail;
  return response.data.sendEmail;
};

export const getGeneralSettings = async () => {
  const response = (await requestGraphqlOperation(customQueries.getGeneralSettings)) as GetGeneralSettings;
  return response.data.getGeneralSettings;
};

export const getFeatureFlags = async () => {
  const input: { platform: Platform } = { platform: Platform.Web };
  const response = (await requestGraphqlOperation(customQueries.listFeatureFlags, { input })) as ListFeatureFlags;
  return response.data.listFeatureFlags;
};

export const getBannerDetails = async (input: { slug: string }) => {
  const { slug } = input;
  const response = (await requestGraphqlOperation(customQueries.getGlobalBannerDetails, { slug })) as {
    data: { getBannerDetails: GlobalBanner };
  };
  return response.data.getBannerDetails;
};
