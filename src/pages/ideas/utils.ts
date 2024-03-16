import { RouterHistory } from '@sentry/react/dist/reactrouter';
import { TFunction } from 'i18next';
import {
  CATEGORIES,
  CATEGORY,
  CLIENT,
  FILTERS,
  NEWEST as newest,
  OLDEST as oldest,
  MOST_SEARCHED as most_searched,
  TITLE,
} from '../../app/settings';
import { EntityTags } from '../../components/idea/types';
import {
  BRANDS,
  DISCUSSION,
  DISCUSSIONS_SEARCH,
  IDEA,
  LATEST,
  MAGAZINE,
  MAGAZINES,
  MOST_SEARCHED,
  OLDEST,
  PRODUCTS,
  PROFESSIONAL,
  PROFESSIONALS,
  SEARCH_IDEAS,
  TVS,
} from '../../locales/strings';
import { replaceSpaceWithDash } from '../../utils';
import {
  DISCUSSION_ROUTE,
  GENERIC_MAGAZINE_ROUTE,
  PROFESSIONALS_ROUTE,
  PROFESSIONAL_PUBLIC_ROUTE,
  TV_ROUTE,
} from '../../utils/routes';
import { AutoCompleteKeyObject } from './types';
import { SearchSortBy } from '../../API';

export const getSelectValue = (dataList: string[], title: string) => {
  if (dataList && dataList.find((e) => e) && dataList?.length > 0) {
    return `${title} (${dataList.length}) `;
  }
  return title;
};

export const getReplaceableValue = (values: string, txt: string) => {
  if (values.split('-').length == 1) {
    return txt;
  } else if (values.indexOf(txt) == 0) {
    return `${txt}-`;
  } else {
    return `-${txt}`;
  }
};

export const replaceSpace = (value: string | undefined | null): string => {
  if (value && typeof value === 'string') {
    return value.toLowerCase().replaceAll(/\s+/g, '+');
  } else {
    // Handle cases where value is null, undefined, or not a string
    return '';
  }
};

export const getLastWordInString = (text: string) => {
  if (text) {
    const n = text.split(' ');
    return n[n.length - 1];
  }
};

export const getValueLowerCase = (value: string) => {
  if (value && typeof value == 'string') {
    return value.toLowerCase();
  }
};

export const getUrlFilters = (value: string) => {
  return value.substring(value.indexOf('f=') + 2, value.lastIndexOf('&o'));
};

export const convertUrlFiltersToObject = (filters: string) => {
  if (filters) {
    const mainKeys = filters.split('&');
    const result = mainKeys.map((elm) => {
      const value = decodeURI(elm)?.split('=');
      const key = value[0]?.replace('-', ' ');
      const keyValues = value[1]?.split(',');
      return { [key]: keyValues };
    });
    return Object.assign({}, ...result);
  }
  return {};
};

export const getAutoCompleteKeyBasedOnLanguage = (key: string, t: TFunction) => {
  switch (key) {
    case EntityTags.MAGAZINES:
      return t(MAGAZINES);
    case EntityTags.TVS:
      return t(TVS);
    case EntityTags.DISCUSSIONS:
      return t(DISCUSSIONS_SEARCH);
    case EntityTags.PROFESSIONALS:
      return t(PROFESSIONALS);
    case EntityTags.PRODUCTS:
      return t(PRODUCTS);
    case EntityTags.BRANDS:
      return t(BRANDS);
    default:
      return t(SEARCH_IDEAS);
  }
};

export const getAutoValueSuffixBasedOnLanguage = (key: string, t: TFunction) => {
  switch (key) {
    case EntityTags.MAGAZINES:
      return t(MAGAZINE);
    case EntityTags.TVS:
      return t(TVS);
    case EntityTags.DISCUSSIONS:
      return t(DISCUSSION);
    case EntityTags.PROFESSIONALS:
      return t(PROFESSIONAL);
    case EntityTags.PRODUCTS:
      return t(PRODUCTS);
    case EntityTags.BRANDS:
      return t(BRANDS);
    default:
      return t(IDEA);
  }
};
export const getHighlightedTexts = (value: string) => {
  return value.match(/<b>(.*?)<\/b>/g)?.map((elm) => elm.replace(/<\/?b>/g, ''));
};

export const getValueWithoutTags = (value: string) => {
  return value.replace(/<[^>]+>/g, '');
};

export const getSearchURL = (history: RouterHistory, value: string, key: string) => {
  history.push(`/ideas?q=${getValueWithoutTags(value)}&f=&o=0&i=${key}`);
};

export const getProfessionalRedirectPath = (history: RouterHistory, value: AutoCompleteKeyObject) => {
  if (value.key == CATEGORIES) {
    history.push(`${PROFESSIONALS_ROUTE}/?q=&c=${replaceSpace(getValueWithoutTags(value.title))}&f=&o=0&l=10`);
  } else if (value.key == CLIENT) {
    history.push(`${PROFESSIONAL_PUBLIC_ROUTE}/${replaceSpaceWithDash(getValueWithoutTags(value.title))}/${value.key}`);
  } else {
    history.push(`${PROFESSIONALS_ROUTE}/?q=${getValueWithoutTags(value.title)}&c=&f=&o=0&l=10`);
  }
};

export const getIdeasRedirectPath = (history: RouterHistory, value: AutoCompleteKeyObject, key: string) => {
  if (value.key == TITLE) {
    history.push(`/idea/${replaceSpaceWithDash(getValueWithoutTags(value.title))}/${value.key}/${value.key}`);
  } else if (value.key == CATEGORIES || value.key == FILTERS) {
    history.push(`/ideas?q=&c${getValueWithoutTags(value.title)}&f=&o=0&i=${key}`);
  } else {
    history.push(`/ideas?q=${getValueWithoutTags(value.title)}&f=&o=0&i=${key}`);
  }
};

export const getMagazineRedirectPath = (history: RouterHistory, value: AutoCompleteKeyObject, key: string) => {
  if (value.key == TITLE) {
    history.push(`${GENERIC_MAGAZINE_ROUTE}/${replaceSpaceWithDash(getValueWithoutTags(value.title))}/${value.key}`);
  } else {
    // this is just for now until we have magazine search page
    getSearchURL(history, value.title, key);
  }
};

export const getTVsRedirectPath = (history: RouterHistory, value: AutoCompleteKeyObject, key: string) => {
  if (value.key == TITLE) {
    history.push(`${TV_ROUTE}/${replaceSpaceWithDash(getValueWithoutTags(value.title))}/${value.key}`);
  } else {
    // this is just for now until we have tv search page
    getSearchURL(history, value.title, key);
  }
};

export const getDiscussionsRedirectPath = (history: RouterHistory, value: AutoCompleteKeyObject, key: string) => {
  if (value.key == TITLE) {
    history.push(`${DISCUSSION_ROUTE}/${replaceSpaceWithDash(getValueWithoutTags(value.title))}/${value.key}`);
  } else {
    // this is just for now until we have discussion search page
    getSearchURL(history, value.title, key);
  }
};

// @TODO: handle the color schema in another way by handling the 2 lang.
export const colorsHexCode: { [key: string]: string } = {
  أصفر: '#FFFF00',
  بني: '#964B00',
  أخضر: '#008000',
  رمادي: '#808080',
  فيروزي: '#40e0d0',
  أزرق: '#0000FF',
  برتقالي: '#FFA500',
  أسود: '#000000',
  بيج: '#F5F5DC',
  زيتوني: '#808000',
  أرجواني: '#FF00FF',
  أحمر: '#FF0000',
  وردي: '#FFC0CB',
  أبيض: '#FFFFFF',
  بنفسجي: '#800080',
  نحاسي: '#944400',
  فضي: '#c9c0bb',
  'أزرق مائل للخضرة': '#00FFFF',
  برونزي: '#CD7F32',
  كشميري: '#D2691E',
  خمري: '#800000',
  كروم: '#D4AF37',
  فخاري: '#B87333',
  شفاف: '#F5F5DC',
  قهوة: '#964B00',
  كريمي: '#F5F5DC',
  'ازرق غامق': '#0000FF',
  'بني غامق': '#964B00',
  'ذهبي مطفي': '#D4AF37',
  'اخضر غامق': '#008000',
  'رمادي غانق': '#808080',
  'زهري غامق': '#FF00FF',
  'رمادي غامق': '#808080',
  ذهبي: '#FFD700',
  بندقي: '#008080',
  نيلي: '#F0FFFF',
  عاجي: '#800080',
  لافندر: '#E6E6FA',
  'بيج فاتح': '#F5F5DC',
  'ازرق فاتح': '#ADD8E6',
  'اخضر فاتح': '#90EE90',
  'رمادي فاتح': '#D3D3D3',
  'زيتوني فاتح': '#808000',
  ليلكي: '#F8F8FF',
  ليموني: '#FFFACD',
  'اسود مطفي': '#000000',
  'كروم مطفي': '#D4AF37',
  مرآة: '#F5F5DC',
  موتشا: '#FFE4B5',
  خردلي: '#FFDEAD',
  طبيعي: '#F5F5DC',
  'ازرق داكن': '#0000FF',
  كحلي: '#FFF8DC',
  'أبيض فاتح': '#F5F5DC',
  خوخي: '#FFC0CB',
  صنوبر: '#FAF0E6',
  قرنفلي: '#FFF0F5',
  بستاشيو: '#FFE4E1',
  'ذهبي روز': '#FFD700',
  سلمون: '#FA8072',
  اصفر: '#FFFF00',
  'رمادي بني': '#808080',
  زبرجدي: '#FFD700',
  تركوازي: '#40E0D0',
  جوز: '#D2691E',
  'اوف وايت': '#F5F5DC',
  قمحي: '#F5DEB3',
  خشبي: '#DEB887',
  amber: '#ffbf00',
  'antique copper': '#944400',
  'antique silver': '#c9c0bb',
  'aqua blue': '#00ffff',
  'assorted colors': '#ffffff',
  beech: '#f5deb3',
  beige: '#f5f5dc',
  black: '#000000',
  blue: '#0000ff',
  brass: '#b5a642',
  bronze: '#cd7f32',
  brown: '#a52a2a',
  cashmere: '#e6be8a',
  champagne: '#f7e7ce',
  charcoal: '#36454f',
  chrome: '#e8e8e8',
  cinnamon: '#d2691e',
  clay: '#8c5a3c',
  clear: '#ffffff',
  coffee: '#6f4e37',
  'concrete grey': '#898f8c',
  copper: '#b87333',
  cream: '#fffdd0',
  'dandelion cream': '#f5d0c9',
  'dark beige': '#a17f68',
  'dark blue': '#00008b',
  'dark brown': '#654321',
  'dark gold': '#b8860b',
  'dark green': '#006400',
  'dark grey': '#a9a9a9',
  'dark pink': '#e75480',
  'dove grey': '#6d6d6d',
  'drak grey': '#a9a9a9',
  gery: '#808080',
  gold: '#ffd700',
  gray: '#808080',
  green: '#008000',
  grey: '#808080',
  hazel: '#8e7618',
  indigo: '#4b0082',
  ivory: '#fffff0',
  lavender: '#e6e6fa',
  'light beige': '#f5f5dc',
  'light blue': '#add8e6',
  'light brown': '#cd853f',
  'light gray': '#d3d3d3',
  'light green': '#90ee90',
  'light grey': '#d3d3d3',
  'light olive': '#808000',
  'light pink': '#ffb6c1',
  lilac: '#c8a2c8',
  'lilac purple': '#807bbb',
  lime: '#00ff00',
  maroon: '#800000',
  marsala: '#964f4c',
  'matt black': '#1c1c1c',
  'matt chrome': '#c6c6c6',
  'matt gold': '#d4af37',
  'mercury grey': '#e5e5e5',
  'mint green': '#98ff98',
  mirror: '#c8c8c8',
  mocha: '#462e01',
  moss: '#8a9a5b',
  multi: '#ffffff',
  multicolor: '#ffffff',
  mustard: '#ffdb58',
  natural: '#f0e68c',
  navy: '#000080',
  'navy blue': '#000080',
  oak: '#f0dba2',
  'off white': '#f5f5f5',
  olive: '#808000',
  orange: '#ffa500',
  'pastel pink': '#ffd1dc',
  peach: '#ffe5b4',
  'pearl ivory': '#f0ead6',
  'pearl white': '#f5f5f5',
  'pewter grey': '#828282',
  pine: '#01796f',
  pink: '#ffc0cb',
  pistachio: '#93c572',
  purple: '#800080',
  red: '#ff0000',
  rgb: '#ffffff',
  rose: '#ff007f',
  'rose gold': '#b76e79',
  salmon: '#fa8072',
  'sand beige': '#c2b280',
  silver: '#c0c0c0',
  'silver mirror': '#c0c0c0',
  'slate grey': '#708090',
  'straw yellow': '#f7e55e',
  taupe: '#483c32',
  teal: '#008080',
  tiffany: '#0abab5',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  walnut: '#773f1a',
  'warm white': '#f5deb3',
  wheat: '#f5deb3',
  white: '#ffffff',
  wood: '#8b5a2b',
  yellow: '#ffff00',
};

export const getColorValue = (name?: string) => {
  if (!name) {
    return '';
  }
  return colorsHexCode[name.toLowerCase()];
};

export const sortData = [
  { value: SearchSortBy.MostRecent, label: LATEST },
  { value: SearchSortBy.Relevance, label: OLDEST },
  { value: SearchSortBy.MostLiked, label: MOST_SEARCHED },
];
