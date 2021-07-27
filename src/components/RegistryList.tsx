import React from "react";
import { RegistryEntry } from "config";
import { Box } from "theme-ui";
import { RegistryRow } from "components/RegistryRow";

interface Props {
  rows: RegistryEntry[];
  onRowClick?: (address: string) => any;
}

export const RegistryList: React.FC<Props> = ({ rows, onRowClick }) => {
  return (
    <Box>
      {rows.map(({ address, symbol }, idx) => {
        return (
          <Box key={idx} my={1}>
            <RegistryRow
              symbol={symbol}
              onClick={() => onRowClick && onRowClick(address)}
            />
          </Box>
        );
      })}
    </Box>
  );
};
