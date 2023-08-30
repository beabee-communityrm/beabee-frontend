import { Formio } from 'formiojs';
import { Form, FormBuilder } from '@formio/vue';

// import BeabeeAddress from './formio/providers/address/beabee';
import BeabeeStorage from './formio/providers/storage/beabee';

// Formio type is broken
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Formio2: any = Formio;
// Formio2.Providers.providers.address = { beabee: BeabeeAddress };
Formio2.Providers.providers.storage = { beabee: BeabeeStorage };

export { Form, FormBuilder };
