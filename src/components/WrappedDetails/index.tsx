import React from "react";
import { Box, Flex } from "theme-ui";
import { TokenDetails } from "components/WrappedDetails/TokenDetails";
import { VoterDetails } from "components/WrappedDetails/VoterDetails";
import { UserDetails } from "components/WrappedDetails/UserDetails";
import { useWrappedCELO } from "hooks/useWrappedCELO";

interface Props {
  wrappedAddress?: string;
}

export const WrappedDetails: React.FC<Props> = ({ wrappedAddress }) => {
  const [wc, refetchWC] = useWrappedCELO(wrappedAddress);

  if (!wc) {
    return null;
  }

  return (
    <Box>
      <Flex sx={{ justifyContent: ["left", "space-around"], flexWrap: "wrap" }}>
        <Box m={4}>
          <TokenDetails wc={wc} refetchWC={refetchWC} />
        </Box>
        <Box m={4}>
          <VoterDetails wc={wc} refetchWC={refetchWC} />
        </Box>
        <Box m={4}>
          <UserDetails wc={wc} refetchWC={refetchWC} />
        </Box>
      </Flex>
    </Box>
  );
};
