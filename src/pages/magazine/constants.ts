import { LATEST_FROM_MANZILIK, MOST_POPULAR, NEW_THIS_WEEK, POPULAR } from '../../locales/strings';
import { StaticMagazineTabs } from './types';

export enum MagazineFilters {
  Latest = 'latest',
  Popular = 'popular',
  New = 'new',
}

export enum EntityDateTypeFilters {}
export enum EntityTabsFilters {
  LATEST = 'LATEST',
  POPULAR = 'POPULAR',
  FEATURED = 'FEATURED',
  UNANSWERED = 'UNANSWERED',
}

export const staticMagazineTabs: StaticMagazineTabs = {
  latest: { __typename: 'Category', id: 'latest', title: LATEST_FROM_MANZILIK },
  popular: { __typename: 'Category', id: 'popular', title: MOST_POPULAR },
  new: { __typename: 'Category', id: 'new', title: NEW_THIS_WEEK },
};
