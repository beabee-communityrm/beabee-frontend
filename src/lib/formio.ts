import { Formio } from 'formiojs';
import { Form, FormBuilder } from '@formio/vue';

import BeabeeStorage from '../components/form-builder/providers/storage/beabee';

// Formio type is broken
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Formio as any).Providers.addProvider('storage', 'beabee', BeabeeStorage);

export { Form, FormBuilder };
