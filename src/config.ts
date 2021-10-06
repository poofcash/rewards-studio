import { ChainId } from "@celo-tools/use-contractkit";

export type RegistryEntry = {
  address: string;
  symbol: string;
  validatorName: string;
  validatorUrl: string;
};

export const REGISTRY: RegistryEntry[] = [
  {
    address: "0x5d4E32975Bcf3aca47282C580Cf5Bc0F8135D218",
    symbol: "vcapCELO",
    validatorName: "Validator.Capital",
    validatorUrl: "https://thecelo.com/group/Validator",
  },
  {
    address: "0xB05e342117f7cCE1646e0016804bCaA09741c593",
    symbol: "uCELO",
    validatorName: "Usopp",
    validatorUrl:
      "https://thecelo.com/group/0x067e453918f2c44D937b05a7eE9DBFB804C54ADd",
  },
  {
    address: "0x2879BFD5e7c4EF331384E908aaA3Bd3014b703fA",
    symbol: "sCELO",
    validatorName: "wotrust",
    validatorUrl: "https://thecelo.com/group/wotrust",
  },
  {
    address: "0x5AfDb9c5A20EE5bB36d9c81BD5E1BE56FBF52CD8",
    symbol: "tptCELO",
    validatorName: "The Passive Trust",
    validatorUrl: "https://thecelo.com/group/thepassivetrust",
  },
  {
    address: "0x97775F815206DAEb81188Af20940deF61c7D6D3B",
    symbol: "BitCelo",
    validatorName: "Bitcandy",
    validatorUrl:
      "https://thecelo.com/group/0x34649AdA2cB44D851a2103Feaa8922DedDABfc1c",
  },
];

export const RCELO = {
  [ChainId.Mainnet]: "0x1a8Dbe5958c597a744Ba51763AbEBD3355996c3e",
  [ChainId.Alfajores]: "0xBDeedCDA79BAbc4Eb509aB689895a3054461691e",
  [ChainId.Baklava]: undefined,
};
