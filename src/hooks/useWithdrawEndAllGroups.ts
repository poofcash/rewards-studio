import { useContractKit } from "@celo-tools/use-contractkit";
import { DEFAULT_GAS } from "config";
import { useCallback, useMemo } from "react";
import { toastTx } from "utils/toastTx";
import { toBN } from "web3-utils";
import { SavingsKit } from "@poofcash/savingscelo";
import { usePendingWithdrawals } from "./usePendingWithdrawals";

export const useWithdrawEndAllGroups = () => {
  const { performActions, connect } = useContractKit();
  const [groupPendingWithdrawals] = usePendingWithdrawals();
  const now = useMemo(() => Math.ceil(Date.now() / 1000), []);
  return useCallback(() => {
    performActions(async (kit) => {
      if (!kit.defaultAccount) {
        connect();
        return;
      }
      for (const groupPendingWithdrawal of groupPendingWithdrawals) {
        const {
          totalAvailable,
          pendingWithdrawals,
          address,
        } = groupPendingWithdrawal;

        if (totalAvailable.gt(toBN(0))) {
          const savingsKit = new SavingsKit(kit, address);
          for (let i = 0; i < pendingWithdrawals.length; i++) {
            if (pendingWithdrawals[i].time.gt(now)) {
              continue;
            }
            const tx = await (
              await savingsKit.withdrawFinish(pendingWithdrawals, i)
            ).send({
              from: kit.defaultAccount,
              gasPrice: DEFAULT_GAS,
            });
            toastTx(await tx.getHash());
          }
        }
      }
    });
  }, [connect, groupPendingWithdrawals, now, performActions]);
};
