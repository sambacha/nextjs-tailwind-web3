import { TOKEN_ADDRESSES } from '@/constants/tokens';
import { CONTRACT_ADDRESSES } from '@/constants/contracts';
import { MaxUint256, MIN_INPUT_VALUE } from '@/constants/numbers';
import { useXFOLDFacetProxy, useTokenContract } from '@/hooks/useContract';
import useFormattedBigNumber from '@/hooks/useFormattedBigNumber';
import useInput from '@/hooks/useInput';
import useWeb3Store from '@/hooks/useWeb3Store';
import useXFOLDStaked from '@/hooks/view/useXFOLDStaked';
import useTokenAllowance from '@/hooks/view/useTokenAllowance';
import useTokenBalance from '@/hooks/view/useTokenBalance';
import handleError from '@/utils/handleError';
import { formatUnits, parseUnits } from '@ethersproject/units';
import type { FormEvent } from 'react';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import Button, { MaxButton } from '../button';
import { TransactionToast } from '../customToast';
import NumericalInput from '../numericalInput';
import { TokenSingle } from '../tokenSelect';

export default function DepositStake() {
  const account = useWeb3Store((state) => state.account);
  const chainId = useWeb3Store((state) => state.chainId);

  const USDFacet = useXFOLDFacetProxy();

  const { data: xfoldBalance, mutate: xfoldBalanceMutate } = useTokenBalance(
    account,
    TOKEN_ADDRESSES.XFOLD[chainId],
  );

  const { mutate: xfoldStakedMutate } = useXFOLDStaked();

  const formattedXFOLDBalance = useFormattedBigNumber(xfoldBalance);

  const depositInput = useInput();

  const xfoldContract = useTokenContract(TOKEN_ADDRESSES.XFOLD[chainId]);

  const { data: xfoldAllowance, mutate: xfoldAllowanceMutate } =
    useTokenAllowance(
      TOKEN_ADDRESSES.XFOLD[chainId],
      account,
      CONTRACT_ADDRESSES.XFOLDFacetProxy[chainId],
    );

  const xfoldNeedsApproval = useMemo(() => {
    if (!!xfoldAllowance && depositInput.hasValue) {
      return xfoldAllowance.isZero();
    }

    return;
  }, [xfoldAllowance, depositInput.hasValue]);

  async function depositXFOLD(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const _id = toast.loading('Waiting for confirmation');

    try {
      const depositAmount = depositInput.value;

      if (Number(depositAmount) <= MIN_INPUT_VALUE) {
        throw new Error(`Minium Deposit: ${MIN_INPUT_VALUE} XFOLD`);
      }

      const amount = parseUnits(depositAmount);

      if (amount.gt(xfoldBalance)) {
        throw new Error(`Maximum Deposit: ${formattedXFOLDBalance} XFOLD`);
      }

      const transaction = await USDFacet.deposit(amount);

      depositInput.clear();

      toast.loading(
        <TransactionToast
          hash={transaction.hash}
          chainId={chainId}
          message={`Deposit ${depositAmount} XFOLD`}
        />,
        { id: _id },
      );

      await transaction.wait();

      toast.success(
        <TransactionToast
          hash={transaction.hash}
          chainId={chainId}
          message={`Deposit ${depositAmount} XFOLD`}
        />,
        { id: _id },
      );

      xfoldStakedMutate();
      xfoldBalanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  async function approveXFOLD() {
    const _id = toast.loading('Waiting for confirmation');

    try {
      const transaction = await xfoldContract.approve(
        CONTRACT_ADDRESSES.XFOLDFacetProxy[chainId],
        MaxUint256,
      );

      toast.loading(`Approve XFOLD`, { id: _id });

      await transaction.wait();

      toast.success(`Approve XFOLD`, { id: _id });

      xfoldAllowanceMutate();
    } catch (error) {
      handleError(error, _id);
    }
  }

  const inputIsMax =
    !!xfoldBalance && depositInput.value === formatUnits(xfoldBalance);

  const setMax = () => {
    depositInput.setValue(formatUnits(xfoldBalance));
  };

  return (
    <form onSubmit={depositXFOLD} method="POST" className="space-y-4">
      <div className="flex justify-between">
        <h2 className="font-medium leading-5">Deposit Stake</h2>
      </div>

      <div>
        <div className="flex space-x-4 mb-2">
          <TokenSingle symbol="XFOLD" />

          <div className="flex-1">
            <label className="sr-only" htmlFor="stakeDeposit">
              Enter amount of XFOLD to deposit
            </label>

            <NumericalInput
              id="stakeDeposit"
              name="stakeDeposit"
              required
              {...depositInput.valueBind}
            />
          </div>
        </div>

        <p className="text-sm text-gray-300 h-5">
          {xfoldBalance && formattedXFOLDBalance ? (
            <>
              <span>{`Balance: ${formattedXFOLDBalance} XFOLD`}</span>{' '}
              {!inputIsMax && <MaxButton onClick={setMax} />}
            </>
          ) : null}
        </p>
      </div>

      <div className="space-y-4">
        {xfoldNeedsApproval && (
          <Button onClick={approveXFOLD}>
            {`Approve Manifold Finance To Spend Your XFOLD`}
          </Button>
        )}

        <Button
          disabled={!depositInput.hasValue || xfoldNeedsApproval}
          type="submit"
        >
          {depositInput.hasValue ? 'Deposit' : 'Enter an amount'}
        </Button>
      </div>
    </form>
  );
}
