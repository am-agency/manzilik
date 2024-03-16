import * as queries from '../../graphql/queries';
import * as customQueries from '../../custom_graphql/queries';
import * as customMutations from '../../custom_graphql/mutations';
import * as mutations from '../../graphql/mutations';
import {
  AddIdeaApi,
  AddEntityToProjectApi,
  GetProjectFromApi,
  UpdateProjectFromApi,
  ListMoreIdeasFromApi,
  PaginationInputWithId,
  fetchImagesFromUrlApi,
  SetProjectDefaultIdeaApi,
} from './types';
import { UpdateProjectInput, SaveEntityInput, Pagination, IdeaInput, setProjectDefaultIdeaInput } from '../../API';
import { requestAuthGraphqlOperation } from '../../utils';

export const getProject = async (id: string) => {
  const project = (await requestAuthGraphqlOperation(customQueries.getProjectMinimized, {
    id,
  })) as GetProjectFromApi;
  return project.data.getProject;
};

export const listProjectEntities = async (values: PaginationInputWithId) => {
  const result = (await requestAuthGraphqlOperation(customQueries.listProjectEntities, values)) as GetProjectFromApi;
  const { results, count } = result.data.getProject.entities!;
  return { results, count };
};

export const addIdea = async (values: IdeaInput) => {
  const idea = (await requestAuthGraphqlOperation(mutations.addIdea, {
    input: { project_id: values.project_id, title: values.title, photo: values.photo, source: 'UPLOAD' },
  })) as AddIdeaApi;
  return idea.data.addIdea;
};

export const updateProject = async (input: UpdateProjectInput) => {
  const project = (await requestAuthGraphqlOperation(customMutations.updateProject, {
    input,
  })) as UpdateProjectFromApi;
  return project.data.updateProject;
};

export const getMoreIdeas = async (values: Pagination) => {
  const moreIdeas = (await requestAuthGraphqlOperation(customQueries.listMoreIdeas, {
    input: values,
  })) as ListMoreIdeasFromApi;
  const { results, count } = moreIdeas.data.listMoreIdeas;
  return { results, count };
};

export const saveEntityToProject = async (values: SaveEntityInput) => {
  const idea = (await requestAuthGraphqlOperation(mutations.saveEntityToProject, {
    input: values,
  })) as AddEntityToProjectApi;
  return idea.data.saveEntityToProject;
};

export const fetchImagesFromUrl = async (url: string) => {
  const images = (await requestAuthGraphqlOperation(queries.fetchImagesFromUrl, {
    url,
  })) as fetchImagesFromUrlApi;
  return images.data.fetchImagesFromUrl;
};

export const setProjectDefaultIdea = async (values: setProjectDefaultIdeaInput) => {
  const project = (await requestAuthGraphqlOperation(mutations.setProjectDefaultIdea, {
    input: values,
  })) as SetProjectDefaultIdeaApi;
  return project.data.setProjectDefaultIdea;
};
