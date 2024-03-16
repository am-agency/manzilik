import { AddProductToBasketInput, AddProductToBasketMutation, Pagination } from '../../../API';
import { WEB } from '../../../app/settings';
import * as customQueries from '../../../custom_graphql/queries';
import * as mutation from '../../../graphql/mutations';
import { requestAuthGraphqlOperation, requestGraphqlOperation } from '../../../utils';
import { GetProductDetails, ListProductSlidersFromApi } from './types';

export const getStockRecord = async (id: string) => {
  const response = (await requestGraphqlOperation(customQueries.getStockRecord, id)) as GetProductDetails;
  return response.data.getStockRecord;
};

export const listProductSliders = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listProductSliders, {
    input: {
      ...input,
      platform: WEB,
    },
  })) as ListProductSlidersFromApi;
  return response.data.listProductSliders;
};

export const addProductToBasket = async (input: AddProductToBasketInput) => {
  const response = (await requestAuthGraphqlOperation(mutation.addProductToBasket, { input })) as {
    data: AddProductToBasketMutation;
  };
  return response.data.addProductToBasket;
};
