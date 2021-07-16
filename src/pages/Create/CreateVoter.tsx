import React from "react";
import { Box, Button, Flex, Heading, Input, Label, Text } from "theme-ui";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useContractKit } from "@celo-tools/use-contractkit";
import SavingsCELOVoter from "artifacts/SavingsCELOVoterV1.json";
import { AbiItem } from "web3-utils";

export const CreateVoter: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { performActions } = useContractKit();

  const wrappedAddressRef = React.createRef<any>();

  const createVoter = React.useCallback(
    (wrappedAddress: string) => {
      performActions(async (kit) => {
        if (!kit.defaultAccount) {
          alert("No connected account detected");
          return;
        }
        const voter = new kit.web3.eth.Contract(
          SavingsCELOVoter.abi as AbiItem[]
        );
        const contract = await voter
          .deploy({
            data: SavingsCELOVoter.bytecode,
            arguments: [wrappedAddress],
          })
          .send({ from: kit.defaultAccount });
        history.push(`/create/voter/receipt/${contract.options.address}`);
      });
    },
    [performActions, history]
  );

  return (
    <>
      <Box mb={2}>
        <Heading as="h1">{t("create.voter.title")}</Heading>
        <Text variant="regularGray">{t("create.voter.subtitle")}</Text>
      </Box>

      <form
        onSubmit={(e) => {
          createVoter(wrappedAddressRef.current.value);
          e.preventDefault();
        }}
      >
        <Box mb={3}>
          <Label>Wrapped CELO address</Label>
          <Input
            ref={wrappedAddressRef}
            placeholder="Enter the wrapped CELO address"
          />
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
