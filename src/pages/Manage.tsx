import React from "react";
import {
  Container,
  Flex,
  Text,
  Button,
  Input,
  Heading,
  Grid,
  Link,
  Box,
  Spinner,
} from "theme-ui";
import { useTranslation } from "react-i18next";
import { WrappedDetails } from "components/WrappedDetails";
import { useHistory } from "react-router-dom";
import { REGISTRY } from "config";
import { useDebouncedCallback } from "use-debounce";
import { RegistryList } from "components/RegistryList";
import { isAddress } from "web3-utils";
import { useRowSummaries } from "hooks/useRowSummaries";

export const Manage: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = React.useState("");
  const [rows, , rowsLoading] = useRowSummaries(REGISTRY);
  const [filteredRows, setFilteredRows] = React.useState(rows);
  React.useEffect(() => {
    setFilteredRows(rows.sort((a, b) => b.tvl - a.tvl));
  }, [rows]);
  const onSearchChanged = useDebouncedCallback((search) => {
    setFilteredRows(
      rows
        .filter(
          ({ entry }) =>
            entry.address.toLowerCase().includes(search.toLowerCase()) ||
            entry.symbol.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => b.tvl - a.tvl)
    );
  }, 200);
  const [wrappedAddress, setWrappedAddress] = React.useState<string>();
  const history = useHistory();

  return (
    <>
      <Container>
        <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Container>
            <Heading as="h1">{t("manage.title")}</Heading>
            <Text variant="regularGray">{t("manage.subtitle")}</Text>
          </Container>
          <Button
            sx={{ width: "200px" }}
            onClick={() => history.push("/manage/create")}
            variant="primary"
          >
            Create
          </Button>
        </Flex>
      </Container>
      <Grid sx={{ gridTemplateColumns: ["100%", "33% 66%"] }} mt={4}>
        <Container>
          <form
            onSubmit={(e) => {
              if (filteredRows.length > 0) {
                setWrappedAddress(filteredRows[0].entry.address);
              } else {
                if (!isAddress(search)) {
                  alert(`${search} is not an address. Please try again.`);
                } else {
                  setWrappedAddress(search);
                }
              }
              e.preventDefault();
            }}
          >
            <Input
              sx={{
                ":focus-visible": {
                  outline: "none",
                },
                border: "none",
                color: "text",
                borderBottom: "4px solid",
              }}
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearchChanged(e.target.value);
              }}
              mb={4}
            />
          </form>
          {filteredRows.length > 0 ? (
            <RegistryList rows={filteredRows} onRowClick={setWrappedAddress} />
          ) : rowsLoading ? (
            <Spinner />
          ) : (
            <>
              <Text>Custom search for </Text>
              <Link
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  if (!isAddress(search)) {
                    alert(`${search} is not an address. Please try again.`);
                    return;
                  }
                  setWrappedAddress(search);
                }}
              >
                {search}
              </Link>
            </>
          )}
        </Container>
        <Box mt={[4, 0]} ml={[0, 4]}>
          <WrappedDetails wrappedAddress={wrappedAddress} />
        </Box>
      </Grid>
    </>
  );
};
