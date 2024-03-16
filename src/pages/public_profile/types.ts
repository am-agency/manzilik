import {
  Client,
  GetClientQuery,
  ListClientIdeasByClientIdQuery,
  ListFolloweesByClientIdQuery,
  ListFollowersByClientIdQuery,
} from '../../API';

export interface ListClientIdeasByClientIdApi {
  data: ListClientIdeasByClientIdQuery;
}

export interface GetClientApi {
  data: GetClientQuery;
}

export interface ListClientFollowersByIdApi {
  data: ListFollowersByClientIdQuery;
}

export interface ListClientFolloweesByIdApi {
  data: ListFolloweesByClientIdQuery;
}
