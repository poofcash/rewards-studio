import { useContractKit } from "@celo-tools/use-contractkit";
import React from "react";
import { useAsyncState } from "hooks/useAsyncState";
import IERC20Abi from "abis/IERC20.json";
import { AbiItem } from "@celo/connect";

export const useTokenBalance = (tokenAddress?: string) => {
  const { kit, address } = useContractKit();
  const call = React.useCallback(async () => {
    if (!address || !tokenAddress) {
      return "0";
    }

    const tokenContract = new kit.web3.eth.Contract(
      IERC20Abi as AbiItem[],
      tokenAddress
    );
    return await tokenContract.methods.balanceOf(address).call();
  }, [address, kit.web3.eth.Contract, tokenAddress]);

  return useAsyncState("0", call);
};
