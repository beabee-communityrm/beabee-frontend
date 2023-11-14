import type {
  CalloutData,
  AllowNull,
  CalloutFormData,
  CalloutResponseViewSchema,
} from '@type';

export type CreateCalloutData = AllowNull<
  CalloutData &
    CalloutFormData & { responseViewSchema?: CalloutResponseViewSchema | null }
>;
