# beabee-new-frontend

## Development setup

To set up:

```sh
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

Use `scripts/i18n.py` to generate your locales. It takes a CSV of the form:

```
key,lang1,lang2,lang3
common.yes,Yes,Ya,Oui
common.no,No,Nein,Non
```

It will generate a `locales/<lang>.json` file for each header except `key`,
which is used to build the JSON object. For the above example it would create
a file called `locales/lang1.json` with the following:

```json
{
  "common": {
    "no": "No",
    "yes": "Yes"
  }
}
```

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
For more information check [vue-i18n vite plugin](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#intlifyvite-plugin-vue-i18n)
