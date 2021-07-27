import React from "react";
import {
  Container,
  Flex,
  Text,
  Button,
  Input,
  Heading,
  Grid,
  Link,
} from "theme-ui";
import { useTranslation } from "react-i18next";
import { useContractKit } from "@celo-tools/use-contractkit";
import { WrappedDetails } from "components/WrappedDetails";
import { shortenAddress } from "utils/address";
import { useHistory } from "react-router-dom";
import { REGISTRY } from "config";
import { useDebouncedCallback } from "use-debounce";
import { RegistryList } from "components/RegistryList";
import { isAddress } from "web3-utils";

export const Main: React.FC = () => {
  const { t } = useTranslation();
  const { address, connect, destroy, network } = useContractKit();
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState(REGISTRY);
  const onSearchChanged = useDebouncedCallback((search) => {
    setRows(
      REGISTRY.filter(
        ({ address, symbol }) =>
          address.toLowerCase().includes(search.toLowerCase()) ||
          symbol.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, 200);
  const [wrappedAddress, setWrappedAddress] = React.useState<string>();
  const history = useHistory();

  const connectWalletButton = (
    <Button
      sx={{ width: "200px" }}
      onClick={() => {
        connect().catch(console.error);
      }}
    >
      Connect Wallet
    </Button>
  );
  const createButton = (
    <Button
      sx={{ width: "200px" }}
      onClick={() => history.push("/create")}
      variant="secondary"
    >
      Create
    </Button>
  );

  return (
    <>
      <Container>
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Container>
            <Heading as="h1">{t("title")}</Heading>
            <Text variant="regularGray">{t("subtitle")}</Text>
          </Container>
          {address ? createButton : connectWalletButton}
        </Flex>
        <Flex sx={{ alignItems: "baseline" }} mt={5} mb={2}>
          <Text variant="bold">Wallet:</Text>
          {address ? (
            <>
              <Text ml={2}>{shortenAddress(address)}</Text>
              <Text
                sx={{ alignSelf: "center", cursor: "pointer" }}
                variant="wallet"
                ml={1}
                onClick={destroy}
              >
                (Disconnect)
              </Text>
            </>
          ) : (
            <Text ml={2}>No wallet connected.</Text>
          )}
        </Flex>
        <Container mb={3}>
          <Text variant="bold">Network:</Text>
          <Text ml={2}>{network.name}</Text>
        </Container>
      </Container>
      <Grid columns={[2, "33% 66%"]} mt={4}>
        <Container>
          <form
            onSubmit={(e) => {
              if (rows.length > 0) {
                setWrappedAddress(rows[0].address);
              } else {
                if (!isAddress(search)) {
                  alert(`${search} is not an address. Please try again.`);
                } else {
                  setWrappedAddress(search);
                }
              }
              e.preventDefault();
            }}
          >
            <Input
              sx={{
                ":focus-visible": {
                  outline: "none",
                },
                border: "none",
                borderBottom: "4px solid white",
              }}
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearchChanged(e.target.value);
              }}
              mb={4}
            />
          </form>
          {rows.length > 0 ? (
            <RegistryList rows={rows} onRowClick={setWrappedAddress} />
          ) : (
            <>
              <Text>Custom search for </Text>
              <Link
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (!isAddress(search)) {
                    alert(`${search} is not an address. Please try again.`);
                    return;
                  }
                  setWrappedAddress(search);
                }}
              >
                {search}
              </Link>
            </>
          )}
        </Container>
        <WrappedDetails wrappedAddress={wrappedAddress} />
      </Grid>
    </>
  );
};
