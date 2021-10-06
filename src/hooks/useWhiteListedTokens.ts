import { useContractKit } from "@celo-tools/use-contractkit";
import { AbiItem } from "@celo/connect";
import RewardsCELOAbi from "abis/RewardsCELO.json";
import { RCELO } from "config";
import { RewardsCELO } from "generated/RewardsCELO";
import React from "react";
import { useAsyncState } from "./useAsyncState";

export const useWhiteListedTokens = () => {
  const { kit, network } = useContractKit();

  const call = React.useCallback(async () => {
    const rcelo = (new kit.web3.eth.Contract(
      RewardsCELOAbi as AbiItem[],
      RCELO[network.chainId]
    ) as unknown) as RewardsCELO;
    return await rcelo
      .getPastEvents("WrappedCeloAdded", {
        fromBlock: 0,
        toBlock: "latest",
      })
      .then((events) => events.map((event) => event.returnValues.wrappedCelo));
  }, [kit.web3.eth.Contract, network.chainId]);

  return useAsyncState([], call);
};
