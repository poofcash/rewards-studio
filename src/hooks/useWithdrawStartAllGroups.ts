import { useContractKit } from "@celo-tools/use-contractkit";
import { DEFAULT_GAS } from "config";
import { useCallback } from "react";
import { SavingsCELO } from "generated/SavingsCELO";
import { toastTx } from "utils/toastTx";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import { AbiItem, toBN } from "web3-utils";
import { useWhiteListedTokens } from "./useWhiteListedTokens";
import { SavingsKit } from "@poofcash/savingscelo";

export const useWithdrawStartAllGroups = () => {
  const { performActions, connect } = useContractKit();
  const [whitelistedTokens] = useWhiteListedTokens();
  return useCallback(() => {
    performActions(async (kit) => {
      if (!kit.defaultAccount) {
        connect();
        return;
      }
      for (const groupAddress of whitelistedTokens) {
        const savings = (new kit.web3.eth.Contract(
          SavingsCELOAbi as AbiItem[],
          groupAddress
        ) as unknown) as SavingsCELO;
        const balance = await savings.methods
          .balanceOf(kit.defaultAccount)
          .call();
        if (toBN(balance).gt(toBN(0))) {
          const savingsKit = new SavingsKit(kit, groupAddress);
          const tx = await (await savingsKit.withdrawStart(balance)).send({
            from: kit.defaultAccount,
            gasPrice: DEFAULT_GAS,
          });
          toastTx(await tx.getHash());
        }
      }
    });
  }, [connect, performActions, whitelistedTokens]);
};
