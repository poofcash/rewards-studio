import { useContractKit } from "@celo-tools/use-contractkit";
import React from "react";
import { useAsyncState } from "hooks/useAsyncState";

export const useCELOBalance = () => {
  const { kit, address } = useContractKit();
  const call = React.useCallback(async () => {
    let userCeloBalance = "0";
    if (address) {
      const goldContract = await kit._web3Contracts.getGoldToken();
      userCeloBalance = await goldContract.methods.balanceOf(address).call();
    }
    return userCeloBalance;
  }, []);

  return useAsyncState("0", call);
};
