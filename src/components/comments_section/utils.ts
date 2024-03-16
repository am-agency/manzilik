import { message } from 'antd';
import i18n from '../../app/i18n';
import { YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE } from '../../locales/strings';
import { acceptableFiles } from '../../utils';

export const checkIfFileIsValid = (fileType: string) => {
  if (!acceptableFiles.includes(fileType!)) {
    message.destroy();
    message.error(i18n.t(YOU_CAN_UPLOAD_A_JPG_GIF_OR_PNG_FILE));
    return false;
  }
  return true;
};

export const isCommentEmpty = (comment: string) => {
  const strWithoutTags = comment.replace(/(<([^>]+)>)/gi, '');
  const strContainsImg = comment.includes('<img');

  return !comment || comment?.length === 0 || (!strWithoutTags.trimStart()?.replace(/\s+/g, ' ') && !strContainsImg);
};
