import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import pages from 'vite-plugin-pages';

import theme from './plugins/theme';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return defineConfig({
    plugins: [
      vue(),
      vueI18n({
        include: path.resolve(__dirname, './locales/*'),
      }),
      theme(),
      pages(),
    ],
    server: {
      proxy: {
        '^/(api|login|upload|uploads)': {
          target: process.env.API_PROXY_URL,
          changeOrigin: true,
          cookieDomainRewrite: {
            [process.env.API_PROXY_COOKIE_DOMAIN]: 'localhost',
          },
        },
      },
    },
  });
};
