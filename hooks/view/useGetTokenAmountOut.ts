import { BALANCER_POOL_ADDRESS } from '@/constants/contracts';
import { TOKEN_ADDRESSES } from '@/constants/tokens';
import type { ERC20, PoolRouter } from '@/contracts/types';
import { BigNumber } from '@ethersproject/bignumber';
import useSWR from 'swr';
import { usePoolRouter, useTokenContract } from '../useContract';
import useWeb3Store from '../useWeb3Store';
import useTokenBalance from './useTokenBalance';

function getGetTokenAmountOut(
  poolRouter: PoolRouter,
  withdrawTokenContract: ERC20,
) {
  return async (
    _: string,
    withdrawToken: string,
    foldAmountIn: BigNumber,
    chainId: number,
  ) => {
    const getTokenAmountOutSingle = await poolRouter.getTokenAmountOutSingle(
      withdrawToken,
      foldAmountIn,
      1,
    );

    const poolBalance = await withdrawTokenContract.balanceOf(
      BALANCER_POOL_ADDRESS[chainId],
    );

    const maxWithdraw = poolBalance.div(3);

    if (getTokenAmountOutSingle.gt(maxWithdraw)) {
      return maxWithdraw;
    }

    return getTokenAmountOutSingle;
  };
}

export default function useGetTokenAmountOut(withdrawToken: string) {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const { data: foldBalance } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.FOLD[chainId],
  );

  const poolRouter = usePoolRouter();

  const withdrawTokenContract = useTokenContract(withdrawToken);

  const shouldFetch =
    !!poolRouter &&
    !!withdrawTokenContract &&
    !!foldBalance &&
    typeof withdrawToken === 'string';

  return useSWR(
    shouldFetch
      ? ['GetTokenAmountOut', withdrawToken, foldBalance, chainId]
      : null,
    getGetTokenAmountOut(poolRouter, withdrawTokenContract),
  );
}
