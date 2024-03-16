import { GetBannerDetailsQuery, ListDepartmentsQuery, ListHomePageSpecialStockRecordsQuery } from '../../../API';

export interface Department {
  id: string;
  title: string;
  description?: string;
  photo_url: string;
  slug?: string;
  products_count?: string;
  sub_departments?: Departments;
  filters?: [];
}

export interface Departments {
  results: Department[];
  count?: string;
}

export interface DepartmentsBanner {
  title: string;
  photo_url: string;
  sub_title: string;
  description?: string;
  button_title: string;
}

export interface ListDepartmentsFromApi {
  data: ListDepartmentsQuery;
}

export interface GetBannerDetails {
  data: GetBannerDetailsQuery;
}

export interface ListHomePageSpecialStockRecords {
  data: ListHomePageSpecialStockRecordsQuery;
}
