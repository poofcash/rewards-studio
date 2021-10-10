import React from "react";
import { Box, Button, Card, Flex, Text } from "@theme-ui/components";
import { usePendingWithdrawals } from "hooks/usePendingWithdrawals";
import { humanFriendlyWei } from "utils/number";
import { toBN } from "web3-utils";
import { useWithdrawEndAllGroups } from "hooks/useWithdrawEndAllGroups";

export const PendingCeloWarning: React.FC = () => {
  const [
    groupPendingWithdrawals,
    refetchGroupPendingWithdrawals,
  ] = usePendingWithdrawals();
  const withdrawFinish = useWithdrawEndAllGroups();
  const totalPendingReady = groupPendingWithdrawals.reduce(
    (acc, p) => acc.add(p.totalAvailable),
    toBN(0)
  );
  const show = totalPendingReady.gt(toBN(0));

  if (!show) {
    return null;
  }
  return (
    <Box mb={4}>
      <Card variant="warning" sx={{ textAlign: "center" }}>
        <Box mb={2}>
          <Text variant="regular" mr={2}>
            NOTICE:
          </Text>
          <Text variant="regularGray">
            You have pending CELO ready to be withdrawn
          </Text>
        </Box>

        <Text variant="bold" mr={1}>
          {humanFriendlyWei(totalPendingReady)}
        </Text>
        <Text>CELO</Text>
        <br />

        <Flex sx={{ justifyContent: "center", mt: 3 }}>
          <Button
            onClick={async () => {
              await withdrawFinish();
              refetchGroupPendingWithdrawals();
            }}
            mr={3}
          >
            Withdraw
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};
