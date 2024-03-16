import { ListDepartmentsBySlugQuery, ListDepartmentStockRecordsQuery } from '../../../API';

export interface Color {
  photo_url: string;
  color: string;
}

export interface Specification {
  key: string;
  specification: string;
  value: string;
}

export interface Category {
  title: string;
  photo: string;
  slug: string;
}

export interface Product {
  name: string;
  main_photo_url: string;
  slider_photos_url?: string[];
  client: {
    last_name: string;
    first_name: string;
  };
  price: number;
  reviews_total: number;
  extra?: string[];
  colors?: Color[];
  sizes?: string[];
  status: {
    color: string;
    text: string;
  };
  previous_price?: number;
  item_number_left?: number;
  shipping_days?: { from: number; to: number };
  quantity?: number[];
  description?: string;
  specifications?: Specification[];
  shipping?: string;
}

export interface ListDepartmentBySlug {
  data: ListDepartmentsBySlugQuery;
}

export interface ListDepartmentStockRecords {
  data: ListDepartmentStockRecordsQuery;
}
