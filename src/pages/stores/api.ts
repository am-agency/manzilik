import { API } from 'aws-amplify';
import { GetBrandQuery, Pagination, ReviewInput, SearchInput } from '../../API';
import { getBrand, getBrandGalleryPhotos, listBrands } from '../../custom_graphql/queries';
import { reviewEntity, updateReviewEntity } from '../../graphql/mutations';
import { search } from '../../graphql/queries';
import { graphqlAuthenticationOperation, requestGraphqlOperation } from '../../utils';
import { UpdateReviewEntity } from '../professionals/types';
import { GetBrandFromApiType, GetSearchBrandsFromApiType, listBrandsFromApiType, ReviewEntity } from './types';

export const listBrandsFromApi = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(listBrands, { input })) as listBrandsFromApiType;
  return response.data.listBrands;
};
export const getBrandFromApi = async ({ id }: { id: string }) => {
  const gqlOperation = requestGraphqlOperation;
  // the limit is a fixed number, because the design doesn't have the pagination option for each list
  const response = (await gqlOperation(getBrand, { id, input: { offset: 0, limit: 30 } })) as { data: GetBrandQuery };
  return response.data.getBrand;
};

export const getBrandGalleryPhotosFromApi = async ({ id, input }: { id: string; input: Pagination }) => {
  const gqlOperation = requestGraphqlOperation;
  // the limit is a fixed number, because the design doesn't have the pagination option for each list
  const response = (await gqlOperation(getBrandGalleryPhotos, {
    id,
    input,
  })) as GetBrandFromApiType;
  return response.data.getBrand.images;
};

export const brandSearch = async (input: SearchInput) => {
  const response = (await requestGraphqlOperation(search, { input })) as GetSearchBrandsFromApiType;
  return response.data.search;
};

export const reviewBrand = async (input: ReviewInput) => {
  const response = (await API.graphql(graphqlAuthenticationOperation(reviewEntity, { input }))) as ReviewEntity;
  return response.data.reviewEntity;
};

export const editStoreReview = async (input: ReviewInput) => {
  const response = (await API.graphql(
    graphqlAuthenticationOperation(updateReviewEntity, { input })
  )) as UpdateReviewEntity;
  return response.data.updateReviewEntity;
};
