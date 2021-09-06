import 'dotenv/config';

import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      include: path.resolve(__dirname, './locales/*'),
      // for more info check here:
      // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#fullinstall
      fullInstall: false,
    }),
  ],
  server: {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    strictPort: true,
  },
});
