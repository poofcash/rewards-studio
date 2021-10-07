import { fromWei } from "web3-utils";
import BN from "bn.js";

const DECIMAL_PRECISION = 3;

export const humanFriendlyNumber = (v: number | string) => {
  const num = Number(v);
  if (num === 0) {
    return "0";
  }
  const smallest = Math.pow(10, -DECIMAL_PRECISION);
  if (num < smallest) {
    return `<${smallest.toFixed(DECIMAL_PRECISION)}`;
  }

  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: 20,
  });
  const decimalIdx = formatted.indexOf(".");
  if (decimalIdx === -1) {
    return formatted;
  }
  return formatted.slice(0, decimalIdx + 1 + DECIMAL_PRECISION);
};

export const humanFriendlyWei = (wei: BN | string) => {
  return humanFriendlyNumber(fromWei(wei.toString()));
};
