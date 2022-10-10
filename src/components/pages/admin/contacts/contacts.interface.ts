import { Filters } from '../../../search/search.interface';

export const filters: Filters = {
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
  lastSeen: {
    type: 'date',
  },
  contributionType: {
    type: 'enum',
    options: ['Automatic', 'Gift', 'Manual', 'None'],
  },
  contributionMonthlyAmount: {
    type: 'number',
  },
  contributionPeriod: {
    type: 'enum',
    options: ['monthly', 'annual'],
  },
  deliveryOptIn: {
    type: 'boolean',
  },
  newsletterStatus: {
    type: 'text',
  },
  activePermission: {
    type: 'enum',
    options: ['member', 'admin', 'superadmin'],
  },
  activeMembership: {
    type: 'boolean',
  },
  membershipStarts: {
    type: 'date',
  },
  membershipExpires: {
    type: 'date',
  },
  manualPaymentSource: {
    type: 'text',
  },
  tags: {
    type: 'array',
  },
};
