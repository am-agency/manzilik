import API from '@aws-amplify/api';
import { graphqlAuthenticationOperation, graphqlOperation } from './index';
import * as queries from '../graphql/queries';
import { PresignedUrlInput, PresignedUrl } from '../API';
import axios from 'axios';

interface PreSignedUrlFromApi {
  data: { getPresignedUrl: PresignedUrl };
}

export interface UploadAssetProps extends PresignedUrlInput {
  file: File;
}
/**
 * 1- get preSignedUrl with the @params inputs
 * 2- upload asset to s3 directly
 * 3- generate and return asset url
 * @param values
 * @returns
 */
export const uploadAsset = async (values: UploadAssetProps) => {
  const result = await getPreSignedUrl(values);
  const { fields, url } = result;
  // @ts-ignore
  await uploadToMakhzan(fields, url, values.file, values.onProgress);
  const fileUrl = generateUrl(fields.key);
  return fileUrl;
};

/**
 * 1- get PreSignedUrl from backend
 * @param contentType
 * @param fileName
 */

const getPreSignedUrl = async (values: PresignedUrlInput) => {
  const result = (await API.graphql(
    graphqlAuthenticationOperation(queries.getPresignedUrl, {
      input: { content_type: values.content_type, file_name: values.file_name, destination: values.destination },
    })
  )) as PreSignedUrlFromApi;
  return JSON.parse(result.data.getPresignedUrl.result!);
};

/**
 * 2- upload asset to Makhzan which contains uploading on s3 correctly
 */

//@TODO: add type for fields
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadToMakhzan = async (fields: any, url: string, file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.keys(fields).forEach((field: any) => {
    formData.append(field, fields[field]);
  });
  formData.append('file', file);
  await axios.post(url, formData, {
    onUploadProgress: (e: ProgressEvent) => {
      if (onProgress) {
        onProgress(e.loaded / e.total);
      }
    },
  });
};

/**
 * 3- generate and return url
 */
const generateUrl = (key: string) => {
  const { REACT_APP_MAKHZAN_URL } = process.env;
  const url = `${REACT_APP_MAKHZAN_URL}/${key}`;
  return url;
};
