import { useContractKit } from "@celo-tools/use-contractkit";
import React from "react";
import { useAsyncState } from "hooks/useAsyncState";
import { REGISTRY } from "config";
import { SavingsKit } from "@poofcash/savingscelo";
import { toBN } from "web3-utils";

export const usePendingWithdrawals = () => {
  const { kit, address } = useContractKit();
  const now = React.useMemo(() => toBN(Math.ceil(Date.now() / 1000)), []);
  const call = React.useCallback(async () => {
    const pendingWithdrawals = await Promise.all(
      REGISTRY.map((entry) => {
        if (!address) {
          return [];
        }
        const savingsKit = new SavingsKit(kit, entry.address);
        return savingsKit!.pendingWithdrawals(address);
      })
    );
    return pendingWithdrawals.map((list, i) => {
      const pendingWithdrawalsBN = list.map((i) => ({
        time: toBN(i.time.toFixed()),
        value: toBN(i.value.toFixed()),
      }));
      return {
        ...REGISTRY[i],
        pendingWithdrawals: list,
        pendingWithdrawalsBN,
        totalAvailable: pendingWithdrawalsBN
          .filter((p) => p.time.lt(now))
          .reduce((acc, p) => acc.add(p.value), toBN(0)),
      };
    });
  }, [address, kit, now]);

  return useAsyncState([], call);
};
