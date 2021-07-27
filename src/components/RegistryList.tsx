import React from "react";
import { Box } from "theme-ui";
import { RegistryRow } from "components/RegistryRow";
import { RegistrySummary } from "hooks/useRowSummaries";

interface Props {
  rows: RegistrySummary[];
  onRowClick?: (address: string) => any;
}

export const RegistryList: React.FC<Props> = ({ rows, onRowClick }) => {
  return (
    <Box>
      {rows.map((row, idx) => {
        return (
          <Box
            key={idx}
            my={1}
            onClick={() => onRowClick && onRowClick(row.entry.address)}
          >
            <RegistryRow row={row} />
          </Box>
        );
      })}
    </Box>
  );
};
