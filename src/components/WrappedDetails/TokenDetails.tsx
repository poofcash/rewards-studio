import { WC } from "hooks/useWrappedCELO";
import { Button, Box, Heading, Text } from "theme-ui";
import { BlockscoutAddressLink } from "components/Links";
import { shortenAddress } from "utils/address";
import { useContractKit } from "@celo-tools/use-contractkit";
import { AbiItem, isAddress } from "web3-utils";
import SavingsCELOAbi from "abis/SavingsCELO.json";
import { SavingsCELO } from "generated/SavingsCELO";
import { toastTx } from "utils/toastTx";
import { fromWei } from "web3-utils";

interface Props {
  wc: WC;
  refetchWC: () => void;
}
export const TokenDetails: React.FC<Props> = ({ wc, refetchWC }) => {
  const { address, performActions } = useContractKit();

  return (
    <Box mb={4}>
      <Heading as="h2">Wrapped CELO details</Heading>
      <Box mt={2}>
        <Text variant="bold" mr={2}>
          Token:
        </Text>
        <BlockscoutAddressLink address={wc.tokenAddress}>
          {wc.tokenName} (${wc.tokenSymbol})
        </BlockscoutAddressLink>
      </Box>
      <Box mt={2}>
        <Text variant="bold" mr={2}>
          Owner:
        </Text>
        <BlockscoutAddressLink address={wc.owner}>
          {shortenAddress(wc.owner)}
        </BlockscoutAddressLink>
        <Button
          ml={2}
          variant="secondary"
          disabled={
            !address || wc.owner.toLowerCase() !== address.toLowerCase()
          }
          onClick={() => {
            const changed = prompt("Enter new owner address");
            if (!changed) {
              return;
            }
            if (!isAddress(changed)) {
              alert("Invalid address");
              return;
            }
            performActions(async (kit) => {
              if (!kit.defaultAccount) {
                alert("No connected account.");
                return;
              }
              const tokenContract = (new kit.web3.eth.Contract(
                SavingsCELOAbi as AbiItem[],
                wc.tokenAddress
              ) as unknown) as SavingsCELO;
              const tx = await tokenContract.methods
                .transferOwnership(changed)
                .send({ from: kit.defaultAccount });
              toastTx(tx.transactionHash);
              refetchWC();
            });
          }}
        >
          change
        </Button>
      </Box>
      <Box mt={2}>
        <Text variant="bold" mr={2}>
          Voter:
        </Text>
        <BlockscoutAddressLink address={wc.voter}>
          {shortenAddress(wc.voter)}
        </BlockscoutAddressLink>
        <Button
          ml={2}
          variant="secondary"
          disabled={
            !address || wc.owner.toLowerCase() !== address.toLowerCase()
          }
          onClick={() => {
            const changed = prompt("Enter new voter address");
            if (!changed) {
              return;
            }
            if (!isAddress(changed)) {
              alert("Invalid address");
              return;
            }
            performActions(async (kit) => {
              if (!kit.defaultAccount) {
                alert("No connected account.");
                return;
              }
              const tokenContract = (new kit.web3.eth.Contract(
                SavingsCELOAbi as AbiItem[],
                wc.tokenAddress
              ) as unknown) as SavingsCELO;
              const tx = await tokenContract.methods
                .authorizeVoterProxy(changed)
                .send({ from: kit.defaultAccount });
              toastTx(tx.transactionHash);
              refetchWC();
            });
          }}
        >
          change
        </Button>
      </Box>
      <Box mt={2}>
        <Text variant="bold" mr={2}>
          Locked balance:
        </Text>
        <Text>{Number(fromWei(wc.lockedBalance)).toLocaleString()} CELO</Text>
      </Box>
      <Box mt={2}>
        <Text variant="bold" mr={2}>
          Exchange rate:
        </Text>
        <Text>
          1 CELO = {Number(wc.exchangeRate).toLocaleString()} {wc.tokenSymbol}
        </Text>
      </Box>
    </Box>
  );
};
