import {
  Category,
  City,
  Client,
  ContactMeMutation,
  GalleryPhotoList,
  ListGalleryPhotosQuery,
  ListProfessionalsQuery,
  ListReviewsQuery,
  ReviewEntityMutation,
  UpdateReviewEntityMutation,
} from '../../API';

export interface ListProfessionals {
  data: ListProfessionalsQuery;
}

export interface ListGalleryPhotos {
  data: ListGalleryPhotosQuery;
}

export interface ContactMe {
  data: ContactMeMutation;
}

export interface ListReviews {
  data: ListReviewsQuery;
}

export interface ReviewEntity {
  data: ReviewEntityMutation;
}

export interface UpdateReviewEntity {
  data: UpdateReviewEntityMutation;
}

export enum ClientStatus {
  IS_ACTIVE = 'IS_ACTIVE',
  PENDING = 'PENDING',
  IN_ACTIVE = 'IN_ACTIVE',
  DELETED = 'DELETED',
  BLOCKED = 'BLOCKED',
}
export interface TagsState {
  locations: string[];
  services: string[];
  regions: string[];
  hasTags: boolean;
}

export interface TagsMetaItem {
  id: string;
  title: string;
  type: string;
}
