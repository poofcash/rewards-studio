import React from "react";
import { Box, Heading, Text } from "theme-ui";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { shortenAddress } from "utils/address";
import { BlockscoutAddressLink } from "components/Links";

export const CreateReceipt: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { address } = useParams<{ address: string }>();

  return (
    <>
      <Box mb={2}>
        <Heading as="h1">
          {t(
            location.pathname.includes("wrapped")
              ? "create.wc.receipt.title"
              : "create.voter.receipt.title"
          )}
        </Heading>
        <Text variant="regularGray">
          {t(
            location.pathname.includes("wrapped")
              ? "create.wc.receipt.subtitle"
              : "create.voter.receipt.subtitle"
          )}
        </Text>
        <Box mt={4}>
          <Text mr={2}>View on Blockscout:</Text>
          <BlockscoutAddressLink address={address}>
            {shortenAddress(address)}
          </BlockscoutAddressLink>
        </Box>
      </Box>
    </>
  );
};
