import {
  Idea,
  Project,
  Question,
  DeleteEntityFromProjectMutation,
  CopyEntityToProjectMutation,
  MoveEntityFromProjectMutation,
  AddNoteToProjectEntityMutation,
  ListProjectIdeasByIdeaIdQuery,
  ListQuestionsByIdeaQuery,
  ListLikesQuery,
  ListProfessionalsQuery,
  ListRelatedProfessionalsQuery,
  RoomType,
  Client,
  ClientList,
  QuestionList,
  Entity,
} from '../../API';

export interface Icon {
  icon: string;
  greyIcon?: string;
  filledIcon?: string;
  filledGreyIcon?: string;
  title?: string;
}
export interface ListProjectsFromAPi {
  data: { projects: Project[] };
}
export interface MoveEntityToProjectFromApi {
  data: MoveEntityFromProjectMutation;
}

export interface AddNoteToEntityFromApi {
  data: AddNoteToProjectEntityMutation;
}

export interface DeleteEntityFromApi {
  data: DeleteEntityFromProjectMutation;
}

export interface CopyEntityFromAPi {
  data: CopyEntityToProjectMutation;
}

export interface GetIdeaFromApi {
  data: { getIdea: Idea };
}

export interface ListProjectIdeasByIdeaIdFromApi {
  data: ListProjectIdeasByIdeaIdQuery;
}

export interface AddQuestionToApi {
  data: { addQuestionToProject: Question };
}

export interface ListIdeaQuestionsFromApi {
  data: ListQuestionsByIdeaQuery;
}

export interface GetPresignedUrlFromApi {
  data: { getPresignedUrl: { result: string } };
}

export interface ListLikesFromApi {
  data: ListLikesQuery;
}

export interface GoogleVisionResult {
  responses: {
    localizedObjectAnnotations: {
      score: number;
      boundingPoly: { normalizedVertices: { x: number; y: number }[] };
      mid: string;
      name: string;
    }[];
  }[];
}

export interface RelatedProfessionalsItems {
  image: string;
  name: string;
  title: string;
  projects: number;
  rate: number;
  rate_number: number;
}

export interface ListRelatedProfessionalsApi {
  data: ListRelatedProfessionalsQuery;
}

export interface IdeaList {
  count: number;
  next?: string;
  previous?: string;
  results: Array<Idea>;
}

export interface ProjectIdeas {
  __typename: 'Project';
  id?: string;
  room_type?: RoomType;
  is_default?: boolean;
  title: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  visibility: string;
  client_id?: string;
  client?: Client;
  discussions_count?: number;
  ideas_count: number;
  likes_count?: number;
  shares_count?: number;
  questions_count?: number;
  description?: string;
  ideas?: Idea[];
  ideasList: IdeaList;
  is_liked?: boolean;
  collaborators?: ClientList;
  default_idea?: Idea;
  questions?: QuestionList;
}
