import type { Component } from 'vue';

export interface FilterGroup<T extends string = string> {
  id: string;
  label: string;
  items: T[];
  custom?: Component;
  itemsPrefix?: string;
}

export type FilterGroups<T extends string = string> = FilterGroup<T>[];
