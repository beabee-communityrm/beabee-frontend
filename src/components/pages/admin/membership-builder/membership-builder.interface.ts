import { Emitter } from 'mitt';

export type MembershipBuilderEmitter = Emitter<{
  dirty: undefined;
  update: undefined;
  updated: undefined;
}>;
