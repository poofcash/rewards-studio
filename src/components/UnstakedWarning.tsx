import { Box, Button, Card, Flex, Text } from "@theme-ui/components";
import { useGroupBalances } from "hooks/useGroupBalances";
import { useStakeAllGroups } from "hooks/useStakeAllGroups";
import { useUnstakeAllGroups } from "hooks/useUnstakeAllGroups";
import React from "react";
import { humanFriendlyWei } from "utils/number";
import { toBN } from "web3-utils";

export const UnstakedWarning = () => {
  const [groupBalances, refetchGroupBalances] = useGroupBalances();
  const show = groupBalances.some((g) => toBN(g.balance).gt(toBN(0)));
  const stakeAll = useStakeAllGroups();
  const unstakeAll = useUnstakeAllGroups();

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
            You have unstaked liquid staking tokens
          </Text>
        </Box>
        {groupBalances.map((g, i) => {
          return (
            toBN(g.balance).gt(toBN(0)) && (
              <React.Fragment key={i}>
                <Text variant="bold" mr={1}>
                  {humanFriendlyWei(g.balance)}
                </Text>
                <Text>{g.symbol}</Text>
                <br />
              </React.Fragment>
            )
          );
        })}
        <Flex sx={{ justifyContent: "center", mt: 3 }}>
          <Button
            onClick={() => {
              unstakeAll();
              refetchGroupBalances();
            }}
            mr={3}
          >
            Convert to CELO
          </Button>
          <Button
            onClick={() => {
              stakeAll();
              refetchGroupBalances();
            }}
          >
            Convert to rCELO
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};
