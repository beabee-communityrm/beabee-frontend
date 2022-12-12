import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import pages from 'vite-plugin-pages';
import replace from '@rollup/plugin-replace';

import theme from './plugins/theme';

export default ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const plugins = [
    vue(),
    vueI18n({
      include: path.resolve(__dirname, './locales/*'),
    }),
    theme(),
    pages(),
  ];

  if (command === 'serve') {
    plugins.push(
      replace({
        values: {
          __appUrl__: 'http://localhost:3000',
          __apiUrl__: env.API_BASE_URL,
          __revision__: '',
        },
        preventAssignment: true,
      })
    );
  }

  return defineConfig({
    plugins,
    server: {
      port: 3000,
      proxy: {
        '^/(api|login|upload|uploads|favicon.png)': {
          target: env.API_PROXY_URL,
          changeOrigin: true,
          cookieDomainRewrite: {
            [env.API_PROXY_COOKIE_DOMAIN]: 'localhost',
          },
        },
      },
    },
    ...(command === 'serve' && {
      optimizeDeps: {
        exclude: ['@beabee/beabee-common'],
      },
    }),
  });
};
