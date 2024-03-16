import { Comment, ListCommentsQuery } from '../../API';

export interface GetCommentsFromApi {
  data: ListCommentsQuery;
}

export interface AddCommentToApi {
  data: { addComment: Comment };
}

export interface DeleteCommentFromApi {
  data: { deleteComment: Comment };
}

export interface UpdateCommentFromApi {
  data: { updateComment: Comment };
}
