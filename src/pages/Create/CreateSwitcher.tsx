import styled from "@emotion/styled";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Flex, Text } from "theme-ui";

const StyledText = styled(Text)({
  cursor: "pointer",
});

export const CreateSwitcher: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  return (
    <Flex sx={{ justifyContent: "center", mb: 3 }}>
      <StyledText
        sx={
          location.pathname.includes("wrapped")
            ? { borderBottom: "4px solid" }
            : {}
        }
        mr={4}
        onClick={() => history.push("/create/wrapped")}
      >
        Wrapped CELO
      </StyledText>

      <StyledText
        sx={
          location.pathname.includes("voter")
            ? { borderBottom: "4px solid" }
            : {}
        }
        onClick={() => history.push("/create/voter")}
      >
        Voter
      </StyledText>
    </Flex>
  );
};
