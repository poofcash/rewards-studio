import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Card, Container, Flex, Text } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import { StyledLink } from "components/StyledLink";
import { Page } from "components/Header";
import { useTokenBalance } from "hooks/useTokenBalance";
import { RCELO } from "config";
import { useContractKit } from "@celo-tools/use-contractkit";
import { humanFriendlyNumber } from "utils/number";
import { fromWei } from "web3-utils";

const HeaderLink: React.FC<{ page: Page }> = ({ page, children }) => {
  const location = useLocation();
  const selected = location.pathname.includes(page);
  return (
    <Box mr={3}>
      <StyledLink to={`/${page}`}>
        <Text
          sx={{
            color: selected ? "primary" : "text",
            borderBottom: selected ? "2px solid" : "none",
            mx: 1,
            pb: 1,
          }}
          variant="subtitle"
        >
          {children}
        </Text>
      </StyledLink>
    </Box>
  );
};

export const DesktopHeader: React.FC = () => {
  const { network } = useContractKit();
  const [rceloBalance] = useTokenBalance(RCELO[network.chainId]);
  console.log(rceloBalance);

  return (
    <>
      <Container sx={{ width: "auto" }}>
        <Flex
          sx={{
            mb: 2,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Flex
            sx={{
              alignItems: "center",
            }}
          >
            <Box mr={4}>
              <Logo />
            </Box>
            <HeaderLink page={Page.STAKE}>Stake</HeaderLink>
            <HeaderLink page={Page.MANAGE}>Manage</HeaderLink>
          </Flex>
          <Flex sx={{ alignItems: "center" }} ml={4}>
            <Card>
              <Text variant="primary">
                {humanFriendlyNumber(Math.floor(Number(fromWei(rceloBalance))))}
              </Text>{" "}
              rCELO
            </Card>
            <AccountProfile />
          </Flex>
        </Flex>
      </Container>
    </>
  );
};
