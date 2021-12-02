import type { XFOLDFacet } from '@/contracts/types';
import calculateLockupMultiplier from '@/utils/calculateLockupMultiplier';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import useSWR from 'swr';
import { useXFOLDFacetProxy } from '../useContract';
import useWeb3Store from '../useWeb3Store';

dayjs.extend(utc);

function getUserLockedUntil(contract: XFOLDFacet) {
  return async (_: string, address: string) => {
    const lockedUntilTimestamp = await contract.userLockedUntil(address);

    const timestamp = lockedUntilTimestamp.toNumber();

    const isLocked = dayjs.unix(timestamp).isAfter(dayjs());

    const formatted = dayjs.unix(timestamp).format('MMM D, YYYY');

    const multiplier = calculateLockupMultiplier(
      dayjs.unix(timestamp).diff(dayjs(), 'days'),
    );

    return {
      timestamp,
      formatted,
      multiplier,
      isLocked,
    };
  };
}

export default function useUserLockedUntil() {
  const account = useWeb3Store((state) => state.account);
  const contract = useXFOLDFacetProxy();

  const shouldFetch = !!contract && typeof account === 'string';

  return useSWR(
    shouldFetch ? ['UserLockedUntil', account] : null,
    getUserLockedUntil(contract),
  );
}
