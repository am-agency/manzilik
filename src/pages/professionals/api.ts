import { API } from 'aws-amplify';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';
import * as customQueries from '../../custom_graphql/queries';
import * as customMutations from '../../custom_graphql/mutations';

import {
  graphqlAuthenticationOperation,
  graphqlOperation,
  requestAuthGraphqlOperation,
  requestGraphqlOperation,
} from '../../utils';
import {
  CompleteProfessionalProfileInput,
  CompleteProfessionalProfileMutation,
  ContactMeInput,
  DeleteProfessionalGalleryPhotoMutation,
  DeleteProfessionalVideoMutation,
  GetMyReviewForProfessionalQuery,
  GetProfessionalQuery,
  ListCitiesByRegionQuery,
  ListCitiesQuery,
  ListLocationsQuery,
  ListRegionsQuery,
  ListServicesQuery,
  Pagination,
  ReviewInput,
  SearchProfessionalsQuery,
  SearchProfessionalsQueryVariables,
  UploadProfessionalPhotosInput,
  UploadProfessionalPhotosMutation,
  UploadProfessionalVideosInput,
  UploadProfessionalVideosMutation,
} from '../../API';

import {
  ContactMe,
  ListGalleryPhotos,
  ListProfessionals,
  ListReviews,
  ReviewEntity,
  UpdateReviewEntity,
} from './types';

export const completeProfessionalProfile = async (input: CompleteProfessionalProfileInput) => {
  const response = (await requestAuthGraphqlOperation(mutations.completeProfessionalProfile, { input })) as {
    data: CompleteProfessionalProfileMutation;
  };
  return response.data.completeProfessionalProfile;
};

export const uploadProfessionalPhotos = async (input: UploadProfessionalPhotosInput) => {
  const response = (await requestAuthGraphqlOperation(mutations.uploadProfessionalPhotos, { input })) as {
    data: UploadProfessionalPhotosMutation;
  };
  return response.data.uploadProfessionalPhotos;
};

export const uploadProfessionalVideos = async (input: UploadProfessionalVideosInput) => {
  const response = (await requestAuthGraphqlOperation(mutations.uploadProfessionalVideos, { input })) as {
    data: UploadProfessionalVideosMutation;
  };
  return response.data.uploadProfessionalVideos;
};

export const listLocations = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(queries.listLocations, { input })) as {
    data: ListLocationsQuery;
  };
  return response.data.listLocations?.results;
};

export const listServices = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(queries.listServices, { input })) as {
    data: ListServicesQuery;
  };
  return response.data.listServices?.results;
};

export const reviewProfessional = async (input: ReviewInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.reviewEntity, { input })
  )) as ReviewEntity;
  return response.data.reviewEntity;
};

export const editProfessionalReview = async (input: ReviewInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(customMutations.updateReviewEntity, { input })
  )) as UpdateReviewEntity;
  return response.data.updateReviewEntity;
};

export const getMyReviewForProfessional = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(customQueries.getMyReviewForProfessional, { input })) as {
    data: GetMyReviewForProfessionalQuery;
  };
  return response.data.getMyReviewForProfessional;
};

export const getProfessional = async (params: { id: string; isAuthenticated: boolean }) => {
  const { id, isAuthenticated } = params;
  const gqlOperation = isAuthenticated ? requestAuthGraphqlOperation : requestGraphqlOperation;
  // the limit is a fixed number, because the design doesn't have the pagination option for each list
  const response = (await gqlOperation(customQueries.getProfessional, { id, input: { offset: 0, limit: 30 } })) as {
    data: GetProfessionalQuery;
  };
  return response.data.getProfessional;
};

export const listProfessionals = async (input: Pagination) => {
  const professional = (await API.graphql(graphqlOperation(queries.listProfessionals, { input }))) as ListProfessionals;
  return professional.data.listProfessionals;
};

export const listGalleryPhotos = async (input: Pagination) => {
  const professional = (await requestGraphqlOperation(customQueries.listGalleryPhotos, { input })) as ListGalleryPhotos;
  return professional.data.listGalleryPhotos;
};

export const listGalleryVideos = async (values: { id: string; input: Pagination }) => {
  const { id, input } = values;
  const professional = (await requestGraphqlOperation(customQueries.getProfessional, {
    id,
    input,
  })) as { data: GetProfessionalQuery };
  return professional.data.getProfessional.videos;
};

export const deleteProfessionalPhoto = async (id: string) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(mutations.deleteProfessionalGalleryPhoto, { id })
  )) as { data: DeleteProfessionalGalleryPhotoMutation };
  return response.data.deleteProfessionalGalleryPhoto;
};

export const deleteProfessionalVideo = async (id: string) => {
  const response = (await API.graphql(graphqlAuthenticationOperation(mutations.deleteProfessionalVideo, { id }))) as {
    data: DeleteProfessionalVideoMutation;
  };
  return response.data.deleteProfessionalVideo;
};
export const contactMe = async (input: ContactMeInput) => {
  const contactInfo = (await API.graphql(graphqlAuthenticationOperation(mutations.contactMe, { input }))) as ContactMe;
  return contactInfo.data.contactMe;
};

export const listReviews = async (input: Pagination) => {
  const reviews = (await requestGraphqlOperation(customQueries.listReviews, { input })) as ListReviews;
  return reviews.data.listReviews;
};

export const listRegionsByCountry = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listRegions, { input })) as { data: ListRegionsQuery };
  return response.data.listRegions;
};

export const listCitiesByRegion = async (input: Pagination) => {
  const reviews = (await requestGraphqlOperation(customQueries.listCitiesByRegion, { input })) as {
    data: ListCitiesByRegionQuery;
  };
  return reviews.data.listCitiesByRegion;
};

export const listCitiesByCountry = async (input: Pagination) => {
  const reviews = (await requestGraphqlOperation(customQueries.listCities, { input })) as {
    data: ListCitiesQuery;
  };
  return reviews.data.listCities;
};

export const searchProfessionalsRequest = async (input: SearchProfessionalsQueryVariables) => {
  const { text, cities, pagination, sortBy, services, regions, is_verified } = input;
  const response = (await requestGraphqlOperation(customQueries.searchProfessionals, {
    text,
    cities,
    pagination,
    sortBy,
    services,
    regions,
    is_verified,
  })) as { data: SearchProfessionalsQuery };
  return response.data?.searchProfessionals;
};
