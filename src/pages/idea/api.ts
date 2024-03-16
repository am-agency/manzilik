import { API } from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import * as customQueries from '../../custom_graphql/queries';

import {
  AddNoteToEntityFromApi,
  AddQuestionToApi,
  CopyEntityFromAPi,
  DeleteEntityFromApi,
  MoveEntityToProjectFromApi,
  GetPresignedUrlFromApi,
  ListLikesFromApi,
  ListRelatedProfessionalsApi,
} from './types';
import {
  DeleteEntityInput,
  CopyEntityInput,
  MoveEntityInput,
  AddNoteToProjectEntityInput,
  Pagination,
  PresignedUrlInput,
  QuestionToProjectInput,
} from '../../API';
import { graphqlAuthenticationOperation, requestAuthGraphqlOperation, requestGraphqlOperation } from '../../utils';
import { GetProjectFromApi } from '../project/types';

export const moveIdeaToProject = async (input: MoveEntityInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.moveEntityFromProject, {
      input,
    })
  )) as MoveEntityToProjectFromApi;
  return response.data.moveEntityFromProject;
};

export const addNote = async (input: AddNoteToProjectEntityInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.addNoteToProjectEntity, {
      input,
    })
  )) as AddNoteToEntityFromApi;
  return response.data.addNoteToProjectEntity;
};

export const deleteEntity = async (input: DeleteEntityInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.deleteEntityFromProject, {
      input,
    })
  )) as DeleteEntityFromApi;
  return response.data.deleteEntityFromProject;
};

export const copyEntity = async (input: CopyEntityInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.copyEntityToProject, {
      input,
    })
  )) as CopyEntityFromAPi;
  return response.data.copyEntityToProject;
};

export const listProjectIdeas = async ({ id, values, user }: { id: string; values: Pagination; user: boolean }) => {
  const query = user ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const publicIdea = (await query(customQueries.listProjectIdeas, {
    id,
    input: values,
  })) as GetProjectFromApi;
  return publicIdea.data.getProject;
};

export const listProjectQuestion = async ({ id, values, user }: { id: string; values: Pagination; user: boolean }) => {
  const query = user ? requestAuthGraphqlOperation : requestGraphqlOperation;
  const ideaQuestions = (await query(customQueries.listProjectQuestion, { id, input: values })) as GetProjectFromApi;
  return ideaQuestions.data.getProject.questions;
};

export const addQuestion = async (input: QuestionToProjectInput) => {
  const question = (await requestAuthGraphqlOperation(mutations.addQuestionToProject, { input })) as AddQuestionToApi;
  return question.data.addQuestionToProject;
};

export const getPresignedUrl = async (values: PresignedUrlInput) => {
  const url = (await API.graphql(
    graphqlAuthenticationOperation(customQueries.getPresignedUrl, {
      input: values,
    })
  )) as GetPresignedUrlFromApi;
  return url.data.getPresignedUrl;
};

export const listLikes = async (values: Pagination) => {
  const likes = (await requestGraphqlOperation(customQueries.listLikes, { input: values })) as ListLikesFromApi;
  return likes.data.listLikes;
};

export const relatedProfessionals = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listRelatedProfessionals, {
    input,
  })) as ListRelatedProfessionalsApi;
  return response.data.listRelatedProfessionals;
};
