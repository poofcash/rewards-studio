import React from "react";
import BigNumber from "bignumber.js";
import { useAsyncState } from "hooks/useAsyncState";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import SavingsCELOVoterAbi from "abis/SavingsCELOVoterV1.json";
import { AbiItem, isAddress } from "web3-utils";
import { SavingsCELO } from "generated/SavingsCELO";
import { SavingsCELOVoterV1 } from "generated/SavingsCELOVoterV1";
import { newVoterV1 } from "@poofcash/savingscelo";
import { useContractKit } from "@celo-tools/use-contractkit";
import { ZERO_ADDRESS } from "utils/constants";
import { SavingsKit } from "@poofcash/savingscelo";
import { PendingWithdrawal } from "@celo/contractkit/lib/wrappers/LockedGold";

export type WC = {
  owner: string;
  voter: string;
  lockedBalance: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  exchangeRate: string;

  voterOwner: string;
  votedGroup: string;
  needsActivate: boolean;
  pendingVotes: BigNumber;
  validVoter: boolean;

  userCeloBalance: string;
  userWrappedBalance: string;
  pendingWithdrawals: Array<PendingWithdrawal>;
};

export const useWrappedCELO = (wrappedAddress?: string | null) => {
  const { kit, address } = useContractKit();
  const savingsKit = React.useMemo(() => {
    if (!wrappedAddress) {
      return null;
    }
    return new SavingsKit(kit, wrappedAddress);
  }, [kit, wrappedAddress]);

  const wcCall = React.useCallback(async () => {
    if (!wrappedAddress || !isAddress(wrappedAddress)) {
      return null;
    }
    const tokenContract = (new kit.web3.eth.Contract(
      SavingsCELOAbi as AbiItem[],
      wrappedAddress
    ) as unknown) as SavingsCELO;
    const owner = await tokenContract.methods.owner().call();
    const voter = await tokenContract.methods._voter().call();
    const tokenName = await tokenContract.methods.name().call();
    const tokenSymbol = await tokenContract.methods.symbol().call();
    const lockedGoldContract = await kit._web3Contracts.getLockedGold();
    const lockedBalance = await lockedGoldContract.methods
      .getAccountTotalLockedGold(wrappedAddress)
      .call();
    const exchangeRate = await tokenContract.methods.celoToSavings(1).call();

    let voterOwner = ZERO_ADDRESS;
    let votedGroup = ZERO_ADDRESS;
    let needsActivate = false;
    let pendingVotes = new BigNumber(0);
    let validVoter = false;
    if (voter !== ZERO_ADDRESS) {
      try {
        const voterContract = (new kit.web3.eth.Contract(
          SavingsCELOVoterAbi as AbiItem[],
          voter
        ) as unknown) as SavingsCELOVoterV1;
        voterOwner = await voterContract.methods.owner().call();
        votedGroup = await voterContract.methods.votedGroup().call();
        // It is valid up to this point. Calls after this rely on a valid votedGroup
        validVoter = true;
        const smartVoter = await newVoterV1(kit, savingsKit!);
        needsActivate = await smartVoter.needsActivateAndVote();
        pendingVotes = await smartVoter.calcToVote();
      } catch (e) {
        console.error("Failed to fetch voter.", e);
      }
    }

    let userWrappedBalance = "0";
    let userCeloBalance = "0";
    let pendingWithdrawals: Array<PendingWithdrawal> = [];
    if (address) {
      userWrappedBalance = await tokenContract.methods
        .balanceOf(address)
        .call();
      const goldContract = await kit._web3Contracts.getGoldToken();
      userCeloBalance = await goldContract.methods.balanceOf(address).call();
      pendingWithdrawals = await savingsKit!.pendingWithdrawals(address);
    }

    return {
      owner,
      voter,
      lockedBalance,
      tokenName,
      tokenSymbol,
      tokenAddress: wrappedAddress,
      exchangeRate,

      voterOwner,
      votedGroup,
      needsActivate,
      pendingVotes,
      validVoter,

      userWrappedBalance,
      userCeloBalance,
      pendingWithdrawals,
    };
  }, [kit, wrappedAddress, savingsKit, address]);
  return useAsyncState<WC | null>(null, wcCall);
};
