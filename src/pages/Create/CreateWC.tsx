import React from "react";
import { Box, Button, Flex, Heading, Input, Label, Text } from "theme-ui";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import SavingsCELO from "artifacts/SavingsCELO.json";
import { useContractKit } from "@celo-tools/use-contractkit";
import { AbiItem } from "web3-utils";

export const CreateWC: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { performActions } = useContractKit();
  const nameRef = React.createRef<any>();
  const symbolRef = React.createRef<any>();

  const createWC = React.useCallback(
    (tokenName: string, tokenSymbol: string) => {
      performActions(async (kit) => {
        if (!kit.defaultAccount) {
          alert("No connected account detected");
          return;
        }
        const wrappedCELO = new kit.web3.eth.Contract(
          SavingsCELO.abi as AbiItem[]
        );
        try {
          const contract = await wrappedCELO
            .deploy({
              data: SavingsCELO.bytecode,
              arguments: [tokenName, tokenSymbol],
            })
            .send({ from: kit.defaultAccount });
          history.push(`/create/wrapped/receipt/${contract.options.address}`);
        } catch (e) {
          console.error("Failed to create a wrapped CELO.", e);
          alert(e);
        }
      });
    },
    [performActions, history]
  );

  return (
    <>
      <Box mb={2}>
        <Heading as="h1">{t("create.wc.title")}</Heading>
        <Text variant="regularGray">{t("create.wc.subtitle")}</Text>
      </Box>

      <form
        onSubmit={(e) => {
          createWC(nameRef.current.value, symbolRef.current.value);
          e.preventDefault();
        }}
      >
        <Box mb={3}>
          <Label>Token name</Label>
          <Input ref={nameRef} placeholder="Enter your token name" />
        </Box>

        <Box>
          <Label>Token symbol</Label>
          <Input ref={symbolRef} placeholder="Enter your token symbol" />
        </Box>

        <Flex sx={{ justifyContent: "flex-end" }} mt={4}>
          <Button variant="secondary" mr={2} onClick={() => history.push("/")}>
            Cancel
          </Button>
          <Button>Create</Button>
        </Flex>
      </form>
    </>
  );
};
