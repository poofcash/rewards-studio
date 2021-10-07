import { useContractKit } from "@celo-tools/use-contractkit";
import React from "react";
import { useAsyncState } from "hooks/useAsyncState";
import { REGISTRY } from "config";
import { SavingsKit } from "@poofcash/savingscelo";

export const usePendingWithdrawals = () => {
  const { kit, address } = useContractKit();
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
    return pendingWithdrawals.map((list, i) => ({
      ...REGISTRY[i],
      pendingWithdrawals: list,
    }));
  }, [address, kit]);

  return useAsyncState([], call);
};
