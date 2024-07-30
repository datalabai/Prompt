import React, { useRef, useEffect, useState } from 'react';
import { PublicKey, Keypair, Connection, TransactionSignature } from '@solana/web3.js';
import { encodeURL, createQR, findReference, FindReferenceError, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';
import { Spinner } from './spinner'; // Import the Spinner component
import TickMark from './TickMark'; // Import the TickMark component
import { toast } from 'react-toastify';

interface SimpleQRCodeProps {
  input: string;
  setPaymentStatus: (status: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  paymentStatus: string;
}

const SimpleQRCode: React.FC<SimpleQRCodeProps> = ({ input, setPaymentStatus, setLoading, loading, paymentStatus }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrScanned, setQrScanned] = useState(false);

  async function verifyTx(
    recipient: PublicKey,
    amount: BigNumber,
    splToken: PublicKey | undefined,
    reference: PublicKey,
    memo: string
  ) {
    console.log(`5. Verifying the payment`);

    const connection = new Connection('https://devnet.helius-rpc.com/?api-key=423d5aa1-fcad-42f7-936f-3f8f318158c4', 'confirmed');
    // Merchant app locates the transaction signature from the unique reference address it provided in the transfer link
    const found = await findReference(connection, reference);

    // Merchant app should always validate that the transaction transferred the expected amount to the recipient
    const response = await validateTransfer(
      connection,
      found.signature,
      {
        recipient,
        amount,
        splToken: undefined,
        reference,
        memo
      },
      { commitment: 'confirmed' }
    );
    return response;
  }

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true); // Start loading
        const recipient = new PublicKey('CzKZcazeXoUJr8nksqVivN8ReHZ7Hrof8tdkpguZmDua');
        const amount = new BigNumber(input);
        const reference = new Keypair().publicKey;
        const label = 'Test Store';
        const message = 'Test Store - Order #12';
        const memo = 'TS#12';
        const splToken = new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr');
        const url = encodeURL({ recipient, amount, reference, label, message, memo, splToken });
        const qrCode = createQR(url);

        if (qrRef.current) {
          qrRef.current.innerHTML = '';
          qrCode.append(qrRef.current);
        }

        // Check for payment confirmation
        const connection = new Connection('https://devnet.helius-rpc.com/?api-key=423d5aa1-fcad-42f7-936f-3f8f318158c4', 'confirmed');
        let signatureInfo;

        const { signature } = await new Promise<{ signature: TransactionSignature }>((resolve, reject) => {
          const interval = setInterval(async () => {
            console.count('Checking for transaction...');
            try {
              signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
              console.log('\n 🖌  Signature found: ', signatureInfo.signature);
              clearInterval(interval);
              setQrScanned(true); // QR code scanned
              resolve(signatureInfo);
            } catch (error: any) {
              if (!(error instanceof FindReferenceError)) {
                console.error(error);
                clearInterval(interval);
                reject(error);
              }
            }
          }, 1000); // Check every second
        });

        if (signature) {
          setPaymentStatus('Payment confirmed');
          toast.success('Payment confirmed', {
            onClose: () => window.location.reload() // Reload the page or redirect after confirmation
          });
        }
      } catch (error) {
        console.error(error);
        setPaymentStatus('Payment failed');
        toast.error('Payment failed');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    generateQRCode();
  }, [input, setPaymentStatus, setLoading]);

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef} />
      {loading && <Spinner size="large" show={loading} />}
      {qrScanned && <TickMark />}
    </div>
  );
}

export default SimpleQRCode;
