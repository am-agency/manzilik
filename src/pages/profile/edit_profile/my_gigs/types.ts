import { Professional } from '../../../../API';

export interface GigsListItem {
  id: string;
  title: string;
  description: string;
  price: number;
  photos: string[];
  is_enabled: boolean;
  services: GigsListService[];
  cities: GigsListCities[];
}

export interface GigItemInput {
  id?: string;
  title: string;
  description: string;
  price: number;
  photos: string[];
  is_enabled: boolean;
  services: string[];
  cities: string[];
}
export interface GigItemOutput {
  id: string;
  title: string;
  description: string;
  price: number;
  photos: string[];
  is_enabled: boolean;
  services: GigsListService[];
  cities: GigsListCities[];
  professional: Professional;
}
export interface GigsListService {
  created_at: string;
  id: string;
  image: string;
  title: string;
  updated_at: string;
}

export interface GigsListCities {
  id: string;
  name: string;
  region_id: string;
  country_id: string;
}

export enum SubmitServiceRequestStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  NOT_SENT = 'NOT_SENT',
}

export enum PageViews {
  LIST = 'list',
  ADD = 'add',
  EDIT = 'edit',
}
