export const operators = {
  contains: {
    args: [{ type: 'text' }],
  },
  between: {
    args: [{ type: 'text' }, { type: 'text' }],
  },
  startswith: {
    args: [{ type: 'text' }],
  },
  endswith: {
    args: [{ type: 'text' }],
  },
  before: {
    args: [{ type: 'date' }],
  },
  after: {
    args: [{ type: 'date' }],
  },
  equals: {
    args: [{ type: 'text' }],
  },
} as const;

export const typeOperators = {
  string: ['contains', 'startswith', 'endswith', 'equals'],
  date: ['between', 'before', 'after'],
} as const;

export const fields = {
  firstname: {
    type: 'string',
  },
  lastname: {
    type: 'string',
  },
  joined: {
    type: 'date',
  },
} as const;

type FieldId = keyof typeof fields;

export type OperatorId = keyof typeof operators;
export type OperatorValue = string | number | undefined;

export interface EmptyFilter {
  field: '';
}

export interface Filter {
  field: FieldId;
  operator: OperatorId;
  values: OperatorValue[];
}
