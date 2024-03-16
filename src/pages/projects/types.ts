import { ListMyProjectsQuery, ListProjectsQuery, ListRoomTypesQuery, Project, RoomType } from '../../API';
import { ProjectsWithTotal } from '../home/types';

export interface ListRoomTypesFromApi {
  data: ListRoomTypesQuery;
}

export interface ListProjectsFromApi {
  data: ListProjectsQuery;
}

export interface ListMyProjectsFromApi {
  data: ListMyProjectsQuery;
}

export interface AddProjectFromApi {
  data: { addProject: Project };
}

export interface DeleteProjectFromApi {
  data: { id: string };
}

export interface listProjectInput {
  limit: number;
  offset: number;
}

export enum Status {
  DELETED = 'DELETED',
}
