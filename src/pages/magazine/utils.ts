import { Client, Magazine } from '../../API';
import { COMMENTS_TEXT, PROFESSIONAL } from '../../app/settings';
import { checkEmptySimpleString, getUserName, replaceSpaceWithDash } from '../../utils';
import { GENERIC_MAGAZINE_ROUTE } from '../../utils/routes';
import { EntityTabsFilters, MagazineFilters } from './constants';

export const getTab = (id: string) => {
  switch (id) {
    case MagazineFilters.New:
      return EntityTabsFilters.FEATURED;
    case MagazineFilters.Popular:
      return EntityTabsFilters.POPULAR;
    case MagazineFilters.Latest:
      return EntityTabsFilters.LATEST;
  }
};

export const getArticlePath = (magazine: Magazine) => {
  return `${GENERIC_MAGAZINE_ROUTE}/${replaceSpaceWithDash(magazine?.title!)}/${magazine?.id}`;
};

export const getArticleWithCommentsPath = (magazine: Magazine) => {
  return `${GENERIC_MAGAZINE_ROUTE}/${replaceSpaceWithDash(magazine?.title!)}/${magazine?.id}#${COMMENTS_TEXT}`;
};

export const getAutherProfile = (client: Client) => {
  if (client.type == PROFESSIONAL) {
    const clientName = checkEmptySimpleString(getUserName(client!));
    return `/professional/${clientName}/${client.id}`;
  } else {
    return `/client/${client.id}`;
  }
};
