import React from "react";
import { Box, Card, Divider, Spinner, Text } from "theme-ui";
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
    return (
      <Card pt={3} pb={7} pl={3}>
        <Text variant="subtitle">Select a liquid staking CELO</Text>
        <br />
        <Text variant="regularGray">
          Select a registered liquid staking CELO or enter a custom liquid
          staking CELO address
        </Text>
      </Card>
    );
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
