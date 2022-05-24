import axios from 'axios';
import { unauthorizedInstance } from '../main/network';

export const uploadFileV2 = async (
  context: 'contract',
  type: 'image' | 'video' | 'other',
  file_name: string,
  file: File,
  isPdf = false,
): Promise<{ name: string; url: string } | null> => {
  const dto = { context, type, file_name };
  try {
    const {
      data: { data },
    } = await axios.post(`/signatures/presigned_urls`, dto);
    const { key, url } = data;
    const formData = new FormData();
    formData.append('file', file);
    await unauthorizedInstance.put(url, formData);

    let name = file_name;
    const indexOfDot = file_name.lastIndexOf('.');
    if (indexOfDot) {
      name = file_name.slice(0, indexOfDot);
    }

    return key;
  } catch {
    return null;
  }
};

export const uploadDocuments = async (files: File[]) => {
  if (!files.length) return [];
  const uploads = files.map(
    (file) =>
      new Promise((resolve, reject) => {
        try {
          const attachment = uploadFileV2('contract', 'other', file.name, file, true);
          resolve(attachment);
        } catch (err) {
          reject(err);
        }
      }),
  );
  return Promise.all(uploads)
    .then((attachments) => attachments)
    .catch((err) => console.log(err));
};

export const getNestedFields = (obj: object) => {
  const transformedObject = {};
  Object.keys(obj).forEach((key) => {
    // @ts-ignore
    if (obj[key] === null || obj[key] === undefined) {
      // @ts-ignore
      transformedObject[key] = '-';
      return true;
    }
    // @ts-ignore
    const objectType = typeof obj[key];

    switch (objectType) {
      case 'boolean': {
        // @ts-ignore
        if (obj[key]) {
          // @ts-ignore
          transformedObject[key] = 'true';
        } else {
          // @ts-ignore
          transformedObject[key] = 'false';
        }
        break;
      }
      case 'object': {
        // @ts-ignore
        const nestedObject = getNestedFields(obj[key], key);
        // @ts-ignore
        Object.keys(nestedObject).forEach((nested_key) => {
          // @ts-ignore
          transformedObject[`${key}-${nested_key}`] = nestedObject[nested_key];
        });
        break;
      }
      default: {
        // @ts-ignore
        transformedObject[key] = obj[key];
        break;
      }
    }
  });
  return transformedObject;
};

export type FileType = 'image' | 'video' | 'other';

export const uploadMediaV2 = async (
  file: Blob,
  type: FileType,
  file_name: string,
  requestUrl: string,
  context: string,
): Promise<Record<string, string>> => {
  try {
    const fileParams = {
      type,
      file_name,
      context,
    };
    const {
      data: {
        data: { key, url: uploadUrl },
      },
    } = await axios.post(requestUrl, fileParams);

    const { size } = file;
    const sliceSize = 50000000;
    let start = 0;
    const uploadId = `file_${Date.now()}`;

    const chunkCount = Math.ceil(file.size / sliceSize);

    let fileUrl = '';

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < chunkCount; i += 1) {
      let end = start + sliceSize;

      if (end > size) {
        end = size;
      }

      const newBlob = file.slice(start, end);

      const formData = new FormData();
      formData.append('file', newBlob);

      const {
        data: { secure_url: videoUrl },
      } = await unauthorizedInstance.put(uploadUrl, formData, {
        headers: {
          'X-Unique-Upload-Id': uploadId,
          'Content-Range': `bytes ${start}-${end - 1}/${size}`,
        },
        baseURL: '',
      });

      if (end < size) {
        start += sliceSize;
      }

      if (videoUrl) {
        fileUrl = videoUrl;
      }
    }

    return {
      key,
      url: fileUrl,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const toDataURL = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

export const forceDownload = async (url: string, fileNameWithExt: string, isCdnUrl: boolean) => {
  try {
    const a = document.createElement('a');
    a.href = isCdnUrl ? await toDataURL(url) : url;
    a.download = fileNameWithExt;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.log('Error while trying to download photo');
  }
};

export const generateTagParam = (tags?: string) => {
  if (!tags) return '';

  return tags
    .split(',')
    .map((tag) => `&tags=${tag}`)
    .join('');
};

export const generateArrayParam = (arr: string[] | number[], name: string): string => {
  if (!arr || arr.length === 0) return '';

  return (arr as Array<string | number>).map((item) => `&${name}=${item}`).join('');
};

type IGenerateRequestParams = {
  [name: string]: string | number | null | undefined | number[] | string[];
};

export const camelToPascalCase = (str: string): string => {
  const arrFromStr = str.split('');
  let resultStr = '';

  for (let i = 0; i < arrFromStr.length; i += 1) {
    if (arrFromStr[i] !== arrFromStr[i].toUpperCase()) {
      resultStr += arrFromStr[i];
    } else {
      resultStr += `_${arrFromStr[i].toLowerCase()}`;
    }
  }

  return resultStr;
};

export const generateRequestParams = (params: IGenerateRequestParams): string => {
  let resultStr = '';

  Object.entries(params).forEach(([name, value], index) => {
    if (value || value === 0) {
      resultStr +=
        index === 0
          ? `${camelToPascalCase(name)}=${value}`
          : `&${camelToPascalCase(name)}=${value}`;
    }
  });

  return resultStr;
};

export const generateRefParams = (params?: {
  [name: string]: number[] | string[] | undefined;
}): string => {
  if (!params) return '';

  let resultStr = '';

  Object.entries(params).forEach(([name, value]) => {
    if (value)
      value.forEach((v: string | number) => {
        resultStr += `&${camelToPascalCase(name)}=${v.toString().toLowerCase()}`;
      });
  });

  return resultStr;
};

export const checkIsMobile = () => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  }

  return false;
};

export const tryDoErrorScroll = (rightOrderIds: string[], errorIds: string[]): boolean => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rightOrderIds.length; i++) {
    const id = rightOrderIds[i];
    if (errorIds.includes(id)) {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    }
  }
  return false;
};

export const fetchFileFromBlobUrl = async (blobUrl: string, fileName: string | null) => {
  const file = await fetch(blobUrl as string).then((r) => r.blob());
  return new File([file], fileName || 'file');
};

// Detect Hebrew characters in string
export const containsHeb = (str: string) => /[\u0590-\u05FF]/.test(str);
