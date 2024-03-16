import { FetchImagesFromUrlQuery, Idea, ListMoreIdeasQuery, ListProjectEntitiesQuery, Project } from '../../API';

export interface ListProjectEntitiesFromApi {
  data: ListProjectEntitiesQuery;
}

export interface GetProjectFromApi {
  data: { getProject: Project };
}

export interface AddIdeaApi {
  data: { addIdea: Idea };
}

export interface UpdateProjectFromApi {
  data: { updateProject: Project };
}

export interface ListIdeas {
  ideas: Idea[];
  ideas_total: string;
}

export interface ListMoreIdeasFromApi {
  data: ListMoreIdeasQuery;
}

export interface AddEntityToProjectApi {
  data: { saveEntityToProject: Idea };
}

export interface SetProjectDefaultIdeaApi {
  data: { setProjectDefaultIdea: Project };
}

export interface ProjectEntitiesInput {
  limit: number;
  offset: number;
  tag: string;
}

export interface PaginationInputWithId {
  id: string;
  input: ProjectEntitiesInput;
}

export enum FilterTag {
  DISCUSSION = 'DISCUSSION',
  IDEA = 'IDEA',
  QUESTIONS = 'QUESTIONS',
  MAGAZINE = 'MAGAZINE',
  TV = 'TV',
}

export interface fetchImagesFromUrlApi {
  data: FetchImagesFromUrlQuery;
}
