<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <template v-if="!env.cnrMode">
      <AppFormSection :help="inputT('who.help')">
        <AppRadioGroup
          v-model="data.whoCanTakePart"
          name="whoCanTakePart"
          :label="inputT('who.label')"
          :options="[
            ['members', inputT('who.opts.members')],
            ['everyone', inputT('who.opts.everyone')],
          ]"
          required
        />
      </AppFormSection>
      <AppFormSection
        v-if="data.whoCanTakePart === 'everyone'"
        :help="inputT('anonymous.help')"
      >
        <AppRadioGroup
          v-model="data.allowAnonymousResponses"
          name="allowAnonymousResponses"
          :label="inputT('anonymous.label')"
          :options="[
            ['none', inputT('anonymous.opts.none')],
            ['guests', inputT('anonymous.opts.guests')],
            ['all', inputT('anonymous.opts.all')],
          ]"
          required
        />
      </AppFormSection>
      <AppFormSection :help="inputT('visible.help')">
        <AppRadioGroup
          v-model="data.showOnUserDashboards"
          name="showOnUserDashboards"
          :label="inputT('visible.label')"
          :options="[
            [true, inputT('visible.opts.yes')],
            [false, inputT('visible.opts.no')],
          ]"
          required
        />
      </AppFormSection>
      <AppFormSection :help="inputT('multiple.help')">
        <AppRadioGroup
          v-model="data.multipleResponses"
          name="multipleResponses"
          :label="inputT('multiple.label')"
          :options="[
            [true, inputT('multiple.opts.yes')],
            [false, inputT('multiple.opts.no')],
          ]"
          required
        />
      </AppFormSection>
      <AppFormSection
        v-if="!data.multipleResponses"
        :help="inputT('editable.help')"
      >
        <AppRadioGroup
          v-model="data.usersCanEditAnswers"
          name="usersCanEditAnswers"
          :label="inputT('editable.label')"
          :options="[
            [true, inputT('editable.opts.yes')],
            [false, inputT('editable.opts.no')],
          ]"
          required
        />
      </AppFormSection>
    </template>
    <template v-else>
      <AppFormSection :help="inputT('showResponses.help')">
        <AppRadioGroup
          v-model="data.showResponses"
          name="showResponses"
          :label="inputT('showResponses.label')"
          :options="[
            [true, t('common.yes')],
            [false, t('common.no')],
          ]"
          required
        />
      </AppFormSection>
      <template v-if="data.showResponses">
        <AppFormSection :help="inputT('whichResponseViews.help')">
          <AppLabel :label="inputT('whichResponseViews.label')" required />
          <div class="flex gap-4">
            <AppCheckbox
              v-model="data.showResponseGallery"
              :icon="faImages"
              :label="inputT('whichResponseViews.opts.gallery')"
              class="!font-normal"
            />
            <AppCheckbox
              v-model="data.showResponseMap"
              :icon="faMap"
              :label="inputT('whichResponseViews.opts.map')"
              class="!font-normal"
            />
          </div>
        </AppFormSection>
        <AppFormSection :help="inputT('responseTitleProp.help')">
          <AppSelect
            v-model="data.responseTitleProp"
            :label="inputT('responseTitleProp.label')"
            :items="formComponentItems"
            required
          />
        </AppFormSection>
        <AppFormSection :help="inputT('responseImageProp.help')">
          <AppSelect
            v-model="data.responseImageProp"
            :label="inputT('responseImageProp.label')"
            :items="fileComponentItems"
            :required="data.showResponseGallery"
          />
        </AppFormSection>
        <AppFormSection>
          <AppInput
            v-model="data.responseImageFilter"
            :label="inputT('responseImageFilter.label')"
          />
        </AppFormSection>
        <template v-if="data.showResponseMap">
          <AppFormSection>
            <AppSubHeading>{{ inputT('mapSchema.title') }}</AppSubHeading>

            <AppSelect
              v-model="data.mapSchema.addressProp"
              :label="inputT('mapSchema.addressProp.label')"
              :items="addressComponentItems"
              required
            />
          </AppFormSection>
          <AppFormSection :help="inputT('mapSchema.style.help')">
            <AppInput
              v-model="data.mapSchema.style"
              :label="inputT('mapSchema.style.label')"
              required
            />
          </AppFormSection>
          <AppFormSection>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <AppInput
                  v-model="mapCenter"
                  :label="inputT('mapSchema.center.label')"
                  required
                />
              </div>
              <div>
                <AppInput
                  v-model="mapBounds"
                  :label="inputT('mapSchema.bounds.label')"
                  required
                />
              </div>
            </div>
          </AppFormSection>
          <AppFormSection>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <AppInput
                  v-model="data.mapSchema.initialZoom"
                  type="number"
                  :label="inputT('mapSchema.initialZoom.label')"
                  :min="data.mapSchema.minZoom"
                  :max="data.mapSchema.maxZoom"
                  required
                />
              </div>
              <div>
                <AppInput
                  v-model="data.mapSchema.minZoom"
                  type="number"
                  :label="inputT('mapSchema.minZoom.label')"
                  :min="0"
                  :max="data.mapSchema.maxZoom"
                  required
                />
              </div>
              <div>
                <AppInput
                  v-model="data.mapSchema.maxZoom"
                  type="number"
                  :label="inputT('mapSchema.maxZoom.label')"
                  :min="data.mapSchema.minZoom"
                  :max="22"
                  required
                />
              </div>
            </div>
          </AppFormSection>
          <AppFormSection>
            <AppSelect
              v-model="data.mapSchema.addressPatternProp"
              :label="inputT('mapSchema.addressPatternProp.label')"
              :items="[
                { id: '', label: inputT('mapSchema.addressPatternProp.none') },
                ...textComponentItems,
              ]"
            />
          </AppFormSection>
          <AppFormSection v-if="!!data.mapSchema.addressPatternProp">
            <AppInput
              v-model="data.mapSchema.addressPattern"
              :label="inputT('mapSchema.addressPattern.label')"
              required
            />
          </AppFormSection>
        </template>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ItemStatus, flattenComponents } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { computed, ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppRadioGroup from '../../../../forms/AppRadioGroup.vue';
import AppFormSection from '../../../../forms/AppFormSection.vue';
import { CalloutSteps, SettingsStepProps } from '../callouts.interface';
import { sameAs } from '@vuelidate/validators';
import AppInput from '../../../../forms/AppInput.vue';
import AppCheckbox from '../../../../forms/AppCheckbox.vue';
import AppLabel from '../../../../forms/AppLabel.vue';
import { faImages, faMap } from '@fortawesome/free-solid-svg-icons';
import AppSelect from '../../../../forms/AppSelect.vue';
import AppSubHeading from '../../../../AppSubHeading.vue';
import env from '../../../../../env';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  data: SettingsStepProps;
  status: ItemStatus | undefined;
  isActive: boolean;
  steps: CalloutSteps;
}>();

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.settings.inputs.' + key);

// Force step to stay unvalidated until it is visited for new callouts
const hasVisited = ref(!!props.status);
watch(toRef(props, 'isActive'), (active) => (hasVisited.value ||= active));

const formComponentItems = computed(() =>
  flattenComponents(props.steps.content.data.formSchema.components)
    .filter((c) => c.input)
    .map((c) => ({
      id: c.key,
      label: c.label || c.key,
      type: c.type,
    }))
);

const fileComponentItems = computed(() =>
  formComponentItems.value.filter((c) => c.type === 'file')
);

const addressComponentItems = computed(() =>
  formComponentItems.value.filter((c) => c.type === 'address')
);

const textComponentItems = computed(() =>
  formComponentItems.value.filter(
    (c) => c.type === 'textfield' || c.type === 'textarea'
  )
);

const validation = useVuelidate(
  {
    hasVisited: { yes: sameAs(true) },
    hasResponseView: { yes: sameAs(true) },
  },
  {
    hasVisited,
    hasResponseView: computed(
      () =>
        !props.data.showResponses ||
        props.data.showResponseGallery ||
        props.data.showResponseMap
    ),
  }
);

const mapCenter = computed({
  get: () => props.data.mapSchema.center.join(', '),
  set: (newValue) => {
    const [lng, lat] = newValue.split(',').map((v) => Number(v.trim()));
    // eslint-disable-next-line vue/no-mutating-props
    props.data.mapSchema.center = [lng, lat];
  },
});

const mapBounds = computed({
  get: () => props.data.mapSchema.bounds.join(', '),
  set: (newValue) => {
    const [lng1, lat1, lng2, lat2] = newValue
      .split(',')
      .map((v) => Number(v.trim()));
    // eslint-disable-next-line vue/no-mutating-props
    props.data.mapSchema.bounds = [
      [lng1, lat1],
      [lng2, lat2],
    ];
  },
});

watch(
  validation,
  () => {
    emit('update:error', validation.value.$errors.length > 0);
    emit('update:validated', !validation.value.$invalid);
  },
  { immediate: true }
);
</script>
