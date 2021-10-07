import { useContractKit } from "@celo-tools/use-contractkit";
import React from "react";
import { useAsyncState } from "hooks/useAsyncState";
import RewardsCELOAbi from "abis/RewardsCELO.json";
import { AbiItem } from "@celo/connect";
import { RCELO } from "config";
import { RewardsCELO } from "generated/RewardsCELO";

export const useRCELOExchangeRate = () => {
  const { kit, network } = useContractKit();
  const call = React.useCallback(async () => {
    const rcelo = (new kit.web3.eth.Contract(
      RewardsCELOAbi as AbiItem[],
      RCELO[network.chainId]
    ) as unknown) as RewardsCELO;
    return await rcelo.methods.celoToSavings(1).call();
  }, [kit.web3.eth.Contract, network.chainId]);
  return useAsyncState("64000", call);
};
