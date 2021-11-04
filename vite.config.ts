import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueI18n({
      // for more info check here:
      // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#fullinstall
      fullInstall: false,
    }),
  ],
  server: {
    proxy: {
      '^/(api|login)': {
        target: 'https://dev.beabee.io',
        changeOrigin: true,
        cookieDomainRewrite: {
          'dev.beabee.io': 'localhost',
        },
      },
    },
  },
});
