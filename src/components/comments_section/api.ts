import { API } from 'aws-amplify';
import { CommentInput, DeleteCommentInput, Pagination } from '../../API';
import * as mutations from '../../graphql/mutations';
import * as customQueries from '../../custom_graphql/queries';
import { graphqlAuthenticationOperation, requestGraphqlOperation, requestAuthGraphqlOperation } from '../../utils';

import { AddCommentToApi, DeleteCommentFromApi, GetCommentsFromApi, UpdateCommentFromApi } from './types';

export const listComments = async ({ input, user }: { input: Pagination; user: boolean }) => {
  const query = user ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const response = (await query(customQueries.listComments, { input })) as GetCommentsFromApi;
  return { comments: response.data.listComments.results, comments_total: response.data.listComments.count };
};
export const addComment = async (values: CommentInput) => {
  const comment = (await API.graphql(
    graphqlAuthenticationOperation(mutations.addComment, { input: values })
  )) as AddCommentToApi;
  return comment.data.addComment;
};

export const deleteComment = async (input: DeleteCommentInput) => {
  const comment = (await API.graphql(
    graphqlAuthenticationOperation(mutations.deleteComment, { input })
  )) as DeleteCommentFromApi;
  return comment.data.deleteComment;
};

export const updateComment = async (values: CommentInput) => {
  const comment = (await API.graphql(
    graphqlAuthenticationOperation(mutations.updateComment, { input: values })
  )) as UpdateCommentFromApi;
  return comment.data.updateComment;
};
