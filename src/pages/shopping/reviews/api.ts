import * as queries from '../../../graphql/queries';
import * as customQueries from '../../../custom_graphql/queries';
import * as mutations from '../../../graphql/mutations';
import { requestAuthGraphqlOperation } from '../../../utils';
import {
  DetailedScoreList,
  ListDetailedScoreQuery,
  List_stockrecord_reviews_aggregationQuery,
  Pagination,
  ProductReviewInput,
  StockRecordReviewsAggregationResult,
} from '../../../API';
import { GetProductReviewsFromApi } from './types';

export const listProductReviews = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(queries.listProductReviewsByStockRecordId, {
    input,
  })) as GetProductReviewsFromApi;
  return response.data.listProductReviewsByStockRecordId;
};

export const listDetailedScore = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(queries.listDetailedScore, { input })) as {
    data: ListDetailedScoreQuery;
  };

  return response.data.listDetailedScore.results;
};

export const addProductReview = async (input: ProductReviewInput) => {
  const response = (await requestAuthGraphqlOperation(mutations.addProductReview, { input })) as {
    data: ProductReviewInput;
  };
  return response.data;
};

export const list_stockrecord_reviews_aggregation = async (input: Pagination) => {
  const response = (await requestAuthGraphqlOperation(queries.list_stockrecord_reviews_aggregation, { input })) as {
    data: List_stockrecord_reviews_aggregationQuery;
  };
  return response.data.list_stockrecord_reviews_aggregation;
};

export const updateProductReview = async (input: ProductReviewInput) => {
  const response = (await requestAuthGraphqlOperation(mutations.updateProductReview, { input })) as {
    data: ProductReviewInput;
  };
  return response.data;
};
