import { WC } from "hooks/useWrappedCELO";
import { Button, Box, Heading, Text, Flex } from "theme-ui";
import { BlockscoutAddressLink } from "components/Links";
import { shortenAddress } from "utils/address";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Link } from "react-router-dom";
import { AbiItem, isAddress } from "web3-utils";
import SavingsCELOVoterAbi from "abis/SavingsCELOVoterV1.json";
import { SavingsCELO } from "generated/SavingsCELO";
import { toastTx } from "utils/toastTx";
import { ZERO_ADDRESS } from "utils/constants";
import { SavingsKit, VoterV1 } from "@poofcash/savingscelo";

interface Props {
  wc: WC;
  refetchWC: () => void;
}
export const VoterDetails: React.FC<Props> = ({ wc, refetchWC }) => {
  const { address, performActions } = useContractKit();

  return (
    <Box>
      <Heading as="h2">Voter details</Heading>
      {wc.validVoter ? (
        <>
          <Box mt={2}>
            <Text variant="bold" mr={2}>
              Voter manager:
            </Text>
            <BlockscoutAddressLink address={wc.voterOwner}>
              {shortenAddress(wc.voterOwner)}
            </BlockscoutAddressLink>
            <Button
              ml={2}
              variant="secondary"
              disabled={address !== wc.voterOwner}
              onClick={() => {
                const changed = prompt("Enter new manager address");
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
                  const voterContract = (new kit.web3.eth.Contract(
                    SavingsCELOVoterAbi as AbiItem[],
                    wc.voter
                  ) as unknown) as SavingsCELO;
                  const tx = await voterContract.methods
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
              Voted Group:
            </Text>
            <BlockscoutAddressLink address={wc.votedGroup}>
              {shortenAddress(wc.votedGroup)}
            </BlockscoutAddressLink>
            <Button
              ml={2}
              variant="secondary"
              disabled={address !== wc.voterOwner}
              onClick={() => {
                const changed = prompt("Enter new validator group address");
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

                  const savingsKit = new SavingsKit(kit, wc.tokenAddress);
                  const voter = new VoterV1(kit, savingsKit, wc.voter);
                  const tx = await (
                    await voter.changeVotedGroup(changed)
                  ).send({ from: kit.defaultAccount });
                  toastTx(await tx.getHash());
                  refetchWC();
                });
              }}
            >
              change
            </Button>
          </Box>
          <Box mt={2}>
            <Text variant="bold" mr={2}>
              Pending votes:
            </Text>
            <Text>{wc.pendingVotes.toString()} CELO</Text>
            <Button ml={2} disabled={!wc.needsActivate} variant="secondary">
              activate
            </Button>
          </Box>
        </>
      ) : wc.voter === ZERO_ADDRESS ? (
        <Flex sx={{ alignItems: "baseline" }}>
          <Text mr={2}>No voter assigned. </Text>
          <Link
            style={{
              textDecoration: "none",
              color: "var(--theme-ui-colors-accent)",
            }}
            to="/create/voter"
          >
            Create voter
          </Link>
        </Flex>
      ) : (
        <Flex sx={{ alignItems: "baseline" }}>
          <Text mr={2}>Invalid voter. </Text>
          <Link
            style={{
              textDecoration: "none",
              color: "var(--theme-ui-colors-accent)",
            }}
            to="/create/voter"
          >
            Create voter
          </Link>
        </Flex>
      )}
    </Box>
  );
};
