import * as mutations from '../../graphql/mutations';

import * as customQueries from '../../custom_graphql/queries';
import * as customMutations from '../../custom_graphql/mutations';
import { API } from 'aws-amplify';
import { ListRoomTypesFromApi, AddProjectFromApi, DeleteProjectFromApi, ListMyProjectsFromApi } from './types';
import { GetAuthenticatedClientQuery, Pagination, ProjectInput } from '../../API';
import { graphqlAuthenticationOperation, graphqlOperation, requestAuthGraphqlOperation } from '../../utils';

export const listRoomTypes = async (input: Pagination) => {
  const roomTypesList = (await API.graphql(
    graphqlOperation(customQueries.listRoomTypes, { input })
  )) as ListRoomTypesFromApi;
  return roomTypesList.data.listRoomTypes.results;
};

export const addProject = async (project: ProjectInput) => {
  const projectData = (await API.graphql(
    graphqlAuthenticationOperation(customMutations.addProject, {
      input: {
        ...project,
      },
    })
  )) as AddProjectFromApi;
  return projectData.data.addProject;
};

export const listMyProjects = async (input: Pagination) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(customQueries.listMyProjects, {
      input,
    })
  )) as ListMyProjectsFromApi;
  return response.data.listMyProjects;
};

export const deleteProject = async (id: string) => {
  const deleteProjectQueryResponse = (await API.graphql(
    graphqlAuthenticationOperation(mutations.deleteProject, {
      id,
    })
  )) as DeleteProjectFromApi;
  return deleteProjectQueryResponse.data;
};

export const getAuthenticatedClientData = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.getAuthenticatedClient, { input })) as {
    data: GetAuthenticatedClientQuery;
  };
  return response.data.getAuthenticatedClient;
};
