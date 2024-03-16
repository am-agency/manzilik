import { message } from 'antd';
import { BaseEntity } from '../../components/idea/types';
import { Status } from '../projects/types';

export const getActiveProjectIdeas = (projectIdeaList: BaseEntity[]) => {
  return projectIdeaList?.filter((projectIdea) => projectIdea.status !== Status.DELETED);
};

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
  return pattern.test(value);
};

export const getImageExtension = (url: string) => {
  return url.split(/[#?]/)[0].split('.').pop()?.trim();
};

/**
 * convert base46 string to Javascript File object
 * @param dataurl
 * @param filename
 * @returns
 */
function dataURLtoFile(dataurl: string, filename: string) {
  const mime = 'image/png',
    bstr = atob(dataurl);

  let n = dataurl.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

/**
 * Convert HTTP response Blob to base46
 * @param blob
 * @param callback
 */
const blobToBase64 = function (blob: Blob, callback: Function) {
  const reader = new FileReader();
  reader.onload = function () {
    const dataUrl = reader.result as string;
    const base64 = dataUrl?.split(',')[1];
    callback(base64);
  };
  reader.readAsDataURL(blob);
};

/**
 * Convert Url to File
 * @param url
 * @param callback
 */
export const convertUrlToFile = (url: string, callback: Function) => {
  const { REACT_APP_MAKHZAN_API_URL } = process.env;
  fetch(`${REACT_APP_MAKHZAN_API_URL}/download?url=${url}`)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      blobToBase64(blob, function (base64data: string) {
        // we need to decode the base64 which was encoded after the blob conversion
        const requiredBase64 = decodeURIComponent(escape(window.atob(base64data)));

        const file = dataURLtoFile(requiredBase64, 'image-name');
        callback(file);
      });
    })
    .catch((error) => {
      console.debug({ error });
      message.error('invalid fetch data' + error);
    });
};
