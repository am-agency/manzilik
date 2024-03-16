import {
  AddDiscussionMutation,
  Client,
  DeleteDiscussionMutation,
  GetDiscussionQuery,
  ListTopicsQuery,
  ListMostRecentDiscussionsQuery,
  ListSameTopicsDiscussionsQuery,
  GetUserDiscussionsCommentsCountQuery,
  GetUserDiscussionsCountQuery,
  ListDiscussionsQuery,
  Topic,
  ListTopCommentersQuery,
  ReportSpamMutation,
  ListUserDiscussionsQuery,
  ListInterestedTopicsByClientQuery,
  ListSpamReasonsQuery,
} from '../../API';

export interface ListDiscussionTopicsFromApi {
  data: ListTopicsQuery;
}

export interface GetDiscussionsTopicsFromApi {
  data: { listDiscussionTopics: Topic[] };
}

export interface SaveEntityToProjectFromApi {
  data: { saveEntityToProject: Discussion };
}

export interface AddDiscussionFromApi {
  data: AddDiscussionMutation;
}

export interface GetDiscussionDetailsFromApi {
  data: GetDiscussionQuery;
}

export interface ListDiscussionsFromApi {
  data: ListDiscussionsQuery;
}

export interface Discussion {
  base_entity_id?: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  title?: string;
  description?: string;
  client_id?: string;
  youtube_url?: string;
  photo?: string;
  web_url?: string;
  topics?: Array<Topic>;
  polls?: Array<Poll>;
  client?: Client;
  comments_count?: string;
}

export interface Poll {
  id?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  title?: string;
  photo_url?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file?: any;
}

export interface GetDiscussionsTopicsFromApi {
  data: { listDiscussionTopics: Topic[] };
}

export interface SaveTopicsToApi {
  data: { saveInterestedTopic: { message: string } };
}

export interface GetInterestedTopicsFromApi {
  data: ListInterestedTopicsByClientQuery;
}

export interface GetRelatedDiscussionsFromApi {
  data: ListSameTopicsDiscussionsQuery;
}

export interface ListTopCommentersFromApi {
  data: ListTopCommentersQuery;
}

export interface ListDiscussionsFromApi {
  data: ListDiscussionsQuery;
}

export interface GetUserDiscussionsCommentsCountFromApi {
  data: GetUserDiscussionsCommentsCountQuery;
}

export interface GetUserDiscussionsCountFromApi {
  data: GetUserDiscussionsCountQuery;
}

export interface DeleteDiscussionFromApi {
  data: DeleteDiscussionMutation;
}

export interface SpamEntityFromApi {
  data: ReportSpamMutation;
}

export interface ListMostRecentDiscussionsFromApi {
  data: ListMostRecentDiscussionsQuery;
}

export interface ListUserDiscussionsFromApi {
  data: ListUserDiscussionsQuery;
}

export interface ListSpamReasonsFromApi {
  data: ListSpamReasonsQuery;
}
