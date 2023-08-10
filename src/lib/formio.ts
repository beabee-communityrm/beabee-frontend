import { Formio } from 'formiojs';
import { Form, FormBuilder } from '@formio/vue';

import BeabeeStorage from '../components/form-builder/providers/storage/beabee';

Formio.Providers.addProvider('storage', 'beabee', BeabeeStorage);

export { Form, FormBuilder };
