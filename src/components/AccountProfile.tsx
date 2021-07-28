import React from "react";
import { Box, Flex } from "theme-ui";
import { BlockscoutAddressLink } from "components/Links";
import { Text } from "theme-ui";
import { useContractKit } from "@celo-tools/use-contractkit";
import { shortenAddress } from "utils/address";

export const AccountProfile: React.FC = () => {
  const { address, destroy, connect } = useContractKit();

  return (
    <Flex sx={{ alignItems: "center", justifyContent: "flex-end" }}>
      <Flex
        sx={{
          flexDirection: "column",
          maxWidth: "50vw",
          mr: 2,
          textAlign: "right",
        }}
      >
        <Flex
          sx={{
            alignItems: "baseline",
            justifyContent: address ? "space-between" : "flex-end",
          }}
        >
          {address ? (
            <Box>
              <Box>
                <BlockscoutAddressLink address={address}>
                  <Text variant="wallet" mr={2}>
                    {shortenAddress(address)}
                  </Text>
                </BlockscoutAddressLink>
                <Text
                  sx={{ whiteSpace: "nowrap", cursor: "pointer" }}
                  onClick={() => {
                    try {
                      destroy();
                    } catch (e) {
                      console.debug(e);
                    }
                  }}
                  variant="form"
                >
                  Disconnect
                </Text>
              </Box>
            </Box>
          ) : (
            <>
              <Text variant="wallet" mr={2}>
                0x????...????
              </Text>
              <Text
                sx={{ whiteSpace: "nowrap", cursor: "pointer" }}
                onClick={() => connect().then(console.log).catch(console.error)}
                variant="form"
              >
                Connect
              </Text>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
