import { useContractKit } from "@celo-tools/use-contractkit";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import { SavingsCELO } from "generated/SavingsCELO";
import React from "react";
import { AbiItem } from "web3-utils";
import { useAsyncState } from "./useAsyncState";

export const useGroupExchangeRate = (groupAddress?: string) => {
  const { kit } = useContractKit();
  const call = React.useCallback(async () => {
    if (!groupAddress || groupAddress === "") {
      return "64000";
    }
    const savings = (new kit.web3.eth.Contract(
      SavingsCELOAbi as AbiItem[],
      groupAddress
    ) as unknown) as SavingsCELO;
    return await savings.methods.celoToSavings(1).call();
  }, [groupAddress, kit.web3.eth.Contract]);

  return useAsyncState("64000", call);
};
