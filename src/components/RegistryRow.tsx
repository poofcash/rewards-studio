import { Box, Text } from "theme-ui";

interface Props {
  symbol: string;
  onClick?: () => any;
}

export const RegistryRow: React.FC<Props> = ({ symbol, onClick }) => {
  return (
    <Box
      sx={{ width: "100%", border: "1px solid white", p: 2, cursor: "pointer" }}
      onClick={onClick}
    >
      <Text>{symbol}</Text>
    </Box>
  );
};
