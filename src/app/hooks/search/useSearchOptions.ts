import { useReducer } from 'react';
import { useRecentSearchParam } from './useRecentSearchParam';
import { QueryStringKeys, UrlQueryPair, joinUrlParams } from './useSearchQuery';

export enum SortMethod {
  DEFAULT = '',
  MOST_SEARCHED = 'most_searched',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  HIGHEST_PRICE = 'price_desc',
  LOWEST_PRICE = 'price_asc',
  HIGHER_RATE = 'HIGHER_RATE',
  RECENTLY_JOINED = 'RECENTLY_JOINED',
  VERIFIED = 'VERIFIED',
}

export const DEFAULT_SEARCH_OPTIONS: SearchOptionsState = {
  offset: 0,
  recordsLimit: 15,
  sortMethod: SortMethod.DEFAULT,
};

export enum SearchOptionsActionKind {
  SET_OFFSET = 'SET_OFFSET',
  SET_RECORDS_LIMIT = 'SET_RECORDS_LIMIT',
  SET_SORT_METHOD = 'SET_SORT_METHOD',
}

interface SearchOptionsAction {
  type: SearchOptionsActionKind;
  payload: number | string | SortMethod | string[];
}

export interface SearchOptionsState {
  offset: number;
  recordsLimit: number;
  sortMethod: SortMethod;
}

const searchReducer = (state: SearchOptionsState, action: SearchOptionsAction): SearchOptionsState => {
  switch (action.type) {
    case SearchOptionsActionKind.SET_OFFSET:
      return {
        ...state,
        offset: action.payload as number,
      };

    case SearchOptionsActionKind.SET_RECORDS_LIMIT:
      return { ...state, recordsLimit: action.payload as number };

    case SearchOptionsActionKind.SET_SORT_METHOD:
      return { ...state, sortMethod: action.payload as SortMethod };

    default:
      return state;
  }
};

export const getDefaultSearchOptionsQueryParams = () => {
  return joinUrlParams([
    UrlQueryPair({ key: QueryStringKeys.OFFSET, value: DEFAULT_SEARCH_OPTIONS.offset.toString() }),
    UrlQueryPair({ key: QueryStringKeys.LIMIT, value: DEFAULT_SEARCH_OPTIONS.recordsLimit.toString() }),
  ]);
};

export const useSearchOptions = (searchOptions: SearchOptionsState = DEFAULT_SEARCH_OPTIONS) => {
  const [state, dispatch] = useReducer(searchReducer, searchOptions);

  const setOffset = (offset: number) => {
    dispatch({
      type: SearchOptionsActionKind.SET_OFFSET,
      payload: offset,
    });
  };

  const setRecordsLimit = (limit: number) => {
    dispatch({ type: SearchOptionsActionKind.SET_RECORDS_LIMIT, payload: limit });
  };

  const setSortMethod = (method: SortMethod) => {
    dispatch({ type: SearchOptionsActionKind.SET_SORT_METHOD, payload: method });
  };

  const { updateSearchParamsFromUrl: updateOffsetSearchParamsFromUrl } = useRecentSearchParam(
    QueryStringKeys.OFFSET,
    (offsetParams) => {
      if (offsetParams.length > 0) {
        const offset = parseInt(offsetParams[0]);
        if (offset !== state.offset) {
          setOffset(offset);
        }
      }
    }
  );

  const { updateSearchParamsFromUrl: updateLimitSearchParamsFromUrl } = useRecentSearchParam(
    QueryStringKeys.LIMIT,
    (limitParams) => {
      if (limitParams.length > 0) {
        const limit = parseInt(limitParams[0]);
        if (limit !== state.recordsLimit) {
          setRecordsLimit(limit);
        }
      }
    }
  );

  const { updateSearchParamsFromUrl: updateSortSearchParamsFromUrl } = useRecentSearchParam(
    QueryStringKeys.SORT_METHOD,
    (sortParams) => {
      if (sortParams.length > 0) {
        if (sortParams[0] !== state.sortMethod) {
          setSortMethod(sortParams[0] as SortMethod);
        }
      }
    }
  );

  const getCurrentPage = () => {
    if (state.offset == 0) {
      return 1;
    }
    return state.offset / state.recordsLimit + 1;
  };

  const updateSearchOptionsFromUrl = () => {
    updateOffsetSearchParamsFromUrl();
    updateLimitSearchParamsFromUrl();
    updateSortSearchParamsFromUrl();
  };

  return {
    searchOptions: state,
    getCurrentPage,
    setOffset,
    setRecordsLimit,
    setSortMethod,
    updateSearchOptionsFromUrl,
  };
};
