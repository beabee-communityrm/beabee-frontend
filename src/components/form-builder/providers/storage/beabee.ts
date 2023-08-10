/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { createUploadFlow } from '../../../../utils/api/upload';
// import { Formio } from '@formio/vue';
import env from '../../../../env';

interface BeabeeFile {
  storage: 'beabee';
  name: string;
  url: string;
}

const beabee = () => {
  return {
    title: 'beabee',
    name: 'beabee',
    async uploadFile(
      file: File,
      name: string,
      dir: string,
      progressCallback: any,
      url: any,
      options: any,
      fileKey: any,
      groupPermssions: any,
      groupId: any,
      abortCallback: any
    ): Promise<BeabeeFile> {
      const uploadFlow = await createUploadFlow();

      const data = new FormData();
      data.append('file', file);

      const controller = new AbortController();
      if (typeof abortCallback === 'function') {
        abortCallback(() => controller.abort());
      }

      const resp = await axios.post('/upload/', data, {
        baseURL: env.appUrl,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          token: uploadFlow.id,
        },
        signal: controller.signal,
      });

      return {
        storage: 'beabee',
        name,
        url: resp.data.url,
      };
    },
    async deleteFile() {
      throw new Error('Not implemented');
    },
    async downloadFile(file: BeabeeFile) {
      return file;
    },
  };
};

beabee.title = 'beabee';
export default beabee;
