import { toastTx } from "utils/toastTx";
import { Flex, Button } from "theme-ui";
import { useContractKit } from "@celo-tools/use-contractkit";
import { WC } from "hooks/useWrappedCELO";
import { SavingsKit } from "@poofcash/savingscelo";
import { toWei } from "web3-utils";

interface Props {
  wc: WC;
  refetchWC: () => void;
}
export const WrappedActions: React.FC<Props> = ({ wc, refetchWC }) => {
  const { performActions } = useContractKit();

  return (
    <Flex sx={{ justifyContent: "center" }}>
      <Button
        mr={2}
        onClick={() => {
          performActions(async (kit) => {
            if (!kit.defaultAccount) {
              alert("No connected account.");
              return;
            }
            const amount = prompt("Enter amount of CELO to deposit");
            if (!amount) {
              return;
            }
            if (isNaN(Number(amount))) {
              alert("Not a number. Try again");
              return;
            }
            const savingsKit = new SavingsKit(kit, wc.tokenAddress);
            const tx = await savingsKit.deposit().send({
              from: kit.defaultAccount,
              value: toWei(amount),
              gasPrice: toWei("0.13", "gwei"),
            });
            toastTx(await tx.getHash());
            refetchWC();
          });
        }}
      >
        Deposit
      </Button>
      <Button
        onClick={() => {
          performActions(async (kit) => {
            if (!kit.defaultAccount) {
              alert("No connected account.");
              return;
            }
            const amount = prompt(
              `Enter amount of ${wc.tokenSymbol} to withdraw`
            );
            if (!amount) {
              return;
            }
            if (isNaN(Number(amount))) {
              alert("Not a number. Try again");
              return;
            }
            const savingsKit = new SavingsKit(kit, wc.tokenAddress);
            const tx = await (
              await savingsKit.withdrawStart(toWei(amount))
            ).send({
              from: kit.defaultAccount,
              gasPrice: toWei("0.13", "gwei"),
            });
            toastTx(await tx.getHash());
            refetchWC();
          });
        }}
      >
        Withdraw
      </Button>
    </Flex>
  );
};
