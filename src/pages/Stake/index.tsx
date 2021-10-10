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
  Link,
  Box,
} from "theme-ui";
import { useTranslation } from "react-i18next";
import { RCELO, REGISTRY, RegistryEntry } from "config";
import { fromWei } from "web3-utils";
import { useContractKit } from "@celo-tools/use-contractkit";
import { useCELOBalance } from "hooks/useCELOBalance";
import { humanFriendlyNumber } from "utils/number";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { useTokenBalance } from "hooks/useTokenBalance";
import { useRCELOExchangeRate } from "hooks/useRCELOExchangeRate";
import { useStake } from "hooks/useStake";
import { useUnstake } from "hooks/useUnstake";
import { UnstakedWarning } from "components/UnstakedWarning";
import { PendingCeloWarning } from "components/PendingCeloWarning";

const GAS = 0.01;

const Switcher = styled(Box)(({ selected }: { selected: boolean }) => ({
  background: selected
    ? "var(--theme-ui-colors-primary)"
    : "var(--theme-ui-colors-box)",
  padding: "8px",
  cursor: "pointer",
  color: `var(--theme-ui-colors-${selected ? "primaryButtonText" : "text"})`,
}));

export const Stake: React.FC = () => {
  const { t } = useTranslation();
  const { network } = useContractKit();
  const [staking, setStaking] = React.useState(true);
  const [amount, setAmount] = React.useState("0");
  let [wrapped, setWrapped] = React.useState<RegistryEntry>(REGISTRY[0]);
  const { wrappedTicker } = useParams<{ wrappedTicker?: string }>();
  let tickerMatch = undefined;
  if (wrappedTicker) {
    tickerMatch = REGISTRY.find(
      (x) => x.symbol.toLowerCase() === wrappedTicker
    );
    if (tickerMatch) {
      wrapped = tickerMatch;
    }
  }

  const [rceloExchangeRate] = useRCELOExchangeRate();
  const [celoBalance] = useCELOBalance();
  const [rceloBalance] = useTokenBalance(RCELO[network.chainId]);
  const stake = useStake(amount, wrapped);
  const unstake = useUnstake(amount);
  const max = staking
    ? Math.max(Number(fromWei(celoBalance)) - GAS, 0)
    : fromWei(rceloBalance);
  const receiveAmount = staking
    ? Number(amount) * Number(rceloExchangeRate)
    : Number(amount) / Number(rceloExchangeRate);
  const action = staking ? stake : unstake;

  return (
    <>
      <Container mb={6}>
        <Flex
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Container>
            <Heading as="h1">{t("stake.title")}</Heading>
            <Text variant="regularGray">{t("stake.subtitle")}</Text>
          </Container>
        </Flex>
      </Container>
      <Flex sx={{ alignItems: "center", flexDirection: "column" }}>
        <UnstakedWarning />
        <PendingCeloWarning />
        <Card sx={{ width: "500px", py: 4, px: 6, maxWidth: "100%" }}>
          <Flex
            sx={{
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Switcher
              sx={{
                border: "4px solid var(--theme-ui-colors-primary)",
                borderRight: "none",
                borderRadius: "6px 0px 0px 6px",
              }}
              selected={staking}
              onClick={() => setStaking(true)}
            >
              Stake
            </Switcher>
            <Switcher
              sx={{
                border: "4px solid var(--theme-ui-colors-primary)",
                borderLeft: "none",
                borderRadius: "0px 6px 6px 0px",
              }}
              selected={!staking}
              onClick={() => setStaking(false)}
            >
              Unstake
            </Switcher>
          </Flex>
          <Flex
            sx={{ justifyContent: "space-between", alignItems: "baseline" }}
          >
            <Text variant="form">Amount</Text>
            <Text variant="form">
              <Link onClick={() => setAmount(max.toString())}>
                max: {humanFriendlyNumber(max)} {staking ? "CELO" : "rCELO"}
              </Link>
            </Text>
          </Flex>
          <Input
            placeholder="Enter an amount"
            mb={tickerMatch || !staking ? 4 : 2}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            value={amount}
          />
          {!tickerMatch && staking && (
            <>
              <Text variant="form">Group</Text>
              <Select
                mb={4}
                sx={{ backgroundColor: "box" }}
                onChange={(e) => {
                  setWrapped(
                    REGISTRY.find((entry) => entry.address === e.target.value)!
                  );
                }}
                value={wrapped?.address ?? ""}
              >
                {REGISTRY.map((entry, idx) => (
                  <option key={idx} value={entry.address}>
                    {entry.symbol}
                  </option>
                ))}
              </Select>
            </>
          )}
          <Button
            disabled={
              isNaN(Number(amount)) ||
              Number(amount) <= 0 ||
              wrapped === undefined
            }
            sx={{ width: "100%" }}
            onClick={action}
          >
            {staking ? "Stake" : "Unstake"}
          </Button>
          {wrapped && (
            <Grid columns={[2, "1fr auto"]} mt={4}>
              <Text>You will receive</Text>
              <Text sx={{ textAlign: "right" }}>
                {receiveAmount.toLocaleString()} {staking ? "rCELO" : "CELO"}
              </Text>
              <Text>Exchange rate</Text>
              <Text sx={{ textAlign: "right" }}>
                1 CELO = {Number(rceloExchangeRate).toLocaleString()} rCELO
              </Text>
              {staking && (
                <>
                  <Text>Est. APR</Text>
                  <Text sx={{ textAlign: "right" }}>5.1%</Text>
                  <Text>Validator</Text>
                  <Link
                    href={wrapped.validatorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textAlign: "right", textDecoration: "none" }}
                  >
                    {wrapped.validatorName}
                  </Link>
                </>
              )}
            </Grid>
          )}
        </Card>
      </Flex>
    </>
  );
};
