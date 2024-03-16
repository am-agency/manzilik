import { Category, City, Client, GalleryPhotoList, ReviewEntityMutation, SearchQuery, Service } from '../../API';
export interface BrandImage {
  photo: string;
}
export interface Store {
  __typename: 'Brand';
  id: string;
  created_at?: string | null;
  updated_at?: string | null;
  name: string;
  phoneNumber: string;
  mobile: { country_code: string; mobile_number: string };
  title: string;
  description: string;
  website: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  type: BrandType;
  rate: number;
  rates_count: number;
  rank: number;
  tags: { count: number; results: BrandTag[] };
  images: { count: number; results: BrandImage[] };
  arabic_description: string;
  english_description: string;
}

export interface SearchStore {
  __typename: 'Brand';
  id: string;
  created_at?: string | null;
  updated_at?: string | null;
  name: string;
  phoneNumber: string;
  mobile: { country_code: string; mobile_number: string };
  title: string;
  description: string;
  website: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  type: BrandType;
  rate: number;
  rates_count: number;
  rank: number;
  tags: BrandTag[];
  images: BrandImage[];
}

export interface BrandTag {
  english_title: string;
  arabic_title: string;
  title: string;
}

export enum BrandType {
  LOCAL = 'LOCAL',
  GLOBAL = 'GLOBAL',
}

export interface TagsState {
  hasTags: boolean;
  storeTags: BrandTag[];
}

export interface listBrandsFromApiType {
  data: {
    listBrands: {
      results: Store[];
    };
  };
}

export interface GetSearchBrandsFromApiType {
  data: SearchQuery;
}
export interface GetBrandFromApiType {
  data: {
    getBrand: Store;
  };
}
export interface ReviewEntity {
  data: ReviewEntityMutation;
}
