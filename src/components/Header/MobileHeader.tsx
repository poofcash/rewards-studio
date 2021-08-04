import React from "react";
import { Button, Container, Flex } from "theme-ui";
import { useLocation, Link } from "react-router-dom";
import { WalletCard } from "components/Wallet/WalletCard";
import { Page } from "components/Header";
import { Logo } from "components/Logo";

const HeaderButton: React.FC<{ page: Page }> = ({ page, children }) => {
  const location = useLocation();
  return (
    <Link to={`/${page}`}>
      <Button
        variant={
          location.pathname.includes(page) ? "switcherSelected" : "switcher"
        }
      >
        {children}
      </Button>
    </Link>
  );
};

export const MobileHeader: React.FC = () => {
  return (
    <Container sx={{ pt: 4, px: 3, width: "auto" }}>
      <Flex
        sx={{
          mb: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Logo />
        <WalletCard />
      </Flex>
      <Flex
        sx={{
          justifyContent: "center",
          overflow: "scroll",
          width: "100%",
        }}
        mt={3}
      >
        <HeaderButton page={Page.STAKE}>Stake</HeaderButton>
        <HeaderButton page={Page.MANAGE}>Manage</HeaderButton>
      </Flex>
    </Container>
  );
};
