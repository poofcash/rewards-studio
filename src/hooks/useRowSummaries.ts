import React from "react";
import { useAsyncState } from "hooks/useAsyncState";
import { useContractKit } from "@celo-tools/use-contractkit";
import { RegistryEntry } from "config";
import { fromWei } from "web3-utils";

export type RegistrySummary = {
  entry: RegistryEntry;
  tvl: number;
};

export const useRowSummaries = (rows: RegistryEntry[]) => {
  const { kit } = useContractKit();

  const call = React.useCallback(async () => {
    return await Promise.all(
      rows.map(async (entry) => {
        const lockedGoldContract = await kit._web3Contracts.getLockedGold();
        const lockedBalance = await lockedGoldContract.methods
          .getAccountTotalLockedGold(entry.address)
          .call();
        const exchange = await kit.contracts.getExchange();
        const tvl = await exchange.quoteGoldSell(lockedBalance);
        return {
          tvl: Number(fromWei(tvl.toFixed())),
          entry,
        };
      })
    );
  }, [kit, rows]);
  return useAsyncState<RegistrySummary[]>([], call);
};
