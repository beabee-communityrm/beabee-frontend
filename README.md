# beabee-new-frontend

## Development setup

To set up:

```sh
cp .env.example .env
npm install
```

To start development:

```sh
npm run dev
```

To build the project:

```sh
npm run build
```

## Project style guide

The project uses these for linting:

- `ESLint`
- `stylelint`
- `commitlint`
- `vue3-recommended`

It also uses `husky` and `stage-lint` to lint the codes at pre-commit stage.

### Commit messages

`commitlint` is used to make sure the commit messages meet the conventional commit format.
For more information you can check the [commitlint repository](https://github.com/conventional-changelog/commitlint#what-is-commitlint).

### I18n

`yaml` locale files should be added to `locales` directory. For example: `en.yaml`.

In Vue files:

```vue
<template>
  <p>{{ t('hello') }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    return { t };
  },
});
</script>
```

In locale file (e.g. en.yaml):

```yaml
hello: 'Hello World!'
```

For more information check [vue-i18n vite plugin](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#intlifyvite-plugin-vue-i18n)
