import React from "react";
import { Box, Divider, Spinner, Text } from "theme-ui";
import { TokenDetails } from "components/WrappedDetails/TokenDetails";
import { VoterDetails } from "components/WrappedDetails/VoterDetails";
import { UserDetails } from "components/WrappedDetails/UserDetails";
import { useWrappedCELO } from "hooks/useWrappedCELO";
import { isAddress } from "web3-utils";

interface Props {
  wrappedAddress?: string;
}

export const WrappedDetails: React.FC<Props> = ({ wrappedAddress }) => {
  const [wc, refetchWC, loading, error] = useWrappedCELO(wrappedAddress);

  if (!wrappedAddress || !isAddress(wrappedAddress)) {
    return null;
  }
  if (loading) {
    return <Spinner />;
  }
  if (error || !wc) {
    return <Text>Failed to fetch {wrappedAddress}. </Text>;
  }

  return (
    <Box>
      <Box mb={4}>
        <TokenDetails wc={wc} refetchWC={refetchWC} />
      </Box>
      <Divider />
      <Box mb={4}>
        <VoterDetails wc={wc} refetchWC={refetchWC} />
      </Box>
      <Divider />
      <Box mb={4}>
        <UserDetails wc={wc} refetchWC={refetchWC} />
      </Box>
    </Box>
  );
};
