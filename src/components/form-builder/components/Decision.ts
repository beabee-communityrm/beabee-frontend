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

const oldEditForm = Radio.editForm.bind(Radio);

Radio.editForm = (...args) => {
  const editForm = oldEditForm(...args);

  // // Remove shortcut
  console.log(editForm.components[0].components[1]);
  editForm.components[0].components[1].components[1].components.splice(2, 1);
  return editForm;
};

Decision.editForm = (...args) => {
  const editForm = oldEditForm(...args);

  // Replace shortcut with next slide
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
