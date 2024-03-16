import { API } from 'aws-amplify';
import * as queries from '../../graphql/queries';
import * as customQueries from '../../custom_graphql/queries';
import * as mutations from '../../graphql/mutations';
import {
  AddDiscussionFromApi,
  GetDiscussionDetailsFromApi,
  ListDiscussionTopicsFromApi,
  SaveTopicsToApi,
  GetInterestedTopicsFromApi,
  GetRelatedDiscussionsFromApi,
  GetUserDiscussionsCommentsCountFromApi,
  DeleteDiscussionFromApi,
  GetUserDiscussionsCountFromApi,
  SpamEntityFromApi,
  ListDiscussionsFromApi,
  ListMostRecentDiscussionsFromApi,
  SaveEntityToProjectFromApi,
  ListTopCommentersFromApi,
  ListUserDiscussionsFromApi,
  ListSpamReasonsFromApi,
} from './types';
import {
  graphqlAuthenticationOperation,
  graphqlOperation,
  requestAuthGraphqlOperation,
  requestGraphqlOperation,
} from '../../utils';
import {
  Discussion,
  SaveInterestedTopicInput,
  Pagination,
  ListMostRecentDiscussionsQueryVariables,
  SaveEntityInput,
  GetAuthenticatedClientQuery,
  ListDiscussionsWhereUserInteractedQueryVariables,
  ReportSpamInput,
  ListDiscussionsWhereUserInteractedQuery,
} from '../../API';

export const listDiscussionTopics = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(queries.listTopics, { input })) as ListDiscussionTopicsFromApi;
  return response.data.listTopics.results;
};

export const getDiscussionDetails = async (discussionId: string) => {
  const response = (await requestGraphqlOperation(customQueries.getDiscussion, {
    id: discussionId,
  })) as GetDiscussionDetailsFromApi;
  return response.data.getDiscussion;
};

export const addDiscussion = async (discussion: Discussion) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.addDiscussion, { input: discussion })
  )) as AddDiscussionFromApi;
  return response.data.addDiscussion;
};

export const listDiscussions = async (params: { input: { pagination: Pagination }; isAuthenticated: boolean }) => {
  const gqlOperation = params.isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const response = (await gqlOperation(customQueries.listDiscussions, {
    input: params.input,
  })) as ListDiscussionsFromApi;
  return { discussions: response.data.listDiscussions.results };
};

export const addDiscussionToProject = async (input: SaveEntityInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.saveEntityToProject, { input })
  )) as SaveEntityToProjectFromApi;
  return response.data.saveEntityToProject;
};

export const getClientDetailsFromApi = async (id: string) => {
  const response = (await API.graphql(graphqlOperation(customQueries.getAuthenticatedClient))) as {
    data: GetAuthenticatedClientQuery;
  };
  return response.data.getAuthenticatedClient;
};

export const getUserDiscussionsCommentsCount = async () => {
  const response = (await requestAuthGraphqlOperation(
    queries.getUserDiscussionsCommentsCount
  )) as GetUserDiscussionsCommentsCountFromApi;
  return response.data.getUserDiscussionsCommentsCount;
};

export const getUserDiscussionsCount = async (input: Pagination) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(queries.getUserDiscussionsCount)
  )) as GetUserDiscussionsCountFromApi;
  return response.data.getUserDiscussionsCount;
};

export const latestCommentedDiscussions = async () => {
  const response = (await API.graphql(graphqlOperation(queries.listDiscussions))) as ListDiscussionsFromApi;
  return response.data.listDiscussions.results;
};

export const deleteDiscussion = async (id: string) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.deleteDiscussion, { id })
  )) as DeleteDiscussionFromApi;
  return response.data.deleteDiscussion;
};

export const getTopCommenters = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listTopCommenters, input)) as ListTopCommentersFromApi;
  return { commenters: response.data.listTopCommenters.results, count: response.data.listTopCommenters.count };
};

export const saveInterestedTopic = async (values: SaveInterestedTopicInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.saveInterestedTopic, { input: { topics: values.topics } })
  )) as SaveTopicsToApi;
  return response.data.saveInterestedTopic.message;
};

export const listInterestedTopics = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(queries.listInterestedTopicsByClient, {
    input,
  })) as GetInterestedTopicsFromApi;
  return response.data.listInterestedTopicsByClient.results;
};

export const listRelatedDiscussions = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listSameTopicsDiscussions, {
    input,
  })) as GetRelatedDiscussionsFromApi;
  return response.data.listSameTopicsDiscussions.results;
};

export const listMostRecentDiscussions = async (params: ListMostRecentDiscussionsQueryVariables) => {
  const response = (await requestGraphqlOperation(customQueries.listMostRecentDiscussions, {
    input: params.input,
  })) as ListMostRecentDiscussionsFromApi;
  return { discussions: response.data.listMostRecentDiscussions.results };
};

export const spamEntity = async (input: ReportSpamInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.reportSpam, { input })
  )) as SpamEntityFromApi;
  return response.data.reportSpam?.message;
};

export const getUserDiscussions = async (params: ListMostRecentDiscussionsQueryVariables) => {
  const response = (await requestAuthGraphqlOperation(
    customQueries.listUserDiscussions,
    params
  )) as ListUserDiscussionsFromApi;
  return { discussions: response.data.listUserDiscussions.results };
};

export const getUserCommentedOnDiscussions = async (params: ListDiscussionsWhereUserInteractedQueryVariables) => {
  const response = (await requestAuthGraphqlOperation(customQueries.listDiscussionsWhereUserInteracted, params)) as {
    data: ListDiscussionsWhereUserInteractedQuery;
  };
  return { discussions: response.data.listDiscussionsWhereUserInteracted.results };
};

export const listSpamReasons = async () => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(queries.listSpamReasons)
  )) as ListSpamReasonsFromApi;
  return response.data?.listSpamReasons?.results;
};
