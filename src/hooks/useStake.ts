import { useContractKit } from "@celo-tools/use-contractkit";
import { DEFAULT_GAS, MAX_UINT, RCELO, RegistryEntry } from "config";
import { useCallback } from "react";
import { SavingsCELO } from "generated/SavingsCELO";
import { RewardsCELO } from "generated/RewardsCELO";
import { toastTx } from "utils/toastTx";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import RewardsCELOAbi from "abis/RewardsCELO.json";
import { AbiItem, toBN, toWei } from "web3-utils";
import { useWhiteListedTokens } from "./useWhiteListedTokens";

export const useStake = (amount: string, wrapped: RegistryEntry) => {
  const { performActions, connect, network } = useContractKit();
  const [whitelistedTokens] = useWhiteListedTokens();
  return useCallback(() => {
    performActions(async (kit) => {
      if (!kit.defaultAccount) {
        connect();
        return;
      }
      if (!wrapped) {
        alert("No group selected.");
        return;
      }
      const savings = (new kit.web3.eth.Contract(
        SavingsCELOAbi as AbiItem[],
        wrapped.address
      ) as unknown) as SavingsCELO;
      const savingsAmount = await savings.methods
        .celoToSavings(toWei(amount))
        .call();
      const tx1 = await savings.methods.deposit().send({
        from: kit.defaultAccount,
        value: toWei(amount),
        gasPrice: DEFAULT_GAS,
      });
      toastTx(tx1.transactionHash);

      const wrappedIdx = whitelistedTokens.indexOf(wrapped.address);
      const rceloAddress = RCELO[network.chainId];
      if (wrappedIdx && rceloAddress) {
        const allowance = await savings.methods
          .allowance(kit.defaultAccount, rceloAddress)
          .call();

        if (toBN(allowance).lt(toBN(savingsAmount))) {
          const tx = await savings.methods
            .approve(rceloAddress, MAX_UINT)
            .send({
              from: kit.defaultAccount,
              gasPrice: DEFAULT_GAS,
            });
          toastTx(tx.transactionHash);
        }
        const rcelo = (new kit.web3.eth.Contract(
          RewardsCELOAbi as AbiItem[],
          rceloAddress
        ) as unknown) as RewardsCELO;
        const tx2 = await rcelo.methods
          .deposit(savingsAmount, wrappedIdx)
          .send({
            from: kit.defaultAccount,
            gasPrice: DEFAULT_GAS,
          });
        toastTx(tx2.transactionHash);
      }
    });
  }, [
    amount,
    connect,
    network.chainId,
    performActions,
    whitelistedTokens,
    wrapped,
  ]);
};
