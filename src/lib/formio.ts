import { Formio } from 'formiojs';
import { Form, FormBuilder } from '@formio/vue';

import BeabeeStorage from './formio/providers/storage/beabee';

// Formio type is broken
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Formio2: any = Formio;
Formio2.Providers.providers.storage = { beabee: BeabeeStorage };

export { Form, FormBuilder };
