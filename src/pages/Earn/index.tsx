import React from "react";
import {
  Container,
  Flex,
  Text,
  Button,
  Input,
  Heading,
  Grid,
  Card,
  Select,
} from "theme-ui";
import { useTranslation } from "react-i18next";
import { REGISTRY, RegistryEntry } from "config";
import { useDebouncedCallback } from "use-debounce";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import { AbiItem, toWei } from "web3-utils";
import { SavingsCELO } from "generated/SavingsCELO";
import { useContractKit } from "@celo-tools/use-contractkit";
import { SavingsKit } from "@poofcash/savingscelo";
import { toastTx } from "utils/toastTx";

export const Earn: React.FC = () => {
  const { t } = useTranslation();
  const { kit, performActions, connect } = useContractKit();
  const [amount, setAmount] = React.useState("0");
  const [wrapped, setWrapped] = React.useState<RegistryEntry>(REGISTRY[0]);
  const [exchangeRate, setExchangeRate] = React.useState("0");
  const updateExchangeRate = (groupAddress: string) => {
    if (groupAddress === "") {
      return;
    }
    const tokenContract = (new kit.web3.eth.Contract(
      SavingsCELOAbi as AbiItem[],
      groupAddress
    ) as unknown) as SavingsCELO;
    tokenContract.methods.celoToSavings(1).call().then(setExchangeRate);
  };
  React.useEffect(() => {
    updateExchangeRate(wrapped.address);
  });
  const onGroupChanged = useDebouncedCallback(updateExchangeRate);

  return (
    <>
      <Container mb={6}>
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Container>
            <Heading as="h1">{t("earn.title")}</Heading>
            <Text variant="regularGray">{t("earn.subtitle")}</Text>
          </Container>
        </Flex>
      </Container>
      <Flex sx={{ justifyContent: "center" }}>
        <Card sx={{ width: "500px", py: 4, px: 6, maxWidth: "100%" }}>
          <Text variant="form">Amount</Text>
          <Input
            placeholder="Enter an amount"
            mb={2}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            value={amount}
          />
          <Text variant="form">Group</Text>
          <Select
            mb={4}
            sx={{ backgroundColor: "box" }}
            onChange={(e) => {
              setWrapped(
                REGISTRY.find((entry) => entry.address === e.target.value)!
              );
              onGroupChanged(e.target.value);
            }}
            value={wrapped?.address ?? ""}
          >
            {REGISTRY.map((entry, idx) => (
              <option key={idx} value={entry.address}>
                {entry.symbol}
              </option>
            ))}
          </Select>
          <Button
            disabled={
              isNaN(Number(amount)) ||
              Number(amount) <= 0 ||
              wrapped === undefined
            }
            sx={{ width: "100%" }}
            onClick={() => {
              performActions(async (kit) => {
                if (!kit.defaultAccount) {
                  connect();
                  return;
                }
                if (!wrapped) {
                  alert("No group selected.");
                  return;
                }
                const savingsKit = new SavingsKit(kit, wrapped.address);
                const tx = await savingsKit.deposit().send({
                  from: kit.defaultAccount,
                  value: toWei(amount),
                  gasPrice: toWei("0.13", "gwei"),
                });
                toastTx(await tx.getHash());
              });
            }}
          >
            Stake
          </Button>
          {wrapped && (
            <Grid columns={[2, "1fr auto"]} mt={4}>
              <Text>You will receive</Text>
              <Text sx={{ textAlign: "right" }}>
                {(Number(exchangeRate) * Number(amount)).toLocaleString()}{" "}
                {wrapped.symbol}
              </Text>
              <Text>Exchange rate</Text>
              <Text sx={{ textAlign: "right" }}>
                1 CELO = {Number(exchangeRate).toLocaleString()}{" "}
                {wrapped.symbol}
              </Text>
              <Text>Est. APR</Text>
              <Text sx={{ textAlign: "right" }}>5.1%</Text>
            </Grid>
          )}
        </Card>
      </Flex>
    </>
  );
};
