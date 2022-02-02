import { parseISO } from 'date-fns';
import axios from '../../axios';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import {
  ContributionInfo,
  GetMemberData,
  GetMemberDataWithProfile,
  GetMembersQuery,
  Paginated,
  Serial,
  SetContributionData,
  UpdateMemberData,
} from './api.interface';

function toDate(s: string): Date;
function toDate(s: string | undefined): Date | undefined;
function toDate(s: string | undefined): Date | undefined {
  return s ? parseISO(s) : undefined;
}

// TODO: how to make this type safe?
export function toMember(data: any): any {
  return {
    ...data,
    joined: toDate(data.joined),
  };
}

function toContrib(data: Serial<ContributionInfo>): ContributionInfo {
  return {
    ...data,
    cancellationDate: toDate(data.cancellationDate),
    membershipExpiryDate: toDate(data.membershipExpiryDate),
    renewalDate: toDate(data.renewalDate),
  };
}

export async function fetchMembers(
  query: GetMembersQuery = {}
): Promise<Paginated<GetMemberDataWithProfile>> {
  // TODO: fix type safety
  const { data } = await axios.get('/member', {
    params: { with: ['profile'], ...query },
  });
  return {
    ...data,
    items: data.items.map(toMember),
  };
}

export async function fetchMember(id: string): Promise<GetMemberData> {
  const { data } = await axios.get<Serial<GetMemberData>>(`/member/${id}`);
  return toMember(data);
}

export async function fetchMemberWithProfile(
  id: string
): Promise<GetMemberDataWithProfile> {
  const { data } = await axios.get<Serial<GetMemberDataWithProfile>>(
    `/member/${id}?with[]=profile`
  );
  return toMember(data);
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
  return toMember(data);
}

export async function fetchContribution(): Promise<ContributionInfo> {
  const { data } = await axios.get<Serial<ContributionInfo>>(
    '/member/me/contribution'
  );
  return toContrib(data);
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
  return toContrib(data);
}

export async function startContribution(
  dataIn: SetContributionData
): Promise<{ redirectUrl: string }> {
  const { data } = await axios.post<Serial<{ redirectUrl: string }>>(
    '/member/me/contribution',
    {
      amount: dataIn.amount,
      period: dataIn.period,
      payFee: dataIn.payFee && dataIn.period === ContributionPeriod.Monthly,
      prorate: dataIn.prorate && dataIn.period === ContributionPeriod.Annually,
      completeUrl:
        import.meta.env.VITE_APP_BASE_URL + '/profile/contribution/complete',
    }
  );
  return data;
}

export async function completeStartContribution(
  redirectFlowId: string
): Promise<ContributionInfo> {
  const { data } = await axios.post<Serial<ContributionInfo>>(
    '/member/me/contribution/complete',
    { redirectFlowId }
  );
  return toContrib(data);
}
export async function cancelContribution(): Promise<void> {
  await axios.post('/member/me/contribution/cancel');
}

export async function updatePaymentSource(): Promise<{ redirectUrl: string }> {
  const { data } = await axios.put<Serial<{ redirectUrl: string }>>(
    '/member/me/payment-source',
    {
      completeUrl:
        import.meta.env.VITE_APP_BASE_URL +
        '/profile/contribution/payment-source/complete',
    }
  );
  return data;
}

export async function completeUpdatePaymentSource(
  redirectFlowId: string
): Promise<ContributionInfo> {
  const { data } = await axios.post<Serial<ContributionInfo>>(
    '/member/me/payment-source/complete',
    { redirectFlowId }
  );
  return toContrib(data);
}
