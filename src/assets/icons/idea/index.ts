import save from './save.svg';
import comment from './comment.svg';
import share from './share.svg';
import like from './like.svg';
import liked from './liked.svg';
import { EXPORT, LIKE, SAVE_FROM_WEB } from '../../../locales/strings';
import saved from './saved.svg';
import save_grey from './save_grey.svg';
import comment_grey from './comment_grey.svg';
import share_grey from './share_grey.svg';
import like_grey from './like_grey.svg';
import like_white from './like_white.svg';
import liked_grey from './liked_grey.svg';
import saved_grey from './saved_grey.svg';
import options from './options.svg';
import tag from './tag.svg';
import tag1 from './tag1.svg';
import edit from './edit.svg';
import all from './all.svg';

export const ideaIcons = {
  save: {
    icon: save,
    greyIcon: save_grey,
    filledGreyIcon: saved_grey,
    filledIcon: saved,
    title: SAVE_FROM_WEB,
  },
  comment: {
    icon: comment,
    greyIcon: comment_grey,
    title: 'COMMENT',
  },
  share: {
    icon: share,
    greyIcon: share_grey,
    title: EXPORT,
  },
  like: {
    icon: like,
    greyIcon: like_grey,
    whiteIcon: like_white,
    filledGreyIcon: liked_grey,
    filledIcon: liked,
    title: LIKE,
  },
  saved: {
    icon: saved,
    greyIcon: saved_grey,
    title: 'Saved',
  },
  options: {
    icon: options,
    title: 'options',
  },
  tag,
  tag1,
  edit,
  all,
};
