import { useEffect, useReducer, useState } from 'react';
import { useRecentSearchParam } from './useRecentSearchParam';
import { QueryStringKeys } from './useSearchQuery';

export const categoriesDelim = ',';

export enum SearchCategoryActionKind {
  SET_CATEGORIES = 'SET_CATEGORIES',
  DELETE_CATEGORIES = 'DELETE_CATEGORIES',
  CLEAR_CATEGORIES = 'CLEAR_CATEGORIES',
}

interface SearchCategoryAction {
  type: SearchCategoryActionKind;
  payload: string[];
}

interface SearchCategoryState {
  categories: string[];
}

const categoriesReducer = (state: SearchCategoryState, action: SearchCategoryAction): SearchCategoryState => {
  switch (action.type) {
    case SearchCategoryActionKind.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };

    case SearchCategoryActionKind.CLEAR_CATEGORIES:
      return {
        categories: [],
      };

    case SearchCategoryActionKind.DELETE_CATEGORIES:
      return {
        categories: state.categories.filter((category) => !action.payload.includes(category)),
      };
  }
  return state;
};
/**
 * note: categories search doesn't support comma separated list of categories,
 * pick most specific on seach.
 */
export const useSearchCategories = (categories: string[] = []) => {
  const [state, dispatch] = useReducer(categoriesReducer, { categories });
  const [initCategories, setInitCategories] = useState<string[]>([]);

  const setCategories = (categories: string[]) => {
    dispatch({
      type: SearchCategoryActionKind.SET_CATEGORIES,
      payload: categories,
    });
  };

  const deleteCategories = (categories: string[]) => {
    dispatch({
      type: SearchCategoryActionKind.DELETE_CATEGORIES,
      payload: categories,
    });
  };

  const clearCategories = () => {
    dispatch({ type: SearchCategoryActionKind.CLEAR_CATEGORIES, payload: [] });
  };

  const { updateSearchParamsFromUrl } = useRecentSearchParam(
    QueryStringKeys.CATEGORIES,
    (newCategories) => {
      if (newCategories === null) {
        setCategories([]);
      } else {
        const categories = newCategories.map((cats) => cats.split(categoriesDelim)).flat();
        if (state.categories.sort().join() !== newCategories.sort().join()) {
          setCategories(categories);
        }
      }
    },
    (initCategories) => {
      setInitCategories(initCategories);
      setCategories(initCategories);
    }
  );

  return {
    categories: state.categories,
    setCategories,
    clearCategories,
    updateCategoriesSearchParamsFromUrl: updateSearchParamsFromUrl,
    deleteCategories,
    initCategories,
  };
};
