import i18n from '../../app/i18n';
import { EN } from '../../locales/constants';
import moment from 'moment';
import { BaseEntity } from '../../components/idea/types';
import { replaceSpace } from '../ideas/utils';

export const convertProjectIdeaListToString = (projectIdeaList?: BaseEntity[]) => {
  if (!projectIdeaList) {
    return null;
  }
  return projectIdeaList?.reduce(
    (prev, curr, idx, arr) =>
      idx === arr.length - 1 ? prev + (curr?.entity_id || '') : prev + (curr?.entity_id || '') + ',',
    ''
  );
};

export const checkIfProjectIdeaExist = (projectIdeaList: Array<BaseEntity>, projectIdea: BaseEntity) => {
  const foundedProject = projectIdeaList?.find((elem) => elem.entity_id === projectIdea.entity_id);
  if (foundedProject) {
    return true;
  }
  return false;
};

export const getTimeFormatBasedOnLanguage = (time: string) => {
  const lang = i18n.language;
  moment.locale('ar');
  return moment(time).fromNow();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toArrayOrEmpty = (array: any) => {
  return array || [];
};

export const getTitleBasedOnLanguage = (lang: string, element: { english_title: string; arabic_title: string }) =>
  lang == EN ? element.english_title : element.arabic_title;

export const getOriginalPhoto = (photoUrl: string) => {
  return photoUrl.replaceAll('/uploads/', '/uploads/original/');
};
