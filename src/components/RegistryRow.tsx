import { RegistrySummary } from "hooks/useRowSummaries";
import { Flex, Text } from "theme-ui";

interface Props {
  row: RegistrySummary;
}

export const RegistryRow: React.FC<Props> = ({ row }) => {
  return (
    <Flex
      sx={{
        width: "100%",
        border: "1px solid white",
        p: 2,
        cursor: "pointer",
        justifyContent: "space-between",
      }}
    >
      <Text>{row.entry.symbol}</Text>
      {
        <Text>
          TVL:{" "}
          {row.tvl.toLocaleString(undefined, {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      }
    </Flex>
  );
};
