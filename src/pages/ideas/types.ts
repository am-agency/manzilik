import {
  AutoCompleteObjectsQuery,
  GetCategoryQuery,
  Idea,
  ListCategoriesQuery,
  ListFiltersQuery,
  SearchQuery,
  StockRecordList,
} from '../../API';

export interface SearchIdeas {
  id: string;
  idea: Idea;
}

export interface SearchIdeasResult {
  ideas: SearchIdeas[];
  total: number;
}

export interface GetSearchIdeasFromApi {
  data: SearchQuery;
}

export interface GetFiltersFromApi {
  data: ListFiltersQuery;
}

export interface ListCategoriesFromApi {
  data: ListCategoriesQuery;
}

export interface GetCategoryFromApi {
  data: GetCategoryQuery;
}

export interface GetAutoCompleteFromApi {
  data: AutoCompleteObjectsQuery;
}

export interface AutoCompleteKeyObject {
  id: string;
  key_id: string;
  key: string;
  title: string;
}
export interface ListRelatedStockRecordsFromApi {
  data: StockRecordList;
}

export interface ListRelatedStockRecordsResponse {
  data: {
    listRelatedStockRecords: StockRecordList;
  };
}
