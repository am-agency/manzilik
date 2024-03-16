import { API } from 'aws-amplify';
import { Storage } from 'aws-amplify';
import { GraphQLOptions, GraphQLResult } from '@aws-amplify/api-graphql';
import { AppSyncAuthenticationType, User } from '../app/types';
import { UploadFile } from 'antd/lib/upload/interface';
import { Icon } from '../pages/idea/types';
import { AR } from '../locales/constants';
import { Category, Client } from '../API';
import i18n from '../app/i18n';
import { TFunction } from 'i18next';
import {
  CAPTCHA_IS_MISSING,
  INCORRECT_USERNAME_OR_PASSWORD,
  INVALID_CODE,
  MUST_RESET_PASSWORD,
  REQUIRED,
  SOMETHING_WENT_WRONG,
  USER_DOESNT_EXIST,
  USER_EXIST,
  USER_NOT_CONFIRMED,
} from '../locales/strings';
import { RouterHistory } from '@sentry/react/dist/reactrouter';
import { PROFESSIONAL, WEB } from '../app/settings';
import { Idea, Project } from '../components/idea/types';
import { PROFESSIONAL_PUBLIC_ROUTE, PUBLIC_PROFILE_ROUTE, IDEA_ROUTE } from './routes';

export const getUserName = (user?: Client | User | null) => {
  if (!user) {
    return '';
  }
  const firstName = ((user as Client).first_name || (user as User).name)?.trim() || '';
  const lastName = ((user as Client).last_name || (user as User).family_name)?.trim() || '';
  if (firstName.length + lastName.length > 0) {
    return `${firstName} ${lastName}`;
  }
  const email = user.email?.split('@')[0].trim() || '';
  if (email) {
    return email;
  }
  if ((user as Client).mobile) {
    return (user as Client).mobile!.trim();
  }
  return '';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const graphqlOperation: any = (query: any, variables?: {}) => ({
  query,
  variables,
  //@ts-ignore
  authMode: AppSyncAuthenticationType.API_KEY,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const graphqlAuthenticationOperation: any = (query: any, variables?: {}) => ({
  query,
  variables,
  //@ts-ignore
  authMode: AppSyncAuthenticationType.AMAZON_COGNITO_USER_POOLS,
});

export interface s3Info {
  bucket: string;
  region: string;
  key: string;
}

export const getUrlPictureFromS3 = (s3Info?: s3Info) => {
  if (s3Info) {
    return `https://${s3Info?.bucket}.s3.${s3Info?.region}.amazonaws.com/public/${s3Info?.key}`;
  } else {
    return `default_path`;
  }
};

// @deprecated: we will use makhzan instead
export const uploadFilesOnS3 = async (fileList: UploadFile[]) => {
  const pictureUrls: s3Info[] = [];
  for (let index = 0; index < fileList.length; index++) {
    const file = fileList[index];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imgFile: any = await Storage.put(file.name, file.originFileObj, {
      contentType: file.type,
    });
    const bucket = 'mazel-hackathon';
    const region = 'eu-central-1';
    pictureUrls.push({ bucket, key: imgFile?.key, region });
  }
  return pictureUrls;
};

export const checkRedirectSource = () => {
  return localStorage.getItem('redirectFrom');
};

export const setRedirectFrom = (screen: string) => {
  if (screen) {
    localStorage.setItem('redirectFrom', screen.toString());
  }
};

export const saveLanguageToStorage = (lng: string) => {
  localStorage.setItem('language', lng);
};

export const getLanguageFromStorage = () => {
  return localStorage.getItem('language');
};

/**
 *
 * @param file: pass any file as an object
 * @returns : return file in base64
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBase64 = (file: any) => {
  return new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // @ts-ignore
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const acceptableFiles = ['image/png', 'image/jpeg', 'image/gif'];

/**
 *
 * @param options: any option to make a fake request as it's one of Uploader components requirements
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customRequest = (options: any) => {
  setTimeout(() => {
    options.onSuccess('ok');
  }, 0);
};

/**
 * @param value: pass the string value for checking
 * @param setFieldsValue: a callback function that take the new value and set it inside the form
 * @param error: the translated error that needs to be shown when text is empty
 */
export const checkEmptyString = (value: string, setFieldsValue: Function, error: string) => {
  const fieldVal = value?.trimStart()?.replace(/\s+/g, ' ');
  setFieldsValue(fieldVal);
  if (fieldVal === '') {
    return Promise.reject(new Error(' '));
  } else {
    return Promise.resolve();
  }
};

export const extractVideoUrl = (url: string) => {
  let match =
    url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) ||
    url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return (match[1] || 'https') + '://www.youtube.com/embed/' + match[2] + '?showinfo=0';
  }
  if ((match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))) {
    return (match[1] || 'https') + '://player.vimeo.com/video/' + match[2] + '/';
  }
  return url;
};

export const checkFirstOpenDiscussionPage = () => {
  return localStorage.getItem('discussion-page-first-open');
};

export const setFirstOpenDiscussionPage = (firstOpen: string) => {
  localStorage.setItem('discussion-page-first-open', firstOpen);
};

export const getLikesNumber = (numberOfLikes: number, isLiked?: boolean) => {
  return isLiked ? (numberOfLikes || 0) + 1 : (numberOfLikes || 1) - 1;
};

export const getIcon = (icon: Icon, isFilled?: boolean) => {
  return isFilled ? icon.filledIcon : icon.icon;
};

export const scrollToSection = (sectionId: string) => {
  const scrollToElem = document.getElementById(sectionId);
  if (!scrollToElem) {
    return;
  }
  const offset = scrollToElem!.getBoundingClientRect().top - 70;
  if (supportsSmoothScrolling()) {
    window.scrollTo({
      top: offset,
      left: 0,
      behavior: 'smooth',
    });
    return;
  }
  scrollToElem && smoothVerticalScrolling(offset, 300, 'top');
};

const supportsSmoothScrolling = () => {
  const body = document.body;
  const scrollSave = body.style.scrollBehavior;
  body.style.scrollBehavior = 'smooth';
  const hasSmooth = getComputedStyle(body).scrollBehavior === 'smooth';
  body.style.scrollBehavior = scrollSave;
  return hasSmooth;
};

const smoothVerticalScrolling = (offset: number, time: number, position: string) => {
  const eAmt = offset / 100;
  let currentTime = 0;
  while (currentTime <= time) {
    window.setTimeout(exactPosition, currentTime, eAmt, position);
    currentTime += time / 100;
  }
};

const exactPosition = (eAmt: number, position: string) => {
  window.scrollBy(0, eAmt);
};

/**
 *
 * @param page: pass current page number
 * @param pageSize: pass number of elements in the current page
 * @returns: current offset
 */
export const getPaginationOffset = (page: number, pageSize?: number) => {
  return (page - 1) * pageSize! || 0;
};

/**
 *
 * @param category: pass category to the function
 * @returns: category title based on language change
 */
export const getCategoryTitleBasedOnLanguage = (category: Category) => {
  if (category) {
    return i18n.language == AR ? category?.title : category?.english_title;
  } else {
    return '';
  }
};

/**
 *
 * @param phoneNumber: pass phoneNumber
 * @returns: format for Mobile Number
 */
export const getPhoneNumberFormat = (countryCode: string = '', phoneNumber: string) => {
  if (countryCode && phoneNumber) {
    return `(${countryCode}) ${phoneNumber}`;
  }
  return phoneNumber;
};

/**
 *
 * @param options request options
 * @returns response from backend
 */
const getRequestWithCustomHeader = (options: GraphQLOptions) => {
  return API.graphql(options, {
    lang: i18n.language,
    'accept-language': i18n.language,
    'platform-type': WEB,
  });
};

/**
 *
 * @param endpoint not authenticated endpoint that sends to the backend
 * @param inputs endpoint params
 * @returns request with custom header
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requestGraphqlOperation = (endpoint: string, inputs?: any) => {
  return getRequestWithCustomHeader(graphqlOperation(endpoint, inputs));
};

export const requestGraphqlOperationStrict = <K extends string, T = unknown, I = unknown>(
  endpoint: string,
  inputs?: I
): Promise<GraphQLResult<{ [key in K]: T }>> => {
  return getRequestWithCustomHeader(graphqlOperation(endpoint, inputs)) as Promise<GraphQLResult<{ [key in K]: T }>>;
};

export const requestAuthGraphqlOperationStrict = <K extends string, T = unknown, I = unknown>(
  endpoint: string,
  inputs?: I
): Promise<GraphQLResult<{ [key in K]: T }>> => {
  return getRequestWithCustomHeader(graphqlAuthenticationOperation(endpoint, inputs)) as Promise<
    GraphQLResult<{ [key in K]: T }>
  >;
};

/**
 *
 * @param endpoint auth endpoint that sends to the backend
 * @param inputs endpoint params
 * @returns request with custom header
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requestAuthGraphqlOperation = (endpoint: string, inputs?: any) => {
  return getRequestWithCustomHeader(graphqlAuthenticationOperation(endpoint, inputs));
};

/**
 *
 * @param value searched value
 * @returns value without unneeded spaces
 */
export const checkEmptySimpleString = (value: string) => {
  return value?.trimStart()?.replace(/\s+/g, ' ');
};

/**
 *
 * @param error error message and type
 * @param t translation function
 * @returns clear error message depending on language
 */
export const getCognitoErrorMsgBasedOnLanguage = (error: string, t: TFunction) => {
  const errorType = error.split('errorMessage')[0];
  // this is to check the error message when the error type is UserLambdaValidationException to know the exact error and show the msg according to it
  const errorMessage = error.split('errorMessage')[1];

  if (errorMessage?.includes('Wrong captcha')) {
    return t(CAPTCHA_IS_MISSING);
  }

  switch (errorType) {
    case 'UserNotFoundException':
      return t(USER_DOESNT_EXIST);
    case 'NotAuthorizedException':
      return t(INCORRECT_USERNAME_OR_PASSWORD);
    case 'UsernameExistsException':
      return t(USER_EXIST);
    case 'CodeMismatchException':
      return t(INVALID_CODE);
    case 'UserLambdaValidationException':
      return t(USER_EXIST);
    case 'UserNotConfirmedException':
      return t(USER_NOT_CONFIRMED);
    case 'PasswordResetRequiredException':
      return t(MUST_RESET_PASSWORD);
    default:
      return t(SOMETHING_WENT_WRONG);
  }
};

export const emptyStringNotAllowed = (t: TFunction) => ({ whitespace: true, message: t(REQUIRED) });

/**
 *
 * @param data is an array of any
 * @returns boolean
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isArrayEmpty = (data: any) => data?.length === 0;

/**
 *
 * @param value value with one/more word
 * @returns words with dash in between
 */
export const replaceSpaceWithDash = (value: string) => {
  return value?.replace(/[" "]/g, '-');
};

/**
 *
 * @param history history route
 * @param client the current user
 * @returns redirect url depends on professional or client
 */
export const getClientProfile = (history: RouterHistory, client: Client) => {
  localStorage.setItem('selectedClient', JSON.stringify(client));
  if (client?.type == PROFESSIONAL) {
    const clientName = checkEmptySimpleString(getUserName(client!));
    return history.push(`/professional/${client.id}`);
  } else {
    return history.push(`/client/${client.id}`);
  }
};

/**
 *
 * @param client the current user
 * @returns Client full Name or empty string
 */
export const getClientFullName = (client: Client) => {
  if (client?.first_name) {
    return client?.last_name ? client?.first_name + '-' + client?.last_name! : client?.first_name;
  }
  return '';
};

/**
 *
 * @param URL the url we want to check
 * @returns boolean whether the url is a valid image url or not
 */
export const checkValidImageUrl = (url: string) => {
  if (!url || !url.match) {
    return false;
  }
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
};

/* uses an key-value object to map values in a string e.g. populateRoute('example/:id',{id:1}) => example/:id
 *
 * @param route the route we want to populate
 * @param params a simple key value object for the properties
 * @returns string
 */
export const populateRoute = (route: string, params: { [key: string]: string | number }) => {
  const paramsAsEntries = Object.entries(params);
  if (!paramsAsEntries?.length || !route?.length) {
    return `${route}`;
  }
  //check for an optional parameter in route e.g. /:name? if so it needs to be replaced .
  // match is case insensitive so capital and small names will resolve to the same placeholder
  const optionalParameterSyntaxMatcher = (keyPattern: string) => new RegExp(`(\\/:[${keyPattern}]+\\?+\\/?)`, 'i');
  return paramsAsEntries
    .reduce((routeWithParams, parameterTuple) => {
      const [key, value] = parameterTuple;
      const isOptional = routeWithParams.match(optionalParameterSyntaxMatcher(key));
      return routeWithParams.replace(`:${key}${isOptional ? '?' : ''}`, `${value}`);
    }, route)
    .replace(optionalParameterSyntaxMatcher('a-z'), '');
};

/**
 *
 * @param idea the current user
 * @returns return profile url depends on professional or client
 */
export const getIdeaLink = (idea: Idea, project?: Project) => {
  const title = project?.title || idea?.title || idea?.project?.title || '';
  const projectId = idea?.project_id! || project?.id;
  const ideaId = idea && idea.id?.toString();
  return populateRoute(IDEA_ROUTE, {
    projectId: projectId!,
    ideaId: ideaId!,
    name: replaceSpaceWithDash(title!),
  });
};

/*
 * @param value string input
 * @returns check if it's a valid url or not
 */
export const isValidURL = (value: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );
  return !!pattern.test(value);
};

/**
 * It returns a link to a client's profile page
 * @param {Client} client - Client - this is the client object that we're getting the link for
 * @returns A string
 */
export const getClientProfileLink = (client: Client) => {
  if (!client) {
    // @TODO: when we implement a logger this should inform the developer that a professional without a client was caught
    return '';
  }

  if (client.type !== PROFESSIONAL) {
    return populateRoute(PUBLIC_PROFILE_ROUTE, { id: client.id });
  }
  const clientName = checkEmptySimpleString(getUserName(client));

  return populateRoute(PROFESSIONAL_PUBLIC_ROUTE, { id: client.id });
};

/**
 * If the function is called again before the delay has passed, the previous call is cancelled and the
 * delay is reset.
 * @param {Function} callback - The function that will be called after the delay.
 * @param [delay=1000] - The amount of time to wait before calling the callback.
 * @returns A function that takes in a callback and a delay. The returned function will call the
 * callback after the delay.
 */
export const debounce = (callback: Function, delay = 1000) => {
  let timeout: NodeJS.Timeout;

  return (...args: never[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

/**
 * If the function is called again before the delay has passed, the function will be called again after
 * the delay has passed.
 * @param {Function} callback - The function that you want to throttle.
 * @param [delay=1000] - The amount of time to wait between calls to the callback function.
 * @returns A function that takes in an array of arguments and calls the callback function with those
 * arguments.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends Array<any>, U>(callback: (...args: T) => U, delay = 1000) => {
  let shouldWait = false;
  let waitingArgs: T | null;
  let lastResult: U;
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      lastResult = callback(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };

  return (...args: T): U | undefined => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    lastResult = callback(...args);
    shouldWait = true;

    // setTimeout(timeoutFunc, delay);
    return lastResult;
  };
};
export const removeWhiteSpaces = (str: string) => {
  return str.replace(/\s/g, '');
};

export const debounceFunction = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return function (this: unknown, ...args: unknown[]) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(context, args), delay);
  };
};

export const textSubstring = (inputString: string, maxLength: number) => {
  if (inputString.length <= maxLength) {
    return inputString;
  } else {
    return inputString.substring(0, maxLength) + '...';
  }
};

export const isYouTubeLink = (text: string): boolean => {
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(text);
};

export const getValueAndUpdateSearchUrl = (history: RouterHistory, key: string, value: string) => {
  const params = new URLSearchParams(location.search);
  params.set(key, value);
  history.push({
    search: params.toString(),
  });
};

export const modifyImageUrl = (imageUrl: string, width: number, height?: number) => {
  // Extract the path and file name from the original URL
  const urlParts = imageUrl ? imageUrl.split('/') : [];
  const fileName = urlParts[urlParts.length - 1];
  const pathWithoutFileName = urlParts.slice(0, urlParts.length - 1).join('/');

  // Generate the modified URL
  if (height) {
    const modifiedUrl = `${pathWithoutFileName}/${width}x${height}/${fileName}`;
    return modifiedUrl;
  } else {
    const modifiedUrl = `${pathWithoutFileName}/${width}/${fileName}`;
    return modifiedUrl;
  }
};
