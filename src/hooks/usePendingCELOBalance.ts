import { usePendingWithdrawals } from "./usePendingWithdrawals";
import { toBN } from "web3-utils";

export const usePendingCELOBalance = () => {
  const [list] = usePendingWithdrawals();
  return list.reduce((acc, entry) => {
    return acc.add(
      entry.pendingWithdrawals.reduce((acc2, pendingWithdrawal) => {
        return acc2.add(toBN(pendingWithdrawal.value.toFixed()));
      }, toBN(0))
    );
  }, toBN(0));
};
