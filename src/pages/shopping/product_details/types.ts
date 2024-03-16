import { GetStockRecordQuery, ListProductSlidersQuery } from '../../../API';

export interface GetProductDetails {
  data: GetStockRecordQuery;
}

export interface ListProductSlidersFromApi {
  data: ListProductSlidersQuery;
}
