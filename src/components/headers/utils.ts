import { getLanguageFromStorage } from '../../utils';
import { MenuItem } from '../../app/providers/types';
import { AR } from '../../locales/constants';
import { replaceSpace } from '../../pages/ideas/utils';
import { Category } from '../../API';

export const getMenuIcon = (item: MenuItem, isSelected: boolean) => {
  return isSelected ? item.image.purple_icon : item.image.icon;
};

export const getLanguageFromURL = (location: string) => {
  const firstParam = location?.split('&')[0];
  const isLanguage = firstParam.includes('lang');
  const langFromUrl = isLanguage && firstParam?.split('=')[1];
  return langFromUrl || getLanguageFromStorage() || AR;
};

export const getSearchPagePath = (item: Category) => {
  return `/ideas/?q=&c=${replaceSpace(item.title!)}`;
};
