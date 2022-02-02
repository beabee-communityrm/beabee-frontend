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
    }),
  ],
  server: {
    proxy: {
      '^/(api|login)': {
        //target: 'https://dev.beabee.io',
        target: 'http://localhost:3001',
        changeOrigin: true,
        cookieDomainRewrite: {
          'dev.beabee.io': 'localhost',
        },
      },
    },
  },
});
