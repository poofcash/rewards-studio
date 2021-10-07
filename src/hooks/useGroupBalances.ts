import { useContractKit } from "@celo-tools/use-contractkit";
import React from "react";
import { useAsyncState } from "hooks/useAsyncState";
import IERC20Abi from "abis/IERC20.json";
import { AbiItem } from "@celo/connect";
import { REGISTRY } from "config";

export const useGroupBalances = () => {
  const { kit, address } = useContractKit();
  const call = React.useCallback(async () => {
    const balances = await Promise.all(
      REGISTRY.map((entry) => {
        const tokenContract = new kit.web3.eth.Contract(
          IERC20Abi as AbiItem[],
          entry.address
        );
        return tokenContract.methods.balanceOf(address).call();
      })
    );
    return balances.map((balance, i) => ({
      ...REGISTRY[i],
      balance,
    }));
  }, [address, kit.web3.eth.Contract]);

  return useAsyncState([], call);
};
