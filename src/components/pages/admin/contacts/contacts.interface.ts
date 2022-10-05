export const operators = {
  text: {
    equal: { args: [{ type: 'text' }] },
    contains: { args: [{ type: 'text' }] },
    begins_with: { args: [{ type: 'text' }] },
    ends_with: { args: [{ type: 'text' }] },
  },
  date: {
    equal: { args: [{ type: 'date' }] },
    between: { args: [{ type: 'date' }, { type: 'date' }] },
    less: { args: [{ type: 'date' }] },
    greater: { args: [{ type: 'date' }] },
  },
} as const;

export const filters = {
  firstname: {
    type: 'text',
  },
  lastname: {
    type: 'text',
  },
  email: {
    type: 'text',
  },
  joined: {
    type: 'date',
  },
} as const;

type FilterId = keyof typeof filters;

export type FilterValue = string | number;

export interface FilterOperator {
  args: { type: 'date' | 'text' }[];
}

type FilterOperators<Id extends FilterId> =
  typeof operators[typeof filters[Id]['type']];
type FilterOperatorId<Id extends FilterId> = keyof FilterOperators<Id>;

export class Filter<Id extends FilterId = FilterId> {
  id: Id;
  operatorId: FilterOperatorId<Id>;
  values: FilterValue[] = [];

  constructor(id: Id) {
    this.id = id;
    this.operatorId = this.initialOperatorId;
  }

  get operator(): FilterOperator {
    return this.operators[this.operatorId] as FilterOperator;
  }

  get operators(): FilterOperators<Id> {
    return operators[filters[this.id].type] as FilterOperators<Id>;
  }

  get initialOperatorId(): FilterOperatorId<Id> {
    return Object.keys(this.operators)[0] as FilterOperatorId<Id>;
  }
}
