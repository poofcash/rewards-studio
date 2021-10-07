import { useContractKit } from "@celo-tools/use-contractkit";
import { DEFAULT_GAS, RCELO } from "config";
import { useCallback } from "react";
import { SavingsCELO } from "generated/SavingsCELO";
import { RewardsCELO } from "generated/RewardsCELO";
import { toastTx } from "utils/toastTx";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import RewardsCELOAbi from "abis/RewardsCELO.json";
import { AbiItem, toBN } from "web3-utils";
import { useWhiteListedTokens } from "./useWhiteListedTokens";

export const useStakeAllGroups = () => {
  const { performActions, connect, network } = useContractKit();
  const [whitelistedTokens] = useWhiteListedTokens();
  return useCallback(() => {
    performActions(async (kit) => {
      if (!kit.defaultAccount) {
        connect();
        return;
      }
      for (let i = 0; i < whitelistedTokens.length; i++) {
        const groupAddress = whitelistedTokens[i];
        const savings = (new kit.web3.eth.Contract(
          SavingsCELOAbi as AbiItem[],
          groupAddress
        ) as unknown) as SavingsCELO;
        const balance = await savings.methods
          .balanceOf(kit.defaultAccount)
          .call();
        if (toBN(balance).gt(toBN(0))) {
          const rcelo = (new kit.web3.eth.Contract(
            RewardsCELOAbi as AbiItem[],
            RCELO[network.chainId]
          ) as unknown) as RewardsCELO;
          const tx1 = await rcelo.methods
            .deposit(balance, i)
            .send({ from: kit.defaultAccount, gasPrice: DEFAULT_GAS });
          toastTx(tx1.transactionHash);
        }
      }
    });
  }, [connect, network.chainId, performActions, whitelistedTokens]);
};
