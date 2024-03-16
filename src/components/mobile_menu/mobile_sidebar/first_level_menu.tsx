import { headerIcons } from '../../../assets/icons/header';
import {
  BRANDS,
  DISCUSSIONS,
  GET_IDEAS,
  MAGAZINES,
  MANZILIK_AI_TAB,
  PROFESSIONALS,
  PROJECTS,
  SERVICES,
  SHOPPING,
  TV,
} from '../../../locales/strings';
import {
  BRANDS_ROUTE,
  DISCUSSIONS_ROUTE,
  MAGAZINES_ROUTE,
  PRODUCTS_MAIN_ROUTE,
  PROFESSIONALS_ROUTE,
  PROJECTS_ROUTE,
  REQUEST_GIG_SERVICE_ROUTE,
  TV_ROUTE,
} from '../../../utils/routes';
import { MenuItemsElements } from '../../headers/menu_items';

export const firstLevelMenu: MenuItemsElements[] = [
  { icon: headerIcons.ideas_dark, label: GET_IDEAS, withChildren: true },
  { icon: headerIcons.prof_dark, label: PROFESSIONALS, link: PROFESSIONALS_ROUTE, withChildren: false },

  {
    icon: headerIcons.discuss_dark,
    label: DISCUSSIONS,
    link: DISCUSSIONS_ROUTE,
    withChildren: false,
  },
  { icon: headerIcons.magazine_dark, label: MAGAZINES, link: MAGAZINES_ROUTE, withChildren: false },
  { icon: headerIcons.brands_dark, label: BRANDS, link: BRANDS_ROUTE, withChildren: false },
  { icon: headerIcons.tv_dark, label: TV, link: TV_ROUTE, withChildren: false },
];
