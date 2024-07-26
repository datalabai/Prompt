import { Keypair, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

export const generateQRParams = (amount) => {
  return {
    recipient: new PublicKey('CzKZcazeXoUJr8nksqVivN8ReHZ7Hrof8tdkpguZmDua'),
    amount: amount ? new BigNumber(amount) : null, 
    reference: new Keypair().publicKey,
    label: "Buying Credits for Prompt Generation",
    message: "Buying Credits for Prompt Generation",
    memo: "Buying Credits for Prompt Generation",
  };
};
