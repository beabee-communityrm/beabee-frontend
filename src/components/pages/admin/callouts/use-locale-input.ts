import { watch, toRef } from 'vue';
import type { LocaleProp } from './callouts.interface';

export interface LocaleInputProps {
  modelValue: LocaleProp;
  locales: string[];
  label: string;
}

export function useLocaleInput(props: LocaleInputProps) {
  // Ensure that the modelValue has a value for each locale
  watch(
    toRef(props, 'locales'),
    (newLocales) => {
      for (const locale of newLocales) {
        if (!props.modelValue[locale]) {
          props.modelValue[locale] = '';
        }
      }
    },
    { immediate: true }
  );

  return props;
}