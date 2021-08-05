import React from "react";
import { Flex, Text, useColorMode } from "theme-ui";
import { Link } from "react-router-dom";
import { Moon, Sun } from "react-feather";

export const Logo: React.FC = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <Flex sx={{ alignItems: "center" }}>
      <Link to="/" style={{ textDecoration: "none", color: "black" }}>
        <Text variant="logo">Rewards Studio</Text>
      </Link>
      <Text mx={2}>/</Text>
      {colorMode === "dark" ? (
        <Moon
          color="white"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setColorMode("default");
          }}
          size={16}
        />
      ) : (
        <Sun
          style={{ cursor: "pointer" }}
          onClick={() => {
            setColorMode("dark");
          }}
          size={16}
        />
      )}
    </Flex>
  );
};
