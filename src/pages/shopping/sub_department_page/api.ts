import * as queries from '../../../graphql/queries';
import * as customQueries from '../../../custom_graphql/queries';
import { Pagination } from '../../../API';
import { ListDepartmentBySlug, ListDepartmentStockRecords } from './types';
import { requestGraphqlOperation } from '../../../utils';
import { ListDepartmentsFromApi } from '../departments_page/types';

export const listDepartmentBySlug = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listDepartmentsBySlug, {
    input,
  })) as ListDepartmentBySlug;
  return response.data.listDepartmentsBySlug;
};

export const listDepartments = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listDepartments, { input })) as ListDepartmentsFromApi;
  return response.data.listDepartments;
};

export const listDepartmentStockRecords = async (input: Pagination) => {
  const response = (await requestGraphqlOperation(customQueries.listDepartmentStockRecords, {
    input,
  })) as ListDepartmentStockRecords;
  return response.data.listDepartmentStockRecords;
};
