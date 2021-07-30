import { ArrowLeft } from "react-feather";
import { Redirect, Route, useHistory } from "react-router-dom";
import { Flex, Box, Text } from "theme-ui";
import { CreateWC } from "pages/Create/CreateWC";
import { CreateVoter } from "pages/Create/CreateVoter";
import { Switch } from "react-router-dom";
import { CreateSwitcher } from "pages/Create/CreateSwitcher";
import { CreateReceipt } from "pages/Create/CreateReceipt";

export const Create: React.FC = () => {
  const history = useHistory();

  return (
    <Box>
      <Flex
        sx={{
          alignItems: "center",
          mb: 3,
          cursor: "pointer",
          width: "fit-content",
        }}
        onClick={() => {
          history.push("/");
        }}
      >
        <ArrowLeft color="var(--theme-ui-colors-text)" />
        <Text mt={1} ml={2}>
          Home
        </Text>
      </Flex>

      <CreateSwitcher />

      <Switch>
        <Route exact path="/manage/create">
          <Redirect to="/manage/create/wrapped" />
        </Route>
        <Route exact path="/manage/create/wrapped">
          <CreateWC />
        </Route>
        <Route exact path="/manage/create/voter">
          <CreateVoter />
        </Route>
        <Route exact path="/manage/create/wrapped/receipt/:address">
          <CreateReceipt />
        </Route>
        <Route exact path="/manage/create/voter/receipt/:address">
          <CreateReceipt />
        </Route>
      </Switch>
    </Box>
  );
};
