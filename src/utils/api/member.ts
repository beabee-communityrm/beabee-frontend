import axios from '../../axios';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import {
  ContributionInfo,
  GetMemberData,
  GetMemberDataWith,
  GetMembersQuery,
  GetMemberWith,
  GetPaymentData,
  GetPaymentsQuery,
  MemberRoleData,
  Paginated,
  PaymentFlowParams,
  PermissionType,
  Serial,
  SetContributionData,
  StartContributionData,
  UpdateMemberData,
  UpdateMemberRoleData,
} from './api.interface';

import { deserializeDate } from '.';
import env from '../../env';

// TODO: how to make this type safe?
export function deserializeMember(data: any): any {
  return {
    ...data,
    joined: deserializeDate(data.joined),
    lastSeen: deserializeDate(data.lastSeen),
    ...(data.contribution && {
      contribution: deserializeContribution(data.contribution),
    }),
    ...(data.roles && {
      roles: data.roles.map(deserializeRole),
    }),
  };
}

function deserializeRole(data: Serial<MemberRoleData>): MemberRoleData {
  return {
    role: data.role,
    dateAdded: deserializeDate(data.dateAdded),
    dateExpires: data.dateExpires ? deserializeDate(data.dateExpires) : null,
  };
}

function deserializeContribution(
  data: Serial<ContributionInfo>
): ContributionInfo {
  return {
    ...data,
    cancellationDate: deserializeDate(data.cancellationDate),
    membershipExpiryDate: deserializeDate(data.membershipExpiryDate),
    renewalDate: deserializeDate(data.renewalDate),
  };
}

export async function fetchMembers(
  query: GetMembersQuery
): Promise<Paginated<GetMemberData>>;
export async function fetchMembers<With extends GetMemberWith>(
  query: GetMembersQuery,
  _with: readonly With[]
): Promise<Paginated<GetMemberDataWith<With>>>;
export async function fetchMembers<With extends GetMemberWith>(
  query: GetMembersQuery = {},
  _with?: readonly With[]
): Promise<Paginated<GetMemberDataWith<With>>> {
  // TODO: fix type safety
  const { data } = await axios.get('/member', {
    params: { with: _with, ...query },
  });
  return {
    ...data,
    items: data.items.map(deserializeMember),
  };
}

export async function fetchMember(id: string): Promise<GetMemberData>;
export async function fetchMember<With extends GetMemberWith>(
  id: string,
  _with: readonly With[]
): Promise<GetMemberDataWith<With>>;
export async function fetchMember<With extends GetMemberWith>(
  id: string,
  _with?: readonly With[]
): Promise<GetMemberDataWith<With>> {
  const { data } = await axios.get<Serial<GetMemberData>>(`/member/${id}`, {
    params: { with: _with },
  });
  return deserializeMember(data);
}

export async function updateMember(
  id: string,
  memberData: UpdateMemberData
): Promise<GetMemberData> {
  const { data } = await axios.patch<Serial<GetMemberData>>(
    `/member/${id}`,
    // TODO: passing memberData directly is not type safe, it could contain extra properties
    memberData
  );
  return deserializeMember(data);
}

export async function addMemberRole(
  id: string,
  roleData: MemberRoleData
): Promise<GetMemberData> {
  const { data } = await axios.patch<Serial<GetMemberData>>(
    `/member/${id}/role/add`,
    roleData
  );
  return deserializeRole(data);
}

export async function fetchContribution(): Promise<ContributionInfo> {
  const { data } = await axios.get<Serial<ContributionInfo>>(
    '/member/me/contribution'
  );
  return deserializeContribution(data);
}

export async function updateContribution(
  dataIn: SetContributionData
): Promise<ContributionInfo> {
  const { data } = await axios.patch<Serial<ContributionInfo>>(
    '/member/me/contribution',
    {
      amount: dataIn.amount,
      payFee: dataIn.payFee && dataIn.period === ContributionPeriod.Monthly,
      prorate: dataIn.prorate && dataIn.period === ContributionPeriod.Annually,
    }
  );
  return deserializeContribution(data);
}

export const startContributionCompleteUrl =
  env.appUrl + '/profile/contribution/complete';

export async function startContribution(
  dataIn: StartContributionData
): Promise<PaymentFlowParams> {
  const { data } = await axios.post<Serial<PaymentFlowParams>>(
    '/member/me/contribution',
    {
      amount: dataIn.amount,
      period: dataIn.period,
      payFee: dataIn.payFee && dataIn.period === ContributionPeriod.Monthly,
      prorate: dataIn.prorate && dataIn.period === ContributionPeriod.Annually,
      paymentMethod: dataIn.paymentMethod,
      completeUrl: startContributionCompleteUrl,
    }
  );
  return data;
}

export async function completeStartContribution(
  paymentFlowId: string
): Promise<ContributionInfo> {
  const { data } = await axios.post<Serial<ContributionInfo>>(
    '/member/me/contribution/complete',
    { paymentFlowId }
  );
  return deserializeContribution(data);
}
export async function cancelContribution(): Promise<void> {
  await axios.post('/member/me/contribution/cancel');
}

export const updatePaymentMethodCompleteUrl =
  env.appUrl + '/profile/contribution/payment-method/complete';

export async function updatePaymentMethod(
  paymentMethod?: PaymentMethod
): Promise<PaymentFlowParams> {
  const { data } = await axios.put<Serial<PaymentFlowParams>>(
    '/member/me/payment-method',
    { paymentMethod, completeUrl: updatePaymentMethodCompleteUrl }
  );
  return data;
}

export async function completeUpdatePaymentMethod(
  paymentFlowId: string
): Promise<ContributionInfo> {
  const { data } = await axios.post<Serial<ContributionInfo>>(
    '/member/me/payment-method/complete',
    { paymentFlowId }
  );
  return deserializeContribution(data);
}

export async function fetchPayments(
  id: string,
  query: GetPaymentsQuery
): Promise<Paginated<GetPaymentData>> {
  const { data } = await axios.get(`/member/${id}/payment`, { params: query });
  return {
    ...data,
    items: data.items.map((item: any) => ({
      chargeDate: deserializeDate(item.chargeDate),
      amount: item.amount,
      status: item.status,
    })),
  };
}

export async function updateRole(
  id: string,
  role: PermissionType,
  dataIn: UpdateMemberRoleData
): Promise<MemberRoleData> {
  const { data } = await axios.put<Serial<MemberRoleData>>(
    `/member/${id}/role/${role}`,
    dataIn
  );
  return deserializeRole(data);
}

export async function deleteRole(
  id: string,
  role: PermissionType
): Promise<void> {
  await axios.delete(`/member/${id}/role/${role}`);
}
