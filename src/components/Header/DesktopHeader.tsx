import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Container, Flex, Text } from "theme-ui";
import { Logo } from "components/Logo";
import { AccountProfile } from "components/AccountProfile";
import styled from "@emotion/styled";
import { Page } from "components/Header";

const StyledLink = styled(Link)({
  height: "fit-content",
  textDecoration: "none",
});

const HeaderLink: React.FC<{ page: Page }> = ({ page, children }) => {
  const location = useLocation();
  return (
    <StyledLink to={page}>
      <Text
        sx={{
          color: location.pathname.includes(page) ? "accent" : "text",
          mx: 2,
        }}
        variant="subtitle"
      >
        {children}
      </Text>
    </StyledLink>
  );
};

export const DesktopHeader: React.FC = () => {
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
          <Logo />
          <Flex
            sx={{
              alignItems: "center",
            }}
          >
            <HeaderLink page={Page.EARN}>Earn</HeaderLink>
            <Text>/</Text>
            <HeaderLink page={Page.MANAGE}>Manage</HeaderLink>
            <Box ml={4}>
              <AccountProfile />
            </Box>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};
