import React from "react";
import "i18n/config";
import { Box, Container } from "theme-ui";
import { Header, Page } from "components/Header";
import { Redirect, Route, Switch } from "react-router-dom";
import { Manage } from "pages/Manage";
import { Create } from "pages/Create";
import { ToastContainer } from "react-toastify";
import { Stake } from "pages/Stake";

const App: React.FC = () => {
  return (
    <Container
      sx={{
        mx: [0, "15%"],
        my: [0, 4],
        maxWidth: "100%",
        width: "auto",
      }}
    >
      <Box mb={5}>
        <Header />
      </Box>
      <Container
        sx={{
          px: [3, 0],
          py: [4, 0],
          mb: "64px",
          maxHeight: "calc(100vh + 64px)",
        }}
      >
        <Switch>
          <Route exact path="/">
            <Redirect to={`/${Page.STAKE}`} />
          </Route>
          <Route exact path={`/${Page.STAKE}`}>
            <Stake />
          </Route>
          <Route exact path={`/${Page.MANAGE}`}>
            <Manage />
          </Route>
          <Route path={`/${Page.MANAGE_CREATE}`}>
            <Create />
          </Route>
        </Switch>
      </Container>
      <ToastContainer
        style={{ background: "var(--theme-ui-colors-background)" }}
        toastClassName="toast-body"
        bodyClassName="toast-body"
      />
    </Container>
  );
};

export default App;
