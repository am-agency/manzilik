import { Category, Client, Poll, RoomType, Topic } from '../../API';
import { PlaceHolder } from '../../pages/magazine/article/components/article_content';

//this type to combine between idea and discussion types
export interface BaseEntity {
  entity_id?: string | null;
  id?: string;
  created_at?: string | null;
  updated_at?: string | null;
  title?: string | null;
  photo?: string | null;
  status?: string | null;
  description?: string | null;
  project_id?: string | null;
  project?: Project | null;
  client?: Client | null;
  client_id?: string | null;
  questions_count?: number | null;
  shares_count?: number | null;
  likes_count?: number | null;
  is_liked?: boolean | null;
  is_photo_uploaded?: boolean | null;
  tag?: string | null;
  photo_url?: string | null;
  name?: string | null;
  comments_count?: number | null;
}

export interface Idea extends BaseEntity {
  source?: string | null;
}

export interface Discussion extends BaseEntity {
  polls?: Poll[];
  topics?: Topic[];
  youtube_url?: string;
  web_url?: string;
}

export interface Magazine extends BaseEntity {
  page?: { title?: string; placeholders: { plugins: PlaceHolder[] }[]; meta_description?: string };
  likes_count?: number | null;
  comments_count?: number | null;
  meta_description?: string | null;
  categories?: Array<Category | null> | null;
}

export interface TV extends BaseEntity {
  page?: { title?: string; placeholders: { plugins: PlaceHolder[] }[]; meta_description?: string };
  likes_count?: number | null;
  comments_count?: number | null;
  meta_description?: string | null;
  video_url?: string;
  categories?: Array<Category | null> | null;
}

export enum EntityTags {
  DISCUSSIONS = 'discussions',
  BRANDS = 'brands',
  IDEA = 'IDEA',
  IDEAS = 'ideas',
  MAGAZINE = 'MAGAZINE',
  TV = 'TV',
  DISCUSSION = 'DISCUSSION',
  MAGAZINES = 'magazines',
  TVS = 'tvs',
  PROFESSIONALS = 'professionals',
  PROJECTS = 'projects',
  PRODUCTS = 'stockrecords',
}

export interface Project {
  id?: string | null;
  room_type?: RoomType | null;
  is_default?: boolean | null;
  title?: string;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  visibility?: string;
  client_id?: string | null;
  client?: Client | null;
  discussions_count?: number | null;
  ideas_count?: number | null;
  questions_count?: number | null;
  likes_count?: number | null;
  shares_count?: number | null;
  description?: string | null;
  ideas?: Array<Idea | null> | null;
  is_liked?: boolean | null;
  default_idea?: Idea | null;
}

export interface GenericEntity extends BaseEntity {
  data: string;
}
