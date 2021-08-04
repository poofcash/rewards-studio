import React from "react";
import { Button, Container, Flex } from "theme-ui";
import { useHistory, useLocation } from "react-router-dom";
import { WalletCard } from "components/Wallet/WalletCard";
import { Page } from "components/Header";
import { Logo } from "components/Logo";

const HeaderButton: React.FC<{ page: Page }> = ({ page, children }) => {
  const location = useLocation();
  const history = useHistory();
  return (
    <Button
      variant={
        location.pathname.includes(page) ? "switcherSelected" : "switcher"
      }
      onClick={() => history.push(page)}
    >
      {children}
    </Button>
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
        <HeaderButton page={Page.EARN}>Earn</HeaderButton>
        <HeaderButton page={Page.MANAGE}>Manage</HeaderButton>
      </Flex>
    </Container>
  );
};
