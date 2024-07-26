import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { createQR, encodeURL } from '@solana/pay';
import BigNumber from 'bignumber.js';
import dotenv from 'dotenv';
dotenv.config();

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const merchantAddress = new PublicKey('CzKZcazeXoUJr8nksqVivN8ReHZ7Hrof8tdkpguZmDua'); // Replace with your merchant's public key
const splToken = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

export async function generateSolanaPayURL(amount) {
  const amountInUsdc = new BigNumber(amount);

  const url = encodeURL({
    recipient: merchantAddress,
    mint: splToken,
    amount: amountInUsdc,
    label: 'Buy Credits',
    message: 'Purchase credits using Solana Pay',
  });

  return url.toString(); // Ensure the URL is returned as a string
}

export function createSolanaPayQR(url) {
  const qr = createQR(url, 512, 'white');
  return qr;
}

export async function checkTransactionStatus(signature) {
  try {
    const result = await connection.confirmTransaction(signature, 'confirmed');
    alert(result);
    return result.value.err === null; // Return true if the transaction has no errors
  } catch (error) {
    console.error('Error confirming transaction:', error);
    throw error;
  }
}

export async function getTransactionSignature(url) {
  const parsedURL = new URL(url);
  const params = new URLSearchParams(parsedURL.search);
  return params.get('reference'); // Assuming the transaction reference is passed in the URL
}
