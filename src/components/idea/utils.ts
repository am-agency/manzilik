import { TFunction } from 'i18next';
import { SAVE_DISCUSSION, SAVE_IDEA, SAVE_MAGAZINE, SAVE_TV } from '../../locales/strings';
import { replaceSpaceWithDash } from '../../utils';
import { BaseEntity, EntityTags, Project } from './types';

export const getLinkToEntity = (tag?: string) => {
  switch (tag) {
    case EntityTags.PROJECTS:
      return 'idea/';
    case EntityTags.DISCUSSION:
      return '/discussion/';
    case EntityTags.DISCUSSIONS:
      return '/discussion/';
    case EntityTags.IDEA:
      return 'idea/';
    case EntityTags.IDEAS:
      return 'idea/';
    case EntityTags.MAGAZINE:
      return '/magazine/';
    case EntityTags.MAGAZINES:
      return '/magazine/';
    case EntityTags.TVS:
      return '/tv/';
    case EntityTags.TV:
      return '/tv/';
    default:
      return 'idea/';
  }
};

export const getModalTitle = (tag: string, t: TFunction) => {
  switch (tag) {
    case EntityTags.IDEAS:
      return t(SAVE_IDEA);
    case EntityTags.IDEA:
      return t(SAVE_IDEA);
    case EntityTags.MAGAZINES:
      return t(SAVE_MAGAZINE);
    case EntityTags.MAGAZINE:
      return t(SAVE_MAGAZINE);
    case EntityTags.DISCUSSIONS:
      return t(SAVE_DISCUSSION);
    case EntityTags.DISCUSSION:
      return t(SAVE_DISCUSSION);
    case EntityTags.TV:
      return t(SAVE_TV);
    default:
      return t(SAVE_IDEA);
  }
};

/**
 *
 * @param entity any entity type. @example: Idea, discussion, magazine, tv
 * @param project which project the entity related to
 * @returns redirect path
 */

export const getIdeaCardDirection = (entity: BaseEntity, project: Project, tag?: string) => {
  const entityTag = entity?.tag || tag;
  const ideaTag = entityTag == EntityTags.IDEAS || entityTag == EntityTags.IDEA || entityTag == EntityTags.PROJECTS;
  // when the entity is an idea the title should be the project title, otherwise the entity title
  const entityTitle = ideaTag
    ? replaceSpaceWithDash(project?.title!)
    : replaceSpaceWithDash(entity?.project?.title! || entity?.title!);

  // when the entity is an idea the id should be the project id, otherwise the entity id
  const id = ideaTag ? project?.id : entity?.entity_id || entity.id;

  if (ideaTag) {
    return `${getLinkToEntity(entityTag)!}${entityTitle}/${id}/${entity.entity_id || entity.id}`;
  } else {
    return `${getLinkToEntity(entityTag)!}${entityTitle}/${id}`;
  }
};

/**
 *
 * @param entity any entity type. @example: Idea, discussion, magazine, tv
 * @param project which project the entity related to
 * @returns entity title, if idea => project title, else will return entity (title discussion, magazine, tv)
 */
export const getEntityTitle = (entity: BaseEntity, project: Project, tag?: string) => {
  return entity?.tag || tag === EntityTags.IDEAS || entity?.tag === EntityTags.IDEA
    ? project?.title!
    : entity?.project?.title! || entity?.title!;
};
