import React from "react";
import {
  Container,
  Flex,
  Text,
  Button,
  Label,
  Input,
  Divider,
  Heading,
} from "theme-ui";
import { useTranslation } from "react-i18next";
import { useContractKit } from "@celo-tools/use-contractkit";
import { WrappedDetails } from "components/WrappedDetails";
import { shortenAddress } from "utils/address";
import { useHistory } from "react-router-dom";

export const Main: React.FC = () => {
  const { t } = useTranslation();
  const { address, connect, destroy, network } = useContractKit();
  const inputRef = React.createRef<any>();
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
      <Container>
        <form
          onSubmit={(e) => {
            if (inputRef) {
              setWrappedAddress(inputRef.current.value);
            }
            e.preventDefault();
          }}
        >
          <Label>Wrapped CELO address</Label>
          <Flex>
            <Input mr={2} placeholder="0x..." ref={inputRef} />
            <Button type="submit">Go</Button>
          </Flex>
        </form>
      </Container>
      <Divider my={6} />
      <WrappedDetails wrappedAddress={wrappedAddress} />
    </>
  );
};
