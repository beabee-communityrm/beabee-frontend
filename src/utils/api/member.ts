import { parseISO } from 'date-fns';
import axios from '../../axios';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import {
  ContributionInfo,
  GetMemberData,
  GetMemberDataWithProfile,
  Serial,
  SetContributionData,
  UpdateMemberData,
} from './api.interface';

async function req<T>(
  method: 'get' | 'patch' | 'post' | 'put' | 'delete',
  url: string,
  data?: any
): Promise<Serial<T>> {
  return (await axios[method]<Serial<T>>(url, data)).data;
}

function toDate(s: string): Date;
function toDate(s: string | undefined): Date | undefined;
function toDate(s: string | undefined): Date | undefined {
  return s ? parseISO(s) : undefined;
}

function toContrib(data: Serial<ContributionInfo>): ContributionInfo {
  return {
    ...data,
    cancellationDate: toDate(data.cancellationDate),
    membershipExpiryDate: toDate(data.membershipExpiryDate),
    renewalDate: toDate(data.renewalDate),
  };
}

export async function fetchMember(): Promise<GetMemberData> {
  const data = await req<GetMemberData>('get', '/member/me');
  return {
    ...data,
    joined: toDate(data.joined),
  };
}

export async function fetchMemberWithProfile(): Promise<GetMemberDataWithProfile> {
  const data = await req<GetMemberDataWithProfile>(
    'get',
    '/member/me?with[]=profile'
  );
  return {
    ...data,
    joined: toDate(data.joined),
  };
}

export async function updateMember(
  memberData: UpdateMemberData
): Promise<GetMemberData> {
  // TODO: passing memberData directly is not type safe, it could contain extra properties
  const data = await req<GetMemberData>('patch', '/member/me', memberData);
  return {
    ...data,
    joined: toDate(data.joined),
  };
}

export async function fetchContribution(): Promise<ContributionInfo> {
  return toContrib(
    await req<ContributionInfo>('get', '/member/me/contribution')
  );
}

export async function updateContribution(
  data: SetContributionData
): Promise<ContributionInfo> {
  return toContrib(
    await req<ContributionInfo>('patch', '/member/me/contribution', {
      amount: data.amount,
      payFee: data.payFee && data.period === ContributionPeriod.Monthly,
      prorate: data.prorate && data.period === ContributionPeriod.Annually,
    })
  );
}

export async function startContribution(
  data: SetContributionData
): Promise<{ redirectUrl: string }> {
  return (
    await axios.post<Serial<{ redirectUrl: string }>>(
      '/member/me/contribution',
      {
        amount: data.amount,
        period: data.period,
        payFee: data.payFee && data.period === ContributionPeriod.Monthly,
        prorate: data.prorate && data.period === ContributionPeriod.Annually,
        completeUrl:
          import.meta.env.VITE_APP_BASE_URL + '/profile/contribution/complete',
      }
    )
  ).data;
}

export async function completeStartContribution(
  redirectFlowId: string
): Promise<ContributionInfo> {
  return toContrib(
    await req<ContributionInfo>('post', '/member/me/contribution/complete', {
      redirectFlowId,
    })
  );
}
export async function cancelContribution(): Promise<void> {
  await req('post', '/member/me/contribution/cancel');
}

export async function updatePaymentSource(): Promise<{ redirectUrl: string }> {
  return await req<{ redirectUrl: string }>(
    'put',
    '/member/me/payment-source',
    {
      completeUrl:
        import.meta.env.VITE_APP_BASE_URL +
        '/profile/contribution/payment-source/complete',
    }
  );
}

export async function completeUpdatePaymentSource(
  redirectFlowId: string
): Promise<ContributionInfo> {
  return toContrib(
    await req<ContributionInfo>('post', '/member/me/payment-source/complete', {
      redirectFlowId,
    })
  );
}
