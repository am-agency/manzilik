import { Category, City, Region, Service } from '../../API';
import { LOCATION, PROFESSIONAL_ROOM, REGION, REVIEW, SERVICES } from '../../locales/strings';
import { TagsMetaItem, TagsState } from './types';
import parsePhoneNumber from 'libphonenumber-js';

export const getFloatRoundUp = (totalReview: number) => {
  if (totalReview) {
    return parseFloat(totalReview?.toString()!).toFixed(1);
  } else {
    return '0.0';
  }
};

export const getFloatRoundDown = (totalReview: number) => {
  if (totalReview) {
    return parseFloat(totalReview?.toString()!).toFixed(0);
  } else {
    return '0';
  }
};

/**
 *
 * @param categories categories List
 * @param values : ids of categories
 * @returns list of categories titles
 */
export const getCategoriesMatchedTitles = (categories: Category[], values: string[]) => {
  const categoriesTitle = categories.filter((elm) => values?.includes(elm.id!));
  return categoriesTitle.map((elm) => elm.title);
};

/**
 *
 * @param locations locations list
 * @param values ids of locations
 * @returns list of locations names
 */
export const getLocationsMatchedTitles = (locations: City[], values: string[]) => {
  const categoriesTitle = locations.filter((elm) => values?.includes(elm.id!));
  return categoriesTitle.map((elm) => elm.name);
};

/**
 *
 * @param categories categories List
 * @param values : categories titles
 * @returns list of categories ids
 */
export const getCategoriesMatchedIds = (categories: Category[], values: string[]) => {
  const categoriesTitle = categories.filter((elm) =>
    values.find((e) => e.replaceAll(/\+/gi, ' ').toLowerCase() === elm.title?.toLowerCase())
  );
  return categoriesTitle.map((elm) => elm.id);
};

/**
 * It takes a string, replaces all the plus signs with spaces, and returns the string in lowercase
 * @param {string} str - string - This is the string that we want to add spaces to.
 * @returns  returns a string with all the plus signs
 * replaced with spaces and the string is lowercased.
 */
export const addSpace = (str: string) => {
  const finalString = str.replaceAll(/\+/gi, ' ').toLowerCase();
  return finalString;
};
/** @TODO Abstract these functions into one */
/**
 *
 * @param categories locations List
 * @param values : locations titles
 * @returns list of locations ids
 */
export const getLocationsMatchedIds = (locations: City[], values: string[]) => {
  const locationsTitle = locations.filter((elm) => values.find((e) => e.toLowerCase() === elm.name?.toLowerCase()));
  return locationsTitle.map((elm) => elm.id);
};

export const getRegionsMatchedIds = (regions: Region[], values: string[]) => {
  const regionsTitle = regions.filter((elm) => values.find((e) => e.toLowerCase() === elm.name?.toLowerCase()));
  return regionsTitle.map((elm) => elm.id);
};

/**
 *
 * @param categories services List
 * @param values : services titles
 * @returns list of services ids
 */
export const getServicesMatchedIds = (services: Service[], values: string[]) => {
  const locationsTitle = services.filter((elm) => values.find((e) => e.toLowerCase() === elm.title?.toLowerCase()));
  return locationsTitle.map((elm) => elm.id);
};

/**
 * It takes in a state object and an object of arrays of objects, and returns an array of objects
 * @param {TagsState} tagsState - TagsState
 * @param  - tagsState: TagsState,
 * @returns An array of objects with the following properties:
 *   id: number
 *   title: string
 *   type: string
 */
export const formattedTagList = (tagsState: TagsState): TagsMetaItem[] => {
  /* Taking the services array from the tagsState object and mapping over it.
 then finding the service object that matches the userService id and adding a type property to
 it.
 then casting the array as an array of tagsMetaItem objects. */
  const servicesObjects = tagsState.services
    ? (tagsState.services.map((serviceTitle, index) => ({
        id: index,
        title: serviceTitle,
        type: SERVICES,
      })) as unknown as TagsMetaItem[])
    : [];

  /* Taking the locations array from the tagsState object and mapping over it.
 then finding the location object that matches the userLocation id and adding a type property to
 it.
 then casting the array as an array of tagsMetaItem objects. */
  const locationsObjects = tagsState.locations
    ? (tagsState.locations.map((locationName, index) => {
        return {
          id: index,
          title: locationName,
          type: LOCATION,
        };
      }) as unknown as TagsMetaItem[])
    : [];

  const regionsObjects = tagsState.regions
    ? (tagsState.regions.map((regionName, index) => {
        return {
          id: index,
          title: regionName,
          type: REGION,
        };
      }) as unknown as TagsMetaItem[])
    : [];

  return [...servicesObjects, ...locationsObjects, ...regionsObjects];
};

export const getCountryCodeFromPhone = (phoneNumber: string) => {
  return parsePhoneNumber(phoneNumber)?.countryCallingCode;
};

export const getNationalPhoneNumber = (phoneNumber: string) => {
  return parsePhoneNumber(phoneNumber)?.nationalNumber;
};
