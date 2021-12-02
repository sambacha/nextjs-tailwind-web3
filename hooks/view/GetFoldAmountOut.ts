import type { PoolRouter } from '@/contracts/types';
import { parseUnits } from '@ethersproject/units';
import useSWR from 'swr';
import { usePoolRouter } from '../useContract';

function getFoldAmountOut(contract: PoolRouter) {
  return async (_: string, depositAmount: string, depositToken: string) => {
    const getFoldAmountOutSingle = await contract.getFoldAmountOutSingle(
      depositToken,
      parseUnits(depositAmount),
      1,
    );

    return getFoldAmountOutSingle;
  };
}

export default function useGetFoldAmountOut(
  depositToken: string,
  depositAmount: string,
) {
  const contract = usePoolRouter();

  const shouldFetch =
    !!contract &&
    typeof depositAmount === 'string' &&
    typeof depositToken === 'string';

  return useSWR(
    shouldFetch ? ['GetFoldAmountOut', depositAmount, depositToken] : null,
    getFoldAmountOut(contract),
    {
      shouldRetryOnError: false,
    },
  );
}
