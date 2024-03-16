import { RoomType } from '../../API';
import { AR } from '../../locales/constants';

export const getRoomTitle = (roomType: RoomType, lng: string) => {
  return lng === AR ? roomType.arabic_title : roomType.english_title;
};
