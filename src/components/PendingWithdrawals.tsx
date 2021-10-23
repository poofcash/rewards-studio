import React from "react";
import moment from "moment";
import { Box, Button, Card, Flex, Text } from "theme-ui";
import { FixedSizeList } from "react-window";
import { humanFriendlyWei } from "utils/number";
import { LogOut } from "react-feather";
import { useContractKit } from "@celo-tools/use-contractkit";
import { SavingsKit } from "@poofcash/savingscelo";
import { WC } from "hooks/useWrappedCELO";
import { toastTx } from "utils/toastTx";
import { toWei } from "web3-utils";
import { X } from "phosphor-react";

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: { wc: WC; refetchWC: () => void };
}

const Row: React.FC<RowProps> = ({ index, style, data }) => {
  const { wc, refetchWC } = data;
  const pendingWithdrawal = wc.pendingWithdrawals[index];
  const { performActions } = useContractKit();
  const eta = moment.unix(pendingWithdrawal.time.toNumber());
  const now = React.useMemo(() => moment(), []);
  return (
    <Box style={style} mb={2}>
      <Card>
        <Flex sx={{ justifyContent: "space-between" }}>
          <Box>
            <Box>
              <Text mr={2}>Amount:</Text>
              <Text>
                {humanFriendlyWei(pendingWithdrawal.value.toFixed())} CELO
              </Text>
            </Box>
            <Box>
              <Text mr={2}>ETA:</Text>
              <Text>{eta.fromNow()}</Text>
            </Box>
          </Box>
          <Button
            mr={2}
            disabled={eta.unix() > now.unix()}
            onClick={() => {
              performActions(async (kit) => {
                if (!kit.defaultAccount) {
                  alert("No connected account.");
                  return;
                }
                const savingsKit = new SavingsKit(kit, wc.tokenAddress);
                const tx = await (
                  await savingsKit.withdrawFinish(wc.pendingWithdrawals, index)
                ).send({
                  from: kit.defaultAccount,
                  gasPrice: toWei("0.13", "gwei"),
                });
                toastTx(await tx.getHash());
                refetchWC();
              });
            }}
          >
            <LogOut />
          </Button>
          <Button
            onClick={() => {
              performActions(async (kit) => {
                if (!kit.defaultAccount) {
                  alert("No connected account.");
                  return;
                }
                const savingsKit = new SavingsKit(kit, wc.tokenAddress);
                const tx = await (
                  await savingsKit.withdrawCancel(wc.pendingWithdrawals, index)
                ).send({
                  from: kit.defaultAccount,
                  gasPrice: toWei("0.13", "gwei"),
                });
                toastTx(await tx.getHash());
                refetchWC();
              });
            }}
          >
            <X size={24} />
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};

interface Props {
  wc: WC;
  refetchWC: () => void;
}

export const PendingWithdrawals: React.FC<Props> = ({ wc, refetchWC }) => {
  return (
    <FixedSizeList
      itemData={{ wc, refetchWC }}
      height={100}
      itemSize={72}
      width={254}
      itemCount={wc.pendingWithdrawals.length}
    >
      {Row}
    </FixedSizeList>
  );
};
