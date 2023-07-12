/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formio, Components, ExtendedComponentSchema } from 'formiojs';

const Radio = Components.components.radio;

export class Decision extends Radio {
  static schema(): ExtendedComponentSchema {
    return Radio.schema({
      type: 'decision',
      label: 'Decision',
      key: 'decision',
    });
  }

  static get builderInfo() {
    return {
      title: 'Decision',
      icon: 'code-branch',
      group: 'advanced',
      weight: 0,
      schema: Decision.schema(),
    };
  }
}

Decision.editForm = (...args) => {
  const editForm = Radio.editForm(...args);
  const valuesGrid = editForm.components[0].components[1].components[1];
  valuesGrid.defaultValue = [{ label: '', value: '', nextPageKey: '' }];

  const nextPageComponent = valuesGrid.components[2];
  nextPageComponent.label = 'Next slide';
  nextPageComponent.key = 'nextPageKey';
  nextPageComponent.tooltip = '';
  nextPageComponent.validate = { required: true };
  nextPageComponent.data.custom = (context: any) => {
    return context.instance.options.editForm.components.map((c: any) => ({
      label: c.title,
      value: c.key,
    }));
  };

  return editForm;
};

Formio.use({ components: { decision: Decision } });
