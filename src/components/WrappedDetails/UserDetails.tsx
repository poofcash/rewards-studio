import { WC } from "hooks/useWrappedCELO";
import { Box, Heading, Text } from "theme-ui";
import { fromWei } from "web3-utils";
import { WrappedActions } from "components/WrappedDetails/WrappedActions";
import { PendingWithdrawals } from "components/PendingWithdrawals";

interface Props {
  wc: WC;
  refetchWC: () => void;
}
export const UserDetails: React.FC<Props> = ({ wc, refetchWC }) => {
  return (
    <Box>
      <Heading as="h2">User details</Heading>
      <Box mt={2}>
        <Text variant="bold" mr={2}>
          CELO balance:
        </Text>
        <Text>{Number(fromWei(wc.userCeloBalance)).toLocaleString()} CELO</Text>
      </Box>
      <Box mt={2}>
        <Text variant="bold" mr={2}>
          {wc.tokenSymbol} balance:
        </Text>
        <Text>
          {Number(fromWei(wc.userWrappedBalance)).toLocaleString()}{" "}
          {wc.tokenSymbol}
        </Text>
      </Box>
      {wc.pendingWithdrawals.length > 0 && (
        <Box mt={2}>
          <Text variant="bold">Pending withdrawals:</Text>
          <Box mt={2}>
            <PendingWithdrawals wc={wc} refetchWC={refetchWC} />
          </Box>
        </Box>
      )}
      <Box mt={4}>
        <WrappedActions wc={wc} refetchWC={refetchWC} />
      </Box>
    </Box>
  );
};
